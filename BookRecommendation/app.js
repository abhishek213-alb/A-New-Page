const bookList = document.querySelector('#book-list');
const form = document.querySelector('#add-book-form');

// create element & render book
function renderCafe(doc){
    let li = document.createElement('li');
    let book = document.createElement('span');
    let topic = document.createElement('span');
    let cross = document.createElement('div');

    li.setAttribute('data-id', doc.id);
    book.textContent = doc.data().book;
    topic.textContent = doc.data().topic;
    cross.textContent = 'x';

    li.appendChild(book);
    li.appendChild(topic);
    li.appendChild(cross);

    bookList.appendChild(li);

    // deleting data
    cross.addEventListener('click', (e) => {
        e.stopPropagation();
        let id = e.target.parentElement.getAttribute('data-id');
        db.collection('books').doc(id).delete();
    });
}

// getting data
// db.collection('cafes').orderBy('city').get().then(snapshot => {
//     snapshot.docs.forEach(doc => {
//         renderCafe(doc);
//     });
// });

// saving data
form.addEventListener('submit', (e) => {
    e.preventDefault();
    db.collection('books').add({
        book: form.book.value,
        topic: form.topic.value
    });
    form.book.value = '';
    form.topic.value = '';
});

// real-time listener
db.collection('books').orderBy('topic').onSnapshot(snapshot => {
    let changes = snapshot.docChanges();
    changes.forEach(change => {
        console.log(change.doc.data());
        if(change.type == 'added'){
            renderCafe(change.doc);
        } else if (change.type == 'removed'){
            let li = cafeList.querySelector('[data-id=' + change.doc.id + ']');
            bookList.removeChild(li);
        }
    });
});