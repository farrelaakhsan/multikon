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
            ['user_id' => $user->user_id, 'status' => 'active'],
            ['user_id' => $user->user_id, 'status' => 'active'],
        );

        $message = Message::create([
            'conversation_id' => $conversation->conversation_id,
            'user_id' => $user->user_id,
            'message' => $validated['message'],
            'sender_type' => 'user',
        ]);

        return response()->json([
            'success' => true,
            'data' => [
                'message_id' => $message->message_id,
                'message' => $message->message,
                'sender_type' => $message->sender_type,
                'created_at' => $message->created_at->toISOString(),
            ],
        ]);
    }

    public function poll(Request $request): JsonResponse
    {
        $request->validate([
            'since_id' => ['nullable', 'string', 'max:36'],
        ]);

        $user = $request->user();
        $sinceId = $request->input('since_id', '');

        $conversation = Conversation::where('user_id', $user->user_id)
            ->where('status', 'active')
            ->first();

        if (! $conversation) {
            return response()->json([
                'success' => true,
                'data' => [],
            ]);
        }

        $query = Message::where('conversation_id', $conversation->conversation_id);
        if ($sinceId) {
            $query->where('message_id', '>', $sinceId);
        }

        $messages = $query
            ->orderBy('message_id')
            ->get()
            ->map(fn ($m) => [
                'message_id' => $m->message_id,
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
