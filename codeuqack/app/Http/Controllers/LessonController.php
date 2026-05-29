<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

class LessonController extends Controller
{
    public function index()
    {
        return view('lessons.index');
    }

    public function course($course)
    {
        return view('lessons.course', [
            'course' => $course
        ]);
    }

    public function lesson($course, $lesson)
    {
        return view('lessons.lesson', [
            'course' => $course,
            'lesson' => $lesson
        ]);
    }
}