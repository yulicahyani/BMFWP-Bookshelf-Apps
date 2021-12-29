let books_list = [];

function saveBookData() {
  localStorage.setItem('book', JSON.stringify(books_list));
}

function createBookshelf(books_list) {
    const completedRead  = document.querySelector('.sudah-selesai-baca')
    const uncompletedRead  = document.querySelector('.belum-selesai-baca');
        
    completedRead.innerHTML = '';
    uncompletedRead.innerHTML = '';
  
    for(let book of books_list) {

        let bookItem = document.createElement('div');
        bookItem.id = book.id;
        bookItem.classList.add('book');

        let bookTitle = document.createElement('h4');
        bookTitle.innerText = `${book.title}`;

        let bookAuthor = document.createElement('p');
        bookAuthor.innerText = `Penulis: ${book.author}`;

        let bookYear = document.createElement('p');
        bookYear.innerText = `Tahun: ${book.year}`;
        
        let bookStatus = document.createElement('button');
        bookStatus.innerText = `${ book.isComplete ? 'Belum selesai' : 'Sudah selesai'}`;
        bookStatus.classList.add('button', 'button-success');
        bookStatus.addEventListener('click', changeState);

        let edit = document.createElement('button');
        edit.innerText = 'Edit';
        edit.classList.add('button', 'button-warning');
        edit.addEventListener('click', editBook);

        let hapus = document.createElement('button');
        hapus.innerText = 'Hapus';
        hapus.classList.add('button', 'button-danger');
        hapus.addEventListener('click', deleteBook)
        hapus.innerHTML = '<span class="material-icons" id="ic-hapus">delete</span>';


        [bookTitle, bookAuthor, bookYear, bookStatus, edit, hapus].forEach(e => {
            bookItem.appendChild(e);
        });
        
        if(book.isComplete){
            completedRead.appendChild(bookItem);
        }
        else {
            uncompletedRead.appendChild(bookItem);
        }
    }
    
    if(!completedRead.hasChildNodes()){
        completedRead.innerHTML = 'Kosong!';
    }
    else {
        0;
    }

    if(!uncompletedRead.hasChildNodes()){
        uncompletedRead.innerHTML = 'Kosong!';
    }
    else {
        0;
    }
}

function addNewBook() {
    
    const inputForm = document.querySelector('.input-buku>form');
    const posisi = inputForm.id;
    
    let title = document.querySelector('#title');
    let author = document.querySelector('#author');
    let year = document.querySelector('#year');
    let isComplete = document.querySelector('#isCompleteRead');
    
    let bookObject = {
      id: +new Date(),
      title: title.value,
      author: author .value,
      year:  year.value,
      isComplete: isComplete.checked
    }

    
    if(posisi) {
      books_list[posisi].title  = bookObject.title;
      books_list[posisi].author = bookObject.author;
      books_list[posisi].year   = bookObject.year;
      books_list[posisi].isComplete = bookObject.isComplete;
    }
    else {
        books_list.push(bookObject);
    }
    
    saveBookData();
    createBookshelf(books_list);

    inputForm.removeAttribute('id');
    inputForm.reset();
}

function searchBook(e) {
    e.preventDefault();
    const title = document.querySelector('#searchTitle');
    query = title.value;
    
    if(query){
        createBookshelf(books_list.filter((function(book){
            return book.title.toLowerCase().includes(query.toLowerCase());
        })));
    }
    else{
        createBookshelf(books_list);
    }
}

function changeState(e) {
    const posisi = books_list.findIndex(i => i.id == e.target.parentNode.id);
    books_list[posisi].isComplete = !books_list[posisi].isComplete;
    
    saveBookData();
    createBookshelf(books_list);
}

function deleteBook(e) {
    if(confirm('Apakah anda yakin menghapus buku ini?')) {
        const posisi = books_list.findIndex(i => i.id == e.target.parentNode.id);
        books_list.splice(posisi, 1);

        saveBookData();
        createBookshelf(books_list);
    }
}

function editBook(e) {
    const posisi = books_list.findIndex(i => i.id == e.target.parentNode.id);
    
    let title = document.querySelector('#title');
    let author = document.querySelector('#author');
    let year = document.querySelector('#year');
    let isComplete = document.querySelector('#isCompleteRead');
    
    title.value  = books_list[posisi].title;
    author.value = books_list[posisi].author;
    year.value   = books_list[posisi].year;
    isComplete.checked = books_list[posisi].isComplete;
    
    const form = document.querySelector('.input-buku>form');
    form.id = posisi;
    
    const tambahBuku = document.querySelector('#tambahBuku');
    tambahBuku.innerText = 'Cancel Edit';

    const inputBukuH3 = document.querySelector('.input-buku>h3');
    inputBukuH3.innerText = 'Edit Data Buku';

    const inputBuku = document.querySelector('.input-buku');
    inputBuku.classList.remove('hide');
    inputBuku.scrollIntoView();
    
    title.focus();
}

window.addEventListener('load', () => {
    books_list = JSON.parse(localStorage.getItem('book')) || [], createBookshelf(books_list);
    
    const inputBuku = document.querySelector('.input-buku');
    inputBuku.onsubmit = addNewBook;

    const checkbox = document.querySelector('#isCompleteRead');
    checkbox.onclick = (e) => {
        const inputBukuFormButton = document.querySelector('.input-buku>form>button');
        inputBukuFormButton.innerText = e.target.checked ? 'Tambahkan dalam rak sudah selesai dibaca' : 'Tambahkan dalam rak belum selesai dibaca';
    };
    
    const tambahBuku = document.querySelector('#tambahBuku');
    const inputBukuForm = document.querySelector('.input-buku>form')
    const inputBukuH3 = document.querySelector('.input-buku>h3');
    const searchbar = document.querySelector('.searchbar');
    const searchForm = document.querySelector('.searchbar>form');
    searchForm.onsubmit = searchBook;
    
    tambahBuku.onclick = () => {
        searchbar.classList.add('hide');
        const isEdit  = inputBukuForm.id;
        const isShown = !inputBuku.classList.contains('hide');
        if(isShown && isEdit) {
            if(confirm('Apakah anda yakin membatalkan pengeditan?')) {
                tambahBuku.innerText = 'Tambah Buku';
                inputBukuH3.innerText = 'Tambah Data Buku';
                inputBukuForm.removeAttribute('id');
                inputBukuForm.reset();
            }
        } else {
            inputBuku.classList.remove('hide');
            inputBukuForm.removeAttribute('id');
            inputBukuForm.reset();
        }
        
        searchForm.removeAttribute('id');
        searchForm.reset();
        createBookshelf(books_list);
    };


    const cariBuku = document.querySelector('#cariBuku');
    cariBuku.onclick = () => {
        searchbar.classList.remove('hide');
        inputBuku.classList.add('hide');
        inputBukuForm.removeAttribute('id');
        inputBukuForm.reset();
        tambahBuku.innerText = 'Tambah Buku';
        inputBukuH3.innerText = 'Tambah Data Buku';
    };

});