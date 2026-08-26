<?php

namespace App\Http\Controllers;

use App\Models\Conversation;
use App\Models\Message;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class ChatController extends Controller
{
    public function store(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'message' => ['required', 'string', 'max:2000'],
        ]);

        $user = $request->user();

        $conversation = Conversation::firstOrCreate(
            ['user_id' => $user->id, 'status' => 'active'],
            ['user_id' => $user->id, 'status' => 'active'],
        );

        $message = Message::create([
            'conversation_id' => $conversation->id,
            'user_id' => $user->id,
            'message' => $validated['message'],
            'sender_type' => 'user',
        ]);

        return response()->json([
            'success' => true,
            'data' => [
                'id' => $message->id,
                'message' => $message->message,
                'sender_type' => $message->sender_type,
                'created_at' => $message->created_at->toISOString(),
            ],
        ]);
    }

    public function poll(Request $request): JsonResponse
    {
        $request->validate([
            'since_id' => ['nullable', 'integer', 'min:0'],
        ]);

        $user = $request->user();
        $sinceId = (int) $request->input('since_id', 0);

        $conversation = Conversation::where('user_id', $user->id)
            ->where('status', 'active')
            ->first();

        if (! $conversation) {
            return response()->json([
                'success' => true,
                'data' => [],
            ]);
        }

        $messages = Message::where('conversation_id', $conversation->id)
            ->where('id', '>', $sinceId)
            ->orderBy('id')
            ->get()
            ->map(fn ($m) => [
                'id' => $m->id,
                'message' => $m->message,
                'sender_type' => $m->sender_type,
                'created_at' => $m->created_at->toISOString(),
            ]);

        return response()->json([
            'success' => true,
            'data' => $messages,
        ]);
    }
}
