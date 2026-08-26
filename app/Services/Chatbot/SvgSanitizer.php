<?php

namespace App\Services\Chatbot;

use Illuminate\Support\Str;

class SvgSanitizer
{
    public function sanitize(string $svg): string
    {
        $svg = trim($svg);

        if ($svg === '') {
            return '';
        }

        $svg = preg_replace('/<script\b[^>]*>.*?<\/script>/is', '', $svg);
        $svg = preg_replace('/<foreignObject\b[^>]*>.*?<\/foreignObject>/is', '', $svg);
        $svg = preg_replace('/\son[a-z]+="[^"]*"/i', '', $svg);
        $svg = preg_replace("/\son[a-z]+='[^']*'/i", '', $svg);

        return Str::contains($svg, '<svg') ? $svg : '';
    }
}