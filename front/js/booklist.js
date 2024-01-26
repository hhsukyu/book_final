const header = document.getElementById('header');
const body = document.getElementById('card-list');
const maincard = document.getElementById('maincard');
const searchbox = document.getElementById('searchbox');

//메인 추천도서 카드 부분
// eslint-disable-next-line @typescript-eslint/no-unused-vars
function searchResult() {
  keyUp();
  axios
    .get('/books/main')
    .then(function (response) {
      const books = response.data;
      books.forEach((book) => {
        // console.log(book);
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

function keyUp() {}
