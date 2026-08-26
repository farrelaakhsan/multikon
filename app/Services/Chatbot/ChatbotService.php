<?php

namespace App\Services\Chatbot;

use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Str;
use RuntimeException;

class ChatbotService
{
    /**
     * Model yang berhasil dipakai pada request terakhir.
     * Dipakai oleh selectedModel() agar tidak selalu return model[0].
     */
    private ?string $resolvedModel = null;

    public function __construct(
        protected ChatbotPrompt $prompt,
        protected ChatbotResponseParser $parser,
        protected SvgSanitizer $svgSanitizer,
        protected ChatbotFallback $fallback,
    ) {}

    private const OUT_OF_SCOPE_REPLY = 'Maaf, saya hanya dapat membantu pertanyaan seputar produk, desain, dan layanan kitchen equipment stainless steel Multikon. Untuk topik di luar itu, saya belum dapat membantu. Silakan tanyakan terkait katalog, spesifikasi custom, atau hubungi konsultasi admin untuk bantuan lebih lanjut. Ada yang bisa saya bantu terkait kebutuhan dapur Anda?';

    public function generate(string $message, string $context, array $payload = [], array $history = []): array
    {
        if ($this->isOutOfScope($message)) {
            return $this->outOfScopeResponse($context);
        }

        try {
            $raw    = $this->callModel($message, $context, $payload, $history);
            $parsed = $this->parser->parse($raw);

            $title = $this->normalizeTitle($parsed['title'] ?? '', $message, $payload);
            $reply = $this->normalizeReply($parsed['reply'] ?? '');
            $svg   = $this->svgSanitizer->sanitize((string) ($parsed['svg'] ?? ''));
            if ($svg !== '' && ! $this->shouldAllowSvg($message, $history)) {
                $svg = '';
            }

            return [
                'reply'   => $reply,
                'title'   => $title,
                'svg'     => $svg,
                'model'   => $this->selectedModel(),
                'context' => $context,
            ];
        } catch (\Throwable $e) {
            Log::warning('Floating chatbot failed, using fallback', [
                'context' => $context,
                'error'   => $e->getMessage(),
            ]);

            return $this->fallbackResponse($message, $context, $payload, $history);
        }
    }

    private function callModel(string $message, string $context, array $payload = [], array $history = []): string
    {
        $baseUrl = trim((string) config('services.openrouter.base_url', ''));
        $apiKey  = trim((string) config('services.openrouter.api_key', ''));

        if ($baseUrl === '') {
            throw new RuntimeException('OPENROUTER_BASE_URL is not configured.');
        }

        if ($apiKey === '') {
            throw new RuntimeException('OPENROUTER_API_KEY is not configured.');
        }

        $systemPrompt = $this->prompt->build($message, $context, $payload);
        $models       = $this->candidateModels();
        $lastError    = null;

        $historyMessages = [];
        foreach ($history as $entry) {
            $role = $entry['role'] === 'assistant' ? 'assistant' : 'user';
            $historyMessages[] = ['role' => $role, 'content' => $entry['text']];
        }

        foreach ($models as $model) {
            try {
                $response = Http::timeout(60)
                    ->acceptJson()
                    ->withToken($apiKey)
                    ->withHeaders([
                        'HTTP-Referer' => config('app.url'),
                        'X-Title'      => config('app.name', 'Multikon'),
                    ])
                    ->post(rtrim($baseUrl, '/') . '/chat/completions', [
                        'model'       => $model,
                        'messages'    => array_merge(
                            [
                                ['role' => 'system', 'content' => $systemPrompt],
                            ],
                            $historyMessages,
                            [
                                ['role' => 'user', 'content' => $message],
                            ]
                        ),
                        'temperature' => 0.68,
                        'max_tokens'  => 1100,
                    ]);

                if (! $response->successful()) {
                    throw new RuntimeException(
                        'OpenRouter request failed: ' . $response->status() . ' ' . $response->body()
                    );
                }

                $content = data_get($response->json(), 'choices.0.message.content')
                    ?? data_get($response->json(), 'choices.0.text')
                    ?? data_get($response->json(), 'content')
                    ?? '';

                if (trim((string) $content) === '') {
                    throw new RuntimeException('Empty response content from OpenRouter.');
                }

                // Track model yang berhasil — dipakai oleh selectedModel()
                $this->resolvedModel = $model;

                return (string) $content;
            } catch (\Throwable $e) {
                $lastError = $e;

                Log::warning('OpenRouter model failed, trying next model', [
                    'model' => $model,
                    'error' => $e->getMessage(),
                ]);
            }
        }

        throw $lastError ?: new RuntimeException('All OpenRouter models failed.');
    }

    /**
     * Ambil daftar model kandidat dari config — bukan hardcoded.
     */
    private function candidateModels(): array
    {
        return array_filter([
            config('services.openrouter.model_primary'),
            config('services.openrouter.model_fallback'),
        ]);
    }

    /**
     * Return model yang benar-benar dipakai, bukan selalu model[0].
     */
    private function selectedModel(): string
    {
        return $this->resolvedModel
            ?? config('services.openrouter.model_primary', 'openai/gpt-oss-120b:free');
    }

    private function normalizeReply(string $reply): string
    {
        $reply = trim($reply);

        if ($reply === '') {
            return 'Saya sudah siapkan konsep awal untuk kebutuhan Anda.';
        }

        $reply = str_replace(['**', '__'], '', $reply);
        $reply = preg_replace('/\s+/u', ' ', $reply);
        $reply = trim($reply);
        $reply = $this->limitSentences($reply, 5);

        return Str::limit($reply, 580, '...');
    }

    private function limitSentences(string $text, int $maxSentences = 3): string
    {
        $parts = preg_split('/(?<=[.!?])\s+/u', $text, -1, PREG_SPLIT_NO_EMPTY);

        if (! is_array($parts) || $parts === []) {
            return $text;
        }

        return trim(implode(' ', array_slice($parts, 0, max(1, $maxSentences))));
    }

    private function normalizeTitle(string $title, string $message, array $payload): string
    {
        $title = trim($title);

        if ($title !== '') {
            return $title;
        }

        if (isset($payload['product']['name']) && trim((string) $payload['product']['name']) !== '') {
            return trim((string) $payload['product']['name']);
        }

        return Str::limit($message, 42, '...');
    }

    private function fallbackResponse(string $message, string $context, array $payload = [], array $history = []): array
    {
        if ($this->isOutOfScope($message)) {
            return $this->outOfScopeResponse($context);
        }

        $title = $this->normalizeTitle('', $message, $payload);
        $svg = $this->shouldAllowSvg($message, $history) ? $this->fallback->svg($title, $context, $message) : '';

        return [
            'reply'   => $this->fallback->reply($context, $message, $history),
            'title'   => $title,
            'svg'     => $svg,
            'model'   => $this->selectedModel(),
            'context' => $context,
        ];
    }

    private function isOutOfScope(string $message): bool
    {
        $m = mb_strtolower(trim($message));
        if ($m === '' || mb_strlen($m) <= 8) {
            return false;
        }

        $allow = '/\b(multikon|kitchen|dapur|stainless|work\s*table|sink|cabinet|rak|kompor|hood|pastry|bakery|horeca|catalog|katalog|custom|fabrikasi|termin|top|dp\b|b2b|harga|pesan|order|pengiriman|rajaongkir|produk|desain|design|rancangan|sketsa|ukuran|material|dimensi|layanan|konsultasi|pembayaran|invoice|faktur|garansi)\b/iu';

        return !preg_match($allow, $m);
    }

    private function outOfScopeResponse(string $context): array
    {
        return [
            'reply'   => self::OUT_OF_SCOPE_REPLY,
            'title'   => 'Di luar topik Multikon',
            'svg'     => '',
            'model'   => $this->selectedModel(),
            'context' => $context,
        ];
    }

    private function shouldAllowSvg(string $message, array $history = []): bool
    {
        return (bool) preg_match('/\b(desain|design|rancangan|sketsa)\b/iu', $message);
    }
}