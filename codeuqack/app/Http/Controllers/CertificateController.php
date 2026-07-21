<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Barryvdh\DomPDF\Facade\Pdf;
use Kreait\Firebase\Factory;
use Kreait\Firebase\ServiceAccount;

class CertificateController extends Controller
{
    public function generate(Request $request, $course)
    {
        $name = $request->query("name", "Student");

        $courseName = $course === "cpp"
            ? "C++ Programming"
            : "Python Programming";

        // The date is passed from JS (either stored date or today if first time)
        $date = $request->query("date", now()->format("d M Y"));

        $data = [
            "name"       => $name,
            "course"     => $courseName,
            "courseCode" => strtoupper($course),
            "date"       => $date,
        ];

        $pdf = Pdf::loadView("certificate", $data)
                  ->setPaper("a4", "landscape");

        return $pdf->download("{$courseName}_Certificate.pdf");
    }
}