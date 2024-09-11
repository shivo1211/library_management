document.getElementById('loginForm').addEventListener('submit', async function (e) {
    e.preventDefault();
    const studentId = document.getElementById('studentId').value;
    const password = document.getElementById('password').value;
    const response = await fetch('/login', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ studentId, password })
    });
    
    const result = await response.json();
    if (result.success) {
        if (result.student.role === 'admin') {
            localStorage.setItem('adminId', studentId);
            window.location.href = `/admin?id=${studentId}`;
        } else {
            localStorage.setItem('studentId', studentId);
            window.location.href = `/student?id=${studentId}`;
        }
    } else {
        alert(result.message);
    }
});

document.getElementById('showPassword').addEventListener('change', function () {
    const passwordField = document.getElementById('password');
    if (this.checked) {
        passwordField.type = 'text';
    } else {
        passwordField.type = 'password';
    }
});
