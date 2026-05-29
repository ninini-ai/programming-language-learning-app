<!DOCTYPE html>
<html>
<head>
    <style>
        body {
            font-family: "Georgia", serif;
            text-align: center;
            padding: 60px;
            background: #fffaf0;
        }

        .certificate-box {
            border: 12px solid #f4a261;
            padding: 50px;
            border-radius: 20px;
        }

        .logo {
            width: 90px;
            margin-bottom: 15px;
        }

        h1 {
            font-size: 48px;
            margin-bottom: 10px;
            color: #2a2a2a;
        }

        .subtitle {
            font-size: 20px;
            color: #555;
            margin-bottom: 30px;
        }

        .name {
            font-size: 40px;
            font-weight: bold;
            color: #2a9d8f;
            margin: 20px 0;
        }

        .course {
            font-size: 26px;
            font-weight: bold;
            color: #264653;
        }

        .date {
            margin-top: 25px;
            font-size: 18px;
            color: #444;
        }

        .footer {
            margin-top: 50px;
            font-size: 16px;
            color: gray;
        }

        .signature {
            margin-top: 60px;
            display: flex;
            justify-content: space-between;
        }

        .sign-box {
            width: 200px;
            border-top: 2px solid black;
            font-size: 14px;
            padding-top: 5px;
        }
    </style>
</head>

<body>
    <div class="certificate-box">
        <img src="{{ public_path('images/mascotCodeQuackapp.png') }}"
             class="logo">

        <h1>Certificate of Completion</h1>
        <p class="subtitle">
            This certificate is proudly awarded to
        </p>
        <div class="name">
            {{ $name }}
        </div>
        <p class="subtitle">
            for successfully completing the course
        </p>

        <div class="course">
            {{ $course }}
        </div>
        <p class="date">
            Awarded on: {{ $date }}
        </p>

        <div class="signature">
            <div class="sign-box">Instructor</div>
            <div class="sign-box">CodeQuack Team</div>
        </div>

        <div class="footer">
            CodeQuack Learning Platform - Gamified Coding for Beginners
        </div>

    </div>
</body>
</html>
