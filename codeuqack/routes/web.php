<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\LessonController;
use App\Http\Controllers\FeedbackAIController;

use App\Http\Controllers\CertificateController;
Route::get('/', function () {
    return view('welcome');
});
Route::get('/secure', function () {
    return response()->json(['message' => 'You are authenticated!']);
})->middleware('firebase.auth');
Route::get('/auth', function () {
    return view('auth'); 
})->name('auth');
Route::get('/dashboard', function () {
    return view('dashboard');
})->name('dashboard');


Route::get('/chat-select', fn () => view('chat-select'));
Route::get('/chat', fn () => view('chat'));

Route::get('/games', function () {
    return view('games');
});

Route::get('/feedback', function () {
    return view('feedback');
});


Route::get('/certificate/{course}', [CertificateController::class, 'generate']);

// lesons
Route::get('/courses', function () {
    return view('courses');
});

Route::get('/lessons/{course}', function ($course) {
    return view('lessons', compact('course'));
});

Route::get('/lesson/{course}/{lessonId}', function ($course, $lessonId) {
    return view('lesson-view', compact('course', 'lessonId'));
});
Route::get('/quiz/{course}/{quizId}', function ($course, $quizId) {
    return view('quiz', compact('course', 'quizId'));
});
Route::get('/leaderboard', function () {
    return view('leaderboard');
});

// quizzes
Route::get('/quiz-data/{course}/{quizId}', function ($course, $quizId) {

    $path = resource_path(
        "data/quizzes/$course/$quizId.json"
    );

    if (!file_exists($path)) {
        return response()->json([
            'title' => 'Quiz Not Found',
            'questions' => []
        ]);
    }

    return response()->json(
        json_decode(
            file_get_contents($path),
            true
        )
    );
});
//games 
Route::get('/games/cpp/bug-hunter',    fn () => view('games.bug-hunter', ['course' => 'cpp']));
Route::get('/games/python/bug-hunter', fn () => view('games.bug-hunter', ['course' => 'python']));

Route::get('/games/cpp/code-maze',    fn () => view('games.code-maze', ['course' => 'cpp']));
Route::get('/games/python/code-maze', fn () => view('games.code-maze', ['course' => 'python']));

Route::get('/games/cpp/code-sorter',    fn () => view('games.code-sorter', ['course' => 'cpp']));
Route::get('/games/python/code-sorter', fn () => view('games.code-sorter', ['course' => 'python']));

Route::get('/games/cpp/bucket-game',    fn () => view('games.bucket-game', ['course' => 'cpp']));
Route::get('/games/python/bucket-game', fn () => view('games.bucket-game', ['course' => 'python']));