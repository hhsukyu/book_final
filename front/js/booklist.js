const header = document.getElementById('header');
const body = document.getElementById('card-list');
const maincard = document.getElementById('maincard');
const searchbox = document.getElementById('searchbox');
const bookListContainer = document.getElementById('bookListContainer');

let booklist = [];
// 서버 주소 (백엔드 API 주소로 수정 필요)
const apiUrl = 'http://localhost:3000';

// 특정 storeid에 해당하는 도서 목록 가져오기
function getBooksForStore(storeid) {
  // API 호출을 위한 주소 설정
  const storeApiUrl = `${apiUrl}/${storeid}`;

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

// 검색 결과 가져오기 함수
function searchResult(search) {
  console.log('검색어:', search);

  const searchLowerCase = search.toLowerCase();

  // 도서 필터링
  const filteredBooks = booklist.filter(function (book) {
    return book.title.toLowerCase().includes(searchLowerCase);
  });

  console.log('필터링된 도서:', filteredBooks);

  // 결과가 없는 경우
  const bookListContainer = document.getElementById('bookListContainer');
  bookListContainer.innerHTML = ''; // 기존 도서 목록 초기화

  if (filteredBooks.length === 0) {
    console.log('검색 결과가 없습니다.');
    const errorMessage = document.createElement('p');
    errorMessage.textContent = '검색 결과가 없습니다.';
    // 기존 도서 목록을 지우고 에러 메시지를 추가
    bookListContainer.appendChild(errorMessage);
  } else {
    // 결과가 있는 경우, 가져온 결과를 화면에 표시
    console.log('결과가 있음');
    showBooks(filteredBooks);
  }
}

// 키 입력 이벤트 발생 함수
function keyupEvent(event) {
  const searchBox = document.getElementById('searchbox');
  const search = searchBox.value.trim();

  if (event.key === 'Enter' && search !== '') {
    event.preventDefault();
    searchResult(search);
  } else if (event.key === 'Backspace' && search === '') {
    // 백스페이스 키이고 검색어가 없는 경우
    event.preventDefault();
    const bookCard = document.getElementById('bookListContainer');
    bookCard.innerHTML = ``;
    getBooksForStore(1);
  }
}

// 키 입력 이벤트 리스너 등록
document.getElementById('searchbox').addEventListener('keyup', keyupEvent);
