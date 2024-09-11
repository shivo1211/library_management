const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const xlsx = require('xlsx');
const session = require('express-session');
const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));
app.use(session({ secret: 'library_secret', resave: false, saveUninitialized: true }));

const booksPath = path.join(__dirname, 'data', 'books.xlsx');
const studentsPath = path.join(__dirname, 'data', 'students.xlsx');

// Load Excel data
const loadExcelData = (filePath) => {
    const workbook = xlsx.readFile(filePath);
    const sheetName = workbook.SheetNames[0];
    return xlsx.utils.sheet_to_json(workbook.Sheets[sheetName]);
};

let booksData = loadExcelData(booksPath);
let studentsData = loadExcelData(studentsPath);

console.log('Books Data:', booksData);
console.log('Students Data:', studentsData);

// Routes
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'views', 'index.html'));
});

app.get('/student', (req, res) => {
    if (!req.session.studentId) {
        return res.redirect('/');
    }
    res.sendFile(path.join(__dirname, 'views', 'student.html'));
});

app.get('/admin', (req, res) => {
    if (!req.session.adminId) {
        return res.redirect('/');
    }
    res.sendFile(path.join(__dirname, 'views', 'admin.html'));
});

app.get('/library', (req, res) => {
    res.sendFile(path.join(__dirname, 'views', 'library.html'));
});

app.post('/login', (req, res) => {
    const { studentId, password } = req.body;
    console.log('Received login request for student ID:', studentId);
    const student = studentsData.find(stu => String(stu.id) === String(studentId) && stu.password === password);
    if (student) {
        if (student.role === 'admin') {
            req.session.adminId = studentId; // Store admin ID in session
        } else {
            req.session.studentId = studentId; // Store student ID in session
        }
        res.json({ success: true, student });
    } else {
        res.json({ success: false, message: 'Invalid student ID or password' });
    }
});

app.get('/books', (req, res) => {
    res.json(booksData);
});

app.post('/issue-book', (req, res) => {
    const { studentId, bookId } = req.body;
    const student = studentsData.find(stu => String(stu.id) === String(studentId));
    const book = booksData.find(bk => String(bk.id) === String(bookId));
    if (student && book && book.available) {
        book.available = false;
        student.issuedBooks = student.issuedBooks || [];
        student.issuedBooks.push(bookId);
        res.json({ success: true, message: 'Book issued successfully' });
    } else {
        res.json({ success: false, message: 'Error in issuing book' });
    }
});

app.get('/student-data', (req, res) => {
    const studentId = req.query.id;
    const student = studentsData.find(stu => String(stu.id) === String(studentId));
    if (student) {
        res.json({ success: true, student });
    } else {
        res.json({ success: false, message: 'Student not found' });
    }
});

app.listen(3000, () => {
    console.log('Server is running on http://localhost:3000');
});
