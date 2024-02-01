function bookinfo(storeid) {
  axios
    .get(`storebook/${storeid}`)
    .then(function (response) {
      //   console.log(response.data);
      const books = response.data;

      books.forEach((book) => {
        // console.log(book);
        booklist(book);
      });
    })
    .catch(function (error) {
      console.log(error);
    });
}
const books = document.getElementById('booklist');
function booklist(book) {
  const bookinfo = book.book;
  console.log(book);
  books.innerHTML += `
  <div id="booklistcard" class="card mb-3" >
    <div class="row g-0">
      <div class="col-md-4">
        <img src="${bookinfo.book_image}" class="img-fluid rounded-start" alt="...">
      </div>
      <div class="col-md-8">
        <div class="card-body">
        <i class="fa fa-xing" onclick="storebookdelete(${book.id})">삭제</i>
        <div>
          <h5 class="card-title">${bookinfo.title}</h5>
        </div>  
          <p class="card-text">${bookinfo.writer}</p>
          <div id="menucardbtn">
          <p class="card-text"><small class="text-body-secondary">${bookinfo.publisher}</small></p>
          </div>  
          </div>
      </div>
    </div>
  </div>
  `;
}

//store 보유 도서 삭제
// eslint-disable-next-line @typescript-eslint/no-unused-vars
function storebookdelete(bookid) {
  console.log(checkstoreid, bookid);
  axios
    .delete(`storebook/${checkstoreid}/${bookid}`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
      },
    })
    .then(function () {
      alert('도서 삭제 성공');
      window.location.reload();
    })
    .catch(function (error) {
      console.log(error);
    });
}

//csv 등록 부분
// eslint-disable-next-line @typescript-eslint/no-unused-vars
function csvfile(event) {
  event.preventDefault();
  const csvInput = document.getElementById('csvfile');
  const csvFile = csvInput.files[0];

  const formData = new FormData();
  formData.append('file', csvFile);
  axios
    .post(`/books/file/${checkstoreid}`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
        Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
      },
    })
    .then(function () {
      alert('csv 저장 성공');
    })
    .catch(function (error) {
      console.log(error);
    });
}
