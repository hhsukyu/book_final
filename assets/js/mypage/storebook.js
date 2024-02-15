const storebookinfo = document.getElementById('booklist');

let userbookstoreid;

//지점소장도서 정보
function bookinfo(storeid) {
  axios
    .get(`storebook/${storeid}`)
    .then(function (response) {
      //   console.log(response.data);
      const books = response.data;
      storebookinfo.innerHTML = '';
      books.forEach((book) => {
        // console.log(book);
        booklist(book);
      });
      userbookstoreid = storeid;
    })
    .catch(function (error) {
      console.log(error);
    });
}

//도서 상세정보
// const books = document.getElementById('booklist');
function booklist(book) {
  const bookinfo = book.book;
  // console.log(book);

  storebookinfo.innerHTML += `
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

// 키 입력 이벤트 발생 함수
// eslint-disable-next-line @typescript-eslint/no-unused-vars
async function keyupEvent(event) {
  const search = await document.getElementById('searchbox').value;

  if (event.key === 'Enter') {
    event.preventDefault();

    if (search === '') {
      // 검색어가 없을 때의 처리
      storebookinfo.innerHTML = '<p>검색 결과가 없습니다.</p>';
    } else {
      // 서버에 검색 요청 보내기
      axios
        .get(`books/searchStoreBook?storeId=1&bookTitle=${search}`)
        .then((response) => {
          // 서버로부터 받은 도서 목록을 표시
          // console.log('response.data', response.data);
          const books = response.data.data;

          if (books.length === 0) {
            // 검색 결과가 없을 때의 처리
            storebookinfo.innerHTML = '<p>검색 결과가 없습니다.</p>';
          } else {
            // 검색 결과가 있을 때의 처리
            showSearchingBooks(books);
          }
        })
        .catch((error) => {
          console.error('API 요청 중 에러 발생:', error);
        });
    }
  }
}

//소장도서 검색
// eslint-disable-next-line @typescript-eslint/no-unused-vars
async function mainkeyup(event) {
  const search = await document.getElementById('searchbox').value;
  if (search === '') {
    event.preventDefault(); // 백스페이스 키이고 검색어가 없는 경우
    // const bookCard = document.getElementById('bookListContainer');
    storebookinfo.innerHTML = '';
    bookinfo(userbookstoreid);
  }
}

// 검색도서를 표시하는 함수
function showSearchingBooks(books) {
  // console.log('books', books);
  // 도서 목록 초기화
  storebookinfo.innerHTML = '';

  // 각 도서를 도서 목록에 추가
  books.forEach((book) => {
    storebookinfo.innerHTML += `
      <div class="col">
            <div class="card">
            <img src="${book.book_image}" alt="" />
            <div class="card-body">
              <h5 class="card-title">${book.title}</h5>
            </div>
          </div>
        </div>
    `;
  });
}

//store 보유 도서 삭제
// eslint-disable-next-line @typescript-eslint/no-unused-vars
function storebookdelete(bookid) {
  // console.log(checkstoreid, bookid);
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

//csv loading 아이콘 부분
var element = document.querySelector('.bookcsvloading');
//csv 등록 부분
// eslint-disable-next-line @typescript-eslint/no-unused-vars
function csvfile(event) {
  event.preventDefault();
  element.classList.add('show');
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
      element.classList.remove('show');
      alert('csv 저장 성공');
    })
    .catch(function (error) {
      console.log(error);
    });
}
