<?php

namespace App\Services\Chatbot;

class ChatbotFallback
{
    private const OUT_OF_SCOPE_REPLY = 'Maaf, saya hanya dapat membantu pertanyaan seputar produk, desain, dan layanan kitchen equipment stainless steel Multikon. Untuk topik di luar itu, saya belum dapat membantu. Silakan tanyakan terkait katalog, spesifikasi custom, atau hubungi konsultasi admin untuk bantuan lebih lanjut. Ada yang bisa saya bantu terkait kebutuhan dapur Anda?';

    public function reply(string $context, string $message = '', array $history = []): string
    {
        if ($this->isOutOfScope($message)) {
            return self::OUT_OF_SCOPE_REPLY;
        }

        return match ($context) {
            'home'           => 'Halo! Saya siap membantu Anda seputar produk, desain, dan layanan Multikon. Ada yang bisa saya bantu?',
            'catalog'        => 'Halo! Saya bisa bantu menjelaskan produk di katalog atau buatkan konsep desain sesuai kebutuhan Anda.',
            'product_detail' => 'Halo! Saya bisa bantu jelaskan detail produk ini atau buatkan konsep desain yang disesuaikan.',
            default          => 'Halo! Saya siap membantu Anda seputar produk, desain, dan layanan Multikon. Ada yang bisa saya bantu?',
        };
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

    public function svg(string $title, string $context, string $message = ''): string
    {
        if ($message !== '' && $this->isOutOfScope($message)) {
            return '';
        }

        $appName      = config('app.name', 'Multikon');
        $safeTitle    = htmlspecialchars($title, ENT_QUOTES, 'UTF-8');
        $safeAppName  = htmlspecialchars($appName, ENT_QUOTES, 'UTF-8');

        $contextLabel = htmlspecialchars(match ($context) {
            'home'           => 'Homepage Concept',
            'catalog'        => 'Catalog Concept',
            'product_detail' => 'Product Detail Concept',
            default          => "{$appName} Concept",
        }, ENT_QUOTES, 'UTF-8');

        return <<<SVG
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 800" role="img" aria-label="{$safeTitle}">
  <defs>
    <linearGradient id="g1" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#f8fafc"/>
      <stop offset="100%" stop-color="#e2e8f0"/>
    </linearGradient>
  </defs>
  <rect width="1200" height="800" rx="32" fill="url(#g1)"/>
  <rect x="70" y="70" width="1060" height="660" rx="28" fill="#ffffff" stroke="#cbd5e1" stroke-width="4"/>
  <text x="110" y="145" font-family="Arial, sans-serif" font-size="36" font-weight="700" fill="#0f172a">{$safeTitle}</text>
  <text x="110" y="190" font-family="Arial, sans-serif" font-size="18" fill="#475569">{$contextLabel}</text>
  <rect x="160" y="255" width="880" height="290" rx="24" fill="#e2e8f0" stroke="#94a3b8" stroke-width="4"/>
  <rect x="225" y="305" width="230" height="170" rx="18" fill="#ffffff" stroke="#64748b" stroke-width="4"/>
  <rect x="485" y="305" width="230" height="170" rx="18" fill="#ffffff" stroke="#64748b" stroke-width="4"/>
  <rect x="745" y="305" width="230" height="170" rx="18" fill="#ffffff" stroke="#64748b" stroke-width="4"/>
  <line x1="160" y1="585" x2="1040" y2="585" stroke="#94a3b8" stroke-width="4" stroke-dasharray="14 10"/>
  <text x="160" y="645" font-family="Arial, sans-serif" font-size="20" fill="#475569">Simple technical sketch — {$safeAppName}</text>
</svg>
SVG;
    }
}