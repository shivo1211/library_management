document.addEventListener('DOMContentLoaded', async function () {
    const studentId = localStorage.getItem('studentId');
    if (!studentId) {
        window.location.href = '/';
        return;
    }
    const response = await fetch(`/student-data?id=${studentId}`);
    const result = await response.json();
    if (result.success) {
        const student = result.student;
        document.getElementById('studentInfo').innerText = `Welcome, ${student.name}`;
        const issuedBooksList = document.getElementById('issuedBooksList');
        if (student.issuedBooks) {
            student.issuedBooks.forEach(bookId => {
                const listItem = document.createElement('li');
                listItem.innerText = `Book ID: ${bookId}`;
                issuedBooksList.appendChild(listItem);
            });
        }
    } else {
        alert('Student not found');
        window.location.href = '/';
    }

    document.getElementById('viewLibraryBtn').addEventListener('click', function() {
        window.location.href = '/library';
    });

    document.getElementById('logoutBtn').addEventListener('click', function() {
        localStorage.removeItem('studentId');
        window.location.href = '/';
    });
});
