<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\FeedbackAIController;

Route::post('/feedback/analyze', [FeedbackAIController::class, 'analyze']);
