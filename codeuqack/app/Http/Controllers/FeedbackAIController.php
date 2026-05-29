<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;
use Kreait\Firebase\Factory;

class FeedbackAIController extends Controller
{
    public function analyze(Request $request)
    {
        Log::info('AI ENDPOINT HIT', ['docId' => $request->docId]);

        $request->validate([
            'docId'   => 'required|string',
            'message' => 'required|string'
        ]);

        // ✅ CORRECT URL - model name must have a slash: distilbert/distilbert-base-...
        $response = Http::timeout(30)
            ->withHeaders([
                'Authorization' => 'Bearer ' . env('HUGGINGFACE_API_KEY'),
                'Content-Type'  => 'application/json',
            ])
            ->post(
                'https://router.huggingface.co/hf-inference/models/distilbert/distilbert-base-uncased-finetuned-sst-2-english',
                ['inputs' => $request->message]
            );

        Log::info('HuggingFace response', [
            'status' => $response->status(),
            'body'   => $response->body()
        ]);

        if (!$response->successful()) {
            Log::error('HuggingFace API failed', ['body' => $response->body()]);
            return response()->json(['error' => 'AI service failed: ' . $response->body()], 500);
        }

        $result = $response->json();
        Log::info('HuggingFace result', ['result' => $result]);

        // Handle both possible response structures
        $label = $result[0][0]['label']
              ?? $result[0]['label']
              ?? 'NEUTRAL';

        $sentiment = match (strtoupper($label)) {
            'POSITIVE' => 'positive',
            'NEGATIVE' => 'negative',
            default    => 'neutral',
        };

        Log::info('Sentiment result', ['label' => $label, 'sentiment' => $sentiment]);

        try {
            $firestore = (new Factory)
                ->withServiceAccount(storage_path('app/firebase.json'))
                ->createFirestore();

            $firestore->database()
                ->collection('feedback')
                ->document($request->docId)
                ->set(['sentiment' => $sentiment], ['merge' => true]);

        } catch (\Exception $e) {
            Log::error('Firestore update failed', ['error' => $e->getMessage()]);
            return response()->json(['error' => 'Could not save to database'], 500);
        }

        return response()->json([
            'status'    => 'ok',
            'sentiment' => $sentiment
        ]);
    }
}