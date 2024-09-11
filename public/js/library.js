document.addEventListener('DOMContentLoaded', async function () {
    const response = await fetch('/books');
    const books = await response.json();
    const booksList = document.getElementById('booksList');
    books.forEach(book => {
        const listItem = document.createElement('li');
        listItem.innerText = `${book.title} by ${book.author} - ${book.available ? 'Available' : 'Issued'}`;
        booksList.appendChild(listItem);
    });

    document.getElementById('backToStudentBtn').addEventListener('click', function() {
        window.history.back();
    });

    document.getElementById('logoutBtn').addEventListener('click', function() {
        localStorage.removeItem('studentId');
        window.location.href = '/';
    });
});
