<?php

namespace App\Services\Chatbot;

use Illuminate\Support\Str;

class ChatbotResponseParser
{
    public function parse(string $raw): array
    {
        $raw = trim($raw);

        if ($raw === '') {
            return [];
        }

        $json = $this->extractJson($raw);
        if ($json !== null) {
            $decoded = json_decode($json, true);

            if (is_array($decoded)) {
                return [
                    'title' => (string) ($decoded['title'] ?? ''),
                    'reply' => (string) ($decoded['reply'] ?? ''),
                    'svg' => (string) ($decoded['svg'] ?? ''),
                ];
            }
        }

        return [
            'title' => $this->extractSection($raw, 'TITLE'),
            'reply' => $this->extractSection($raw, 'REPLY') ?: $this->stripSectionMarkers($raw),
            'svg' => $this->extractSvg($raw),
        ];
    }

    private function extractJson(string $raw): ?string
    {
        if (!Str::contains($raw, '{') || !Str::contains($raw, '}')) {
            return null;
        }

        $start = strpos($raw, '{');
        $end = strrpos($raw, '}');

        if ($start === false || $end === false || $end <= $start) {
            return null;
        }

        return substr($raw, $start, $end - $start + 1);
    }

    private function extractSection(string $raw, string $section): string
    {
        $pattern = '/(?:^|\n)\s*' . preg_quote($section, '/') . '\s*:\s*(.*?)(?=\n\s*(?:TITLE|REPLY|SVG)\s*:|\z)/si';

        if (!preg_match($pattern, $raw, $matches)) {
            return '';
        }

        return trim((string) $matches[1]);
    }

    private function extractSvg(string $raw): string
    {
        $svg = $this->extractSection($raw, 'SVG');

        if ($svg !== '') {
            return $svg;
        }

        if (preg_match('/<svg\b[\s\S]*?<\/svg>/i', $raw, $matches)) {
            return (string) $matches[0];
        }

        return '';
    }

    private function stripSectionMarkers(string $raw): string
    {
        $text = preg_replace('/(?:^|\n)\s*(TITLE|REPLY|SVG)\s*:\s*/i', "\n", $raw);
        $text = preg_replace('/<svg\b[\s\S]*?<\/svg>/i', '', (string) $text);
        $text = strip_tags((string) $text);

        return trim((string) $text);
    }
}