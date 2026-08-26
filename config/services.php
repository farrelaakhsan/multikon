<?php

return [

    /*
    |--------------------------------------------------------------------------
    | Third Party Services
    |--------------------------------------------------------------------------
    */

    'postmark' => [
        'token' => env('POSTMARK_TOKEN'),
    ],

    'ses' => [
        'key'    => env('AWS_ACCESS_KEY_ID'),
        'secret' => env('AWS_SECRET_ACCESS_KEY'),
        'region' => env('AWS_DEFAULT_REGION', 'us-east-1'),
    ],

    'resend' => [
        'key' => env('RESEND_KEY'),
    ],

    'slack' => [
        'notifications' => [
            'bot_user_oauth_token' => env('SLACK_BOT_USER_OAUTH_TOKEN'),
            'channel'              => env('SLACK_BOT_USER_DEFAULT_CHANNEL'),
        ],
    ],

    // --- OpenRouter ---
    'openrouter' => [
        'base_url'       => env('OPENROUTER_BASE_URL', 'https://openrouter.ai/api/v1'),
        'api_key'        => env('OPENROUTER_API_KEY'),
        'model_primary'  => env('OPENROUTER_MODEL_PRIMARY', 'openai/gpt-oss-120b:free'),
        'model_fallback' => env('OPENROUTER_MODEL_FALLBACK', 'google/gemma-4-31b-it:free'),
    ],

    // --- WhatsApp ---
    'whatsapp' => [
        'number'       => env('WHATSAPP_NUMBER', '628123456789'),
        'admin_number' => env('WHATSAPP_ADMIN_NUMBER', '628123456789'),
    ],

    // --- RajaOngkir V2 ---
    'rajaongkir' => [
        'api_key'              => env('RAJAONGKIR_SC_API_KEY'),
        'base_url'             => env('RAJAONGKIR_BASE_URL', 'https://rajaongkir.komerce.id/api/v1'),
        'origin_district_id'   => 1363, // Pulo Gadung, Jakarta Timur
        'origin_subdistrict_id'=> 17733, // Jatinegara Kaum, Pulo Gadung
        'couriers'             => env('RAJAONGKIR_COURIERS', 'jne:sicepat:ide:sap:jnt:ninja:tiki:lion:anteraja:pos:ncs:rex:rpx:sentral:star:wahana'),
    ],

    'admin' => [
        'password' => env('ADMIN_PASSWORD', 'MultikonAdmin2026!'),
    ],

];