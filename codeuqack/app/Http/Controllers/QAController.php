<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;

class QAController extends Controller
{
    public function ask(Request $request)
    {
        $question    = trim($request->input('question', ''));
        $course      = trim($request->input('course', ''));
        $lessonTitle = trim($request->input('lessonTitle', ''));

        if (!$question) {
            return response()->json(['error' => 'No question provided'], 400);
        }

        $apiKey = env('GROQ_API_KEY');

        if (!$apiKey) {
            return response()->json(['error' => 'API key not configured. Add GROQ_API_KEY to your .env file.'], 500);
        }

        $courseLabel = $course === 'cpp' ? 'C++' : 'Python';

        $systemPrompt = "You are a beginner coding tutor for {$courseLabel}. "
            . "Current lesson: \"{$lessonTitle}\". "
            . "If the question is about programming or {$courseLabel}, answer in 3-4 simple sentences. "
            . "If completely unrelated to programming, say so politely and suggest a related question. "
            . "Always reply ONLY with a JSON object like this (no markdown, no extra text): "
            . "{\"relevant\":true,\"answer\":\"your answer\",\"warning\":\"\",\"suggestions\":[\"q1\",\"q2\"]}";

        $payload = [
    'model' => 'openai/gpt-oss-120b', 
    'max_tokens' => 400,   // no long answers
    'messages'   => [
        [
            'role'    => 'system',
            'content' => $systemPrompt,
        ],
        [
            'role'    => 'user',
            'content' => $question,
        ],
    ],
];
        try {
            $response = Http::timeout(20)
                ->withHeaders([
                    'Authorization' => 'Bearer ' . $apiKey,
                    'Content-Type'  => 'application/json',
                ])
                ->post('https://api.groq.com/openai/v1/chat/completions', $payload);

            // Log the raw response for debugging
            Log::info('Groq response status: ' . $response->status());
            Log::info('Groq response body: '   . $response->body());

            if ($response->status() === 400) {
                $errorBody = $response->json();
                $errorMsg  = $errorBody['error']['message'] ?? 'Bad request to AI service.';
                Log::error('Groq 400 error: ' . $errorMsg);
                return response()->json(['error' => 'AI error: ' . $errorMsg], 500);
            }

            if ($response->status() === 401) {
                return response()->json(['error' => 'Invalid API key. Check your GROQ_API_KEY in .env'], 500);
            }

            if ($response->status() === 429) {
                return response()->json(['error' => 'Too many requests. Please wait a moment and try again.'], 500);
            }

            if (!$response->successful()) {
                return response()->json(['error' => 'AI service returned error ' . $response->status()], 500);
            }
if ($response->status() === 404) {
    Log::error('Groq 404 — model likely deprecated/renamed: meta-llama/llama-4-scout-17b-16e-instruct');
    return response()->json(['error' => 'AI model unavailable. Please contact support.'], 500);
}
            $body = $response->json();

            if (!isset($body['choices'][0]['message']['content'])) {
                Log::error('Groq unexpected structure: ' . json_encode($body));
                return response()->json(['error' => 'Unexpected response from AI. Please try again.'], 500);
            }

            $raw = $body['choices'][0]['message']['content'];

            // ── Clean markdown fences ─────────────────────
            $cleaned = preg_replace('/```json\s*/i', '', $raw);
            $cleaned = preg_replace('/```\s*/i',     '', $cleaned);
            $cleaned = trim($cleaned);

            // ── Extract JSON object ───────────────────────
            preg_match('/\{.*\}/s', $cleaned, $matches);
            $jsonString = $matches[0] ?? $cleaned;

            $parsed = json_decode($jsonString, true);

            if (!$parsed || !array_key_exists('relevant', $parsed)) {
                // Model didn't follow JSON format — treat raw text as the answer
                return response()->json([
                    'relevant'    => true,
                    'answer'      => strip_tags($cleaned),
                    'warning'     => '',
                    'suggestions' => [],
                ]);
            }

            return response()->json([
                'relevant'    => (bool)($parsed['relevant']    ?? true),
                'answer'      => (string)($parsed['answer']    ?? ''),
                'warning'     => (string)($parsed['warning']   ?? ''),
                'suggestions' => (array)($parsed['suggestions'] ?? []),
            ]);

        } catch (\Illuminate\Http\Client\ConnectionException $e) {
            Log::error('Groq connection error: ' . $e->getMessage());
            return response()->json(['error' => 'Cannot connect to AI. Check your internet connection.'], 500);
        } catch (\Exception $e) {
            Log::error('QA Controller error: ' . $e->getMessage());
            return response()->json(['error' => 'Server error: ' . $e->getMessage()], 500);
        }
    }
}