const header = document.getElementById('header');
const body = document.getElementById('card-list');
const maincard = document.getElementById('maincard');
const searchbox = document.getElementById('searchbox');
const bookListContainer = document.getElementById('bookListContainer');

// 검색 및 도서 목록 표시를 위한 함수
function showBooks(books) {
  // 도서 목록 초기화
  bookListContainer.innerHTML = '';

  // 각 도서를 도서 목록에 추가
  books.forEach((book) => {
    const bookCard = document.createElement('div');
    bookCard.className = 'col-3 mb-3 storeBookCard';
    bookCard.innerHTML = `
          <div class="col">
            <div class="card">
            <img
            src="${book.book_image}"
            alt=""
          />
              <div class="card-body">
                <h5 class="card-title">${book.title}</h5>
              </div>
            </div>
          </div>
        `;
    bookListContainer.appendChild(bookCard);
  });
}

// //지점도서 검색 결과
// function searchResult() {
//   keyupEvent();
//   axios
//     .get('/storebook/storeid')
//     .then(function (response) {
//       const books = response.data;
//       books.forEach((book) => {
//         body.innerHTML += `
//           <div onclick="carddetail(${book.id})" class="swiper-slide card">
//           <div class="card-content">
//             <div class="image">
//               <img
//                 src="${book.book_image}"
//                 alt=""
//               />
//             </div>
//             <div id="profession" class="name-profession">
//               <span class="name">${book.title}</span>
//               <span class="profession">${book.genre}</span>
//             </div>
//           </div>
//         </div>`;
//       });
//     })
//     .catch(function (error) {
//       console.log(error);
//     });
// }

// // 지점도서 목록을 가져오는 함수
// function getStoreBookList() {
//   axios.get('/storebook/storeid').then((response) => {
//     const bookList = response.data;
//     const bookListContainer = document.getElementById('bookList');

//     // 각 도서에 대해 카드를 생성하여 추가
//     bookList.forEach((book) => {
//       const cardDiv = document.createElement('div');
//       cardDiv.className = 'storeBookCard';
//       cardDiv.innerHTML = `
//               <div class="col">
//                 <div class="card">
//                   <img src="${book.image}" class="card-img-top" alt="...">
//                   <div class="card-body">
//                     <h5 class="card-title">${book.title}</h5>
//                   </div>
//                 </div>
//               </div>
//             `;

//       bookListContainer.appendChild(cardDiv);
//     });
//   });
// }

// // 키 입력 이벤트 발생 함수
// function keyupEvent(event) {
//   const searchBox = document.getElementById('search-box');
//   const search = searchBox.value.trim(); // 검색어 얻어오기 (trim()은 앞뒤 공백 제거)

//   if (event.key === 'Enter' && search !== '') {
//     // 엔터 키를 누르면서 검색어가 존재하면 검색 결과를 가져옴
//     event.preventDefault();
//     searchResult(search);
//   }
// }

// // 키 입력 이벤트 리스너 등록
// document.getElementById('search-box').addEventListener('keyup', keyupEvent);
