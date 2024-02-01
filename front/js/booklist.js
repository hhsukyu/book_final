// 서버 주소 (백엔드 API 주소로 수정 필요)
const apiUrl = 'http://43.203.75.81:3000/';

// 특정 storeid에 해당하는 도서 목록 가져오기
function getBooksForStore(storeid) {
  axios
    .get(apiUrl + '/storebook/' + storeid)

    .then((response) => {
      console.log('response', response);
      // console.log('response',response);
      booklist = response.data.map((book) => ({ title: book.title }));
      const books = response.data;

      books.forEach((book) => {
        showBooks(book);
      });
    })
    .catch((error) => {
      console.error(error);
    });
}

// 소장도서 전체조회
function showBooks(books) {
  // 도서 목록 초기화
  console.log(books.book);
  const bookdata = books.book;
  if (!bookListContainer) {
    console.error('bookListContainer not found.');
    return;
  }

  // 각 도서를 도서 목록에 추가

  const bookCard = document.getElementById('bookListContainer');
  bookCard.className = 'cardList';

  bookCard.innerHTML += `
   <div class="col-3 mb-3">
          <div class="col">
            <div class="card">
            <img
            src="${bookdata.book_image}"
            alt=""
          />
              <div class="card-body">
                <h5 class="card-title">${bookdata.title}</h5>
              </div>
            </div>
          </div>
        `;
}
// 초기 페이지 로드 시 storeid가 1인 지점의 도서 목록 표시
getBooksForStore(1);

// 키 입력 이벤트 발생 함수
async function keyupEvent(event) {
  const search = await document.getElementById('searchbox').value;

  if (event.key === 'Enter' && search !== '') {
    event.preventDefault();
    // 수정: 서버에 검색 요청 보내기
    axios
      .get(`${apiUrl}/books/searchStoreBook?storeId=1&bookTitle=${search}`)
      .then((response) => {
        // 서버로부터 받은 도서 목록을 표시
        console.log('response.data', response.data);
        const books = response.data.data;
        showSearchingBooks(books);
      })
      .catch((error) => {
        console.error('API 요청 중 에러 발생:', error);
      });
  }
}

async function mainkeyup(event) {
  const search = await document.getElementById('searchbox').value;
  if (search === '') {
    event.preventDefault(); // 백스페이스 키이고 검색어가 없는 경우
    const bookCard = document.getElementById('bookListContainer');
    bookCard.innerHTML = '';
    getBooksForStore(1);
  }
}

// 도서를 표시하는 함수
function showSearchingBooks(books) {
  console.log('books', books);
  // 도서 목록 초기화
  bookListContainer.innerHTML = '';

  // 각 도서를 도서 목록에 추가
  books.forEach((book) => {
    bookListContainer.innerHTML += `
      <div class="col-3 mb-3">
        <div class="col">
          <div class="card">
            <img src="${book.book_image}" alt="" />
            <div class="card-body">
              <h5 class="card-title">${book.title}</h5>
            </div>
          </div>
        </div>
      </div>
    `;
  });
}
