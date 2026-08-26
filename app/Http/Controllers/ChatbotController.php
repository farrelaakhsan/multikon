<?php

namespace App\Http\Controllers;

use App\Services\Chatbot\ChatbotService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class ChatbotController extends Controller
{
    public function message(Request $request, ChatbotService $chatbotService): JsonResponse
    {
        $validated = $request->validate([
            'message' => ['required', 'string', 'max:2000'],
            'context' => ['required', 'string', 'in:home,catalog,product_detail'],
            'payload' => ['nullable', 'array'],
            'history' => ['nullable', 'array'],
            'history.*.role' => ['required', 'string', 'in:user,assistant'],
            'history.*.text' => ['required', 'string'],
        ]);

        $result = $chatbotService->generate(
            $validated['message'],
            $validated['context'],
            $validated['payload'] ?? [],
            $validated['history'] ?? []
        );

        return response()->json([
            'success' => true,
            'data' => $result,
        ]);
    }
}