<!DOCTYPE html>
<html>
<head>
<meta charset="UTF-8">
<style>
  * { margin: 0; padding: 0; box-sizing: border-box; }

  @page {
    margin: 0;
  }

  body {
    font-family: "Georgia", "Times New Roman", serif;
    background: #f8d76c;
    width: 100%;
  }

  /* ── Outer yellow frame ── */
  .frame {
    background: #ffe17e;
    padding: 20px;
    border-radius: 32px;
    margin: 20px;
  }

  /* ── Inner cream card ── */
  .card {
    background: #FFF8E1;
    border-radius: 22px;
    border: 4px solid #4E342E;
    padding: 30px 60px;
    text-align: center;
  }

  .logo {
    width: 64px;
    height: 64px;
    object-fit: contain;
    margin-bottom: 4px;
  }

  .brand-name {
    font-size: 14px;
    font-weight: bold;
    color: #4E342E;
    letter-spacing: 1px;
    margin-bottom: 14px;
  }

  .cert-main-title {
    font-size: 46px;
    font-weight: 800;
    color: #4E342E;
    letter-spacing: 3px;
    line-height: 1;
    text-transform: uppercase;
    margin-bottom: 2px;
  }

  .cert-sub-title {
    font-size: 16px;
    font-weight: bold;
    color: #4E342E;
    letter-spacing: 5px;
    text-transform: uppercase;
    margin-bottom: 14px;
  }

  .presented-text {
    font-size: 13px;
    color: #555;
    font-style: italic;
    margin-bottom: 6px;
  }

  .student-name {
    font-size: 46px;
    font-weight: 800;
    font-style: italic;
    color: #1a1a2e;
    line-height: 1.1;
    margin-bottom: 14px;
  }

  .completing-text {
    font-size: 13px;
    color: #555;
    font-style: italic;
    margin-bottom: 10px;
  }

  .course-pill {
    display: inline-block;
    background: #A5D6A7;
    border-radius: 8px;
    padding: 7px 28px;
    font-size: 16px;
    font-weight: bold;
    color: #4E342E;
    letter-spacing: 0.5px;
    margin-bottom: 10px;
  }

  .date-text {
    font-size: 13px;
    color: #555;
    font-style: italic;
    margin-bottom: 18px;
  }

  /* ── Stamp ── */
  .stamp-area {
    text-align: center;
    margin-bottom: 8px;
  }

  .stamp-img {
    width: 64px;
    height: 64px;
    object-fit: contain;
  }

  .stamp-placeholder {
    display: inline-block;
    width: 64px;
    height: 64px;
    border-radius: 50%;
    border: 3px solid #e9c46a;
    background: radial-gradient(circle, #f9e07a 60%, #e9c46a 100%);
    text-align: center;
    line-height: 58px;
    box-shadow: 0 0 0 2px #f5a623, 0 0 0 3px #e9c46a;
    font-size: 24px;
    color: #c47a2b;
  }

  /* ── Signatures: use a table instead of flex, DomPDF handles tables well ── */
  .sigs-table {
    margin: 0 auto;
    border-collapse: collapse;
  }

  .sigs-table td {
    width: 200px;
    text-align: center;
    vertical-align: bottom;
    padding: 0 30px;
  }

  .sig-img {
    height: 40px;
    object-fit: contain;
    margin-bottom: 4px;
  }

  .sig-placeholder {
    height: 40px;
    font-style: italic;
    font-size: 18px;
    color: #3b1f0a;
    margin-bottom: 4px;
  }

  .sig-line {
    width: 120px;
    height: 1.5px;
    background: #3b1f0a;
    margin: 0 auto 4px;
  }

  .sig-label {
    font-size: 11px;
    font-weight: bold;
    color: #3b1f0a;
    text-align: center;
    line-height: 1.3;
  }

  .sig-sublabel {
    font-size: 9px;
    color: #888;
    text-align: center;
  }
</style>
</head>

<body>
<div class="frame">
  <div class="card">

    <img src="{{ public_path('images/mascotCodeQuackapp.png') }}" class="logo" alt="CodeQuack">
    <div class="brand-name">CodeQuack</div>

    <div class="cert-main-title">Certificate</div>
    <div class="cert-sub-title">of Appreciation</div>

    <p class="presented-text">This certificate is presented to:</p>
    <div class="student-name">{{ $name }}</div>

    <p class="completing-text">for successfully completing</p>
    <div class="course-pill">{{ $course }}</div>

    <p class="date-text">Awarded on: {{ $date }}</p>

    <div class="stamp-area">
      @if(file_exists(public_path('images/stamp.png')))
        <img src="{{ public_path('images/stamp.png') }}" class="stamp-img" alt="Stamp">
      @else
        <div class="stamp-placeholder">&#9733;</div>
      @endif
    </div>

    <table class="sigs-table">
      <tr>
        <td>
          @if(file_exists(public_path('images/sig1.png')))
            <img src="{{ public_path('images/sig1.png') }}" class="sig-img" alt="Signature 1"><br>
          @else
            <div class="sig-placeholder">Naifa Alam</div>
          @endif
          <div class="sig-line"></div>
          <div class="sig-label">Co-Founder</div>
          <div class="sig-sublabel">CodeQuack</div>
        </td>
        <td>
          @if(file_exists(public_path('images/sig2.png')))
            <img src="{{ public_path('images/sig2.png') }}" class="sig-img" alt="Signature 2"><br>
          @else
            <div class="sig-placeholder">Muskan Qureshi</div>
          @endif
          <div class="sig-line"></div>
          <div class="sig-label">Co-Founder</div>
          <div class="sig-sublabel">CodeQuack</div>
        </td>
      </tr>
    </table>

  </div>
</div>
</body>
</html>