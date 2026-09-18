<?php

namespace App\Models;

use App\Traits\HasUuidPrimaryKey;
use Illuminate\Database\Eloquent\Model;
use App\Models\User;

class Chat extends Model
{
    use HasUuidPrimaryKey;
    protected $primaryKey = 'chat_id';
    protected $keyType = 'string';
    public $incrementing = false;
    protected $uuidRouteKeyName = 'chat_id';

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
        return $this->belongsTo(User::class, 'user_id', 'user_id');
    }
}
