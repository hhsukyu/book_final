const maincardlist = document.getElementById('card-list');
// eslint-disable-next-line @typescript-eslint/no-unused-vars
const maincard = document.getElementById('maincard');
// eslint-disable-next-line @typescript-eslint/no-unused-vars
const searchbox = document.getElementById('searchbox');
// eslint-disable-next-line @typescript-eslint/no-unused-vars
const genreform = document.getElementById('genre');
// eslint-disable-next-line @typescript-eslint/no-unused-vars
const storecontain = document.getElementById('stores');
// eslint-disable-next-line @typescript-eslint/no-unused-vars
const genrecontain = document.getElementById('genrebox');
let reviewbookid;

//메인 추천도서 카드 부분
// eslint-disable-next-line @typescript-eslint/no-unused-vars
function mainBookcard() {
  mainCardSlide();
  axios
    .get('/books/main')
    .then(function (response) {
      const books = response.data;
      books.forEach((book) => {
        // console.log(book);
        let img = book.book_image;
        let defaultImg =
          'https://kowpic.cafe24.com/wp-content/plugins/mangboard/includes/mb-file.php?path=2019%2F12%2F05%2FF7_1196096794_test.png';

        maincardlist.innerHTML += `
        <div onclick="carddetail(${book.id})" class="swiper-slide card">
        <div class="card-content">
          <div class="image">
            <img
              src="${img}"
              alt=""
              onerror="this.src='${defaultImg}'"
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

//슬라이드 스크립트 부분
function mainCardSlide() {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  var swiper = new Swiper('.mySwiper', {
    slidesPerView: 5,
    spaceBetween: 30,
    slidesPerGroup: 5,
    loop: true,
    loopFillGroupWithBlank: true,
    pagination: {
      el: '.swiper-pagination',
      clickable: true,
    },
    navigation: {
      nextEl: '.swiper-button-next',
      prevEl: '.swiper-button-prev',
    },
  });
}
