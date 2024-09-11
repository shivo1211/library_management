document.getElementById('issueBookForm').addEventListener('submit', async function (e) {
    e.preventDefault();
    const studentId = document.getElementById('studentId').value;
    const bookId = document.getElementById('bookId').value;
    const response = await fetch('/issue-book', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ studentId, bookId })
    });
    const result = await response.json();
    if (result.success) {
        alert('Book issued successfully');
    } else {
        alert(result.message);
    }
});

document.getElementById('logoutBtn').addEventListener('click', function() {
    localStorage.removeItem('adminId');
    window.location.href = '/';
});
