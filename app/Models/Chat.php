<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use App\Models\User;

class Chat extends Model
{
    protected $fillable = [
        'user_id',
        'session_id',
        'user_message',
        'ai_message',
        'ai_data',
        'image_url',
    ];

    protected $casts = [
        'ai_data' => 'array',
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }
}