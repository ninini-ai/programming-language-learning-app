<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Barryvdh\DomPDF\Facade\Pdf;

class CertificateController extends Controller
{
    public function generate(Request $request, $course)
    {
        $courseName = $course === "cpp"
            ? "C++ Programming"
            : "Python Programming";

        $data = [
            "name" => $request->query("name", "Student"),
            "course" => $courseName,
            "date" => now()->format("d M Y"),
        ];

        $pdf = Pdf::loadView("certificate", $data);

        return $pdf->download("certificate.pdf");
    }
}
