<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Conversation;
use App\Models\Message;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class AdminChatController extends Controller
{
    public function index(): Response
    {
        $conversations = Conversation::with(['user', 'latestMessage'])
            ->where('status', 'active')
            ->orderBy('updated_at', 'desc')
            ->get()
            ->map(fn ($c) => [
                'conversation_id' => $c->conversation_id,
                'user' => [
                    'user_id' => $c->user->user_id,
                    'user_name' => $c->user->user_name,
                    'email' => $c->user->email,
                ],
                'latest_message' => $c->latestMessage?->message,
                'latest_message_at' => $c->latestMessage?->created_at?->toISOString(),
                'unread' => Message::where('conversation_id', $c->conversation_id)
                    ->where('sender_type', 'user')
                    ->where('created_at', '>', $c->updated_at)
                    ->exists(),
                'created_at' => $c->created_at->toISOString(),
            ]);

        return Inertia::render('Admin/Chat/Index', [
            'conversations' => $conversations,
        ]);
    }

    public function show(Conversation $conversation): Response
    {
        $conversation->load('user');

        $messages = Message::where('conversation_id', $conversation->conversation_id)
            ->orderBy('message_id')
            ->get()
            ->map(fn ($m) => [
                'message_id' => $m->message_id,
                'message' => $m->message,
                'sender_type' => $m->sender_type,
                'sender_name' => $m->sender_type === 'admin'
                    ? ($m->user->user_name ?? 'Admin')
                    : $conversation->user->user_name,
                'created_at' => $m->created_at->toISOString(),
            ]);

        return Inertia::render('Admin/Chat/Show', [
            'conversation' => [
                'conversation_id' => $conversation->conversation_id,
                'user' => [
                    'user_id' => $conversation->user->user_id,
                    'user_name' => $conversation->user->user_name,
                    'email' => $conversation->user->email,
                ],
                'status' => $conversation->status,
                'created_at' => $conversation->created_at->toISOString(),
            ],
            'messages' => $messages,
        ]);
    }

    public function reply(Request $request, Conversation $conversation): RedirectResponse
    {
        $validated = $request->validate([
            'message' => ['required', 'string', 'max:2000'],
        ]);

        $admin = $request->user();

        Message::create([
            'conversation_id' => $conversation->conversation_id,
            'user_id' => $admin->user_id,
            'message' => $validated['message'],
            'sender_type' => 'admin',
        ]);

        $conversation->touch();

        return redirect()->back()->with('success', 'Balasan terkirim.');
    }
}
