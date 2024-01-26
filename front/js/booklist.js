const header = document.getElementById('header');
const body = document.getElementById('card-list');
const maincard = document.getElementById('maincard');
const searchbox = document.getElementById('searchbox');

const data = [
  { title: '패턴', postNumber: 1 },
  { title: '마음가짐', postNumber: 2 },
  { title: 'HTML 기초', postNumber: 3 },
  { title: 'css 기초', postNumber: 4 },
  { title: 'CSSflex', postNumber: 5 },
  { title: 'Mac 계산기 클론하기', postNumber: 6 },
  { title: 'CSS grid', postNumber: 7 },
  { title: 'slice? splice', postNumber: 8 },
  { title: '함수를 정의하는 방법', postNumber: 9 },
  { title: '순열(Permutation) 구현하기', postNumber: 10 },
  { title: '문자열에서 특정 위치의 문자를 변경하고 싶은 경우', postNumber: 11 },
  { title: 'letIt const', postNumber: 12 },
  { title: 'nvm', postNumber: 13 },
  {
    title: '요소 노드의 텍스트 조작하기(nodeValue, textContent, innerHTML)',
    postNumber: 14,
  },
  { title: '자바스크립트의 배열은 배열이 아니다!', postNumber: 15 },
  { title: 'JSON 다루기(JSON.parse), JSON.stringify())', postNumber: 16 },
  { title: '원시 자료형과 참조 자료형', postNumber: 17 },
  { title: '[]===[]는 왜 false인가', postNumber: 18 },
  { title: 'this (동적 바인딩)', postNumber: 19 },
  {
    title: '유효성 검사를 포함한 간단한 회원가입 폼 페이지 만들기',
    postNumber: 20,
  },
  { title: '#fff와 #ffffff', postNumber: 21 },
  { title: '안다고 생각했지만, 헷갈렸던 문법들', postNumber: 22 },
  { title: 'DOM이 뭔가요?', postNumber: 23 },
  { title: '영화 좌석 예약 페이지 만들기 ', postNumber: 24 },
  { title: '테두리가 두 줄처럼 보이는 경우 (border)', postNumber: 25 },
  {
    title:
      'IS0 형식의 날짜(yyyy-mm-ddThh:mm:ssz)를 현재 위치 시간대로 변경하기 # ',
    postNumber: 26,
  },
  { title: '페이지네이션', postNumber: 27 },
];

//지점도서 검색 결과
function searchResult() {
  keyupEvent();
  axios
    .get('/storebook/storebookid')
    .then(function (response) {
      const books = response.data;
      books.forEach((book) => {
        body.innerHTML += `
          <div onclick="carddetail(${book.id})" class="swiper-slide card">
          <div class="card-content">
            <div class="image">
              <img
                src="${book.book_image}"
                alt=""
              />
            </div>
            <div id="profession" class="name-profession">
              <span class="name">${book.title}</span>
              <span class="profession">${book.genre}</span>
            </div>
          </div>
        </div>`;
      });
    })
    .catch(function (error) {
      console.log(error);
    });
}

// 지점도서 목록을 가져오는 함수
function getBookList() {
  axios.get('/storebook/storebookid').then((response) => {
    const bookList = response.data;
    const bookListContainer = document.getElementById('bookList');

    // 각 도서에 대해 카드를 생성하여 추가
    bookList.forEach((book) => {
      const cardDiv = document.createElement('div');
      cardDiv.className = 'storeBookCard';
      cardDiv.innerHTML = `
              <div class="col">
                <div class="card">
                  <img src="${book.image}" class="card-img-top" alt="...">
                  <div class="card-body">
                    <h5 class="card-title">${book.title}</h5>
                  </div>
                </div>
              </div>
            `;

      bookListContainer.appendChild(cardDiv);
    });
  });
}

// 키 입력 이벤트 발생 함수
function keyupEvent(event) {
  const searchBox = document.getElementById('search-box');
  const search = searchBox.value.trim(); // 검색어 얻어오기 (trim()은 앞뒤 공백 제거)

  if (event.key === 'Enter' && search !== '') {
    // 엔터 키를 누르면서 검색어가 존재하면 검색 결과를 가져옴
    event.preventDefault();
    searchResult(search);
  }
}

// 키 입력 이벤트 리스너 등록
document.getElementById('search-box').addEventListener('keyup', keyupEvent);
