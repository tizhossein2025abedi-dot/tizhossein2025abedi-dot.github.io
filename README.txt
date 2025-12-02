Atinama LMS - Full Release (for AwardSpace or similar PHP hosting)

Contents:
- index.html, courses.html, course-*.html (course pages)
- login.html, register.html
- student-panel.html, teacher-panel.html, qa.html
- exam_free.html (links to exams.ir)
- style.css, app.js
- api.php (simple JSON state API)
- upload.php (file uploads to uploads/)
- data/state.json (initial state with default teacher account)
- README.txt (this file)

Important:
1) Upload all files and folders into your domain folder (e.g. /atinama.atwebpages.com/htdocs or similar).
2) Ensure the 'data' and 'uploads' folders are writable by the server (chmod 755 / 775).
3) Default teacher login: username: teacher  password: admin2025
4) Student registration: students register themselves; accounts remain unapproved until teacher approves them via Teacher Panel -> "دانش‌آموزان در انتظار تایید".
5) Buying a course redirects to WhatsApp: number 09300565169
6) Exam free link included and visible on homepage/course pages.
7) This is a demo/prototype: for production, secure the API, sanitize inputs, add authentication tokens and HTTPS.

Deploy notes for AwardSpace:
- Use File Manager to upload ZIP and extract.
- Ensure PHP version >=7 and write permissions on data/ and uploads/.

