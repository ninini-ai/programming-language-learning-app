<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Kreait\Firebase\Auth as FirebaseAuth;
use Firebase\Auth\Token\Exception\InvalidToken;
use Illuminate\Support\Facades\Log;

class VerifyFirebaseToken
{
    protected $auth;

    public function __construct(FirebaseAuth $auth)
    {
        $this->auth = $auth;
    }

    public function handle(Request $request, Closure $next)
    {
        $authHeader = $request->bearerToken();
        if (!$authHeader) {
            return response()->json(['message' => 'Missing token'], 401);
        }

        try {
            $verified = $this->auth->verifyIdToken($authHeader);
            $uid = $verified->claims()->get('sub');

            // attach user info to request for controllers
            $firebaseUser = $this->auth->getUser($uid);
            $request->merge(['firebase_user' => $firebaseUser]);

        } catch (\Throwable $e) {
            Log::warning('Firebase token verify failed: '.$e->getMessage());
            return response()->json(['message' => 'Invalid token'], 401);
        }

        return $next($request);
    }
}
