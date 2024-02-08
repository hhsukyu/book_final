// eslint-disable-next-line @typescript-eslint/no-unused-vars
let allprevPage;
// eslint-disable-next-line @typescript-eslint/no-unused-vars
let allnextPage;
// eslint-disable-next-line @typescript-eslint/no-unused-vars
let allgotoPage;

const query = new URLSearchParams(window.location.search).get('book');

if (query) {
  // query를 사용하여 검색 결과를 가져와서 표시하는 함수 호출
  console.log(query);
  searchresult(query);
}
loadingshow();

setTimeout(function () {
  loadingfade();
}, 3000);

loadUserLikeStores();

// eslint-disable-next-line @typescript-eslint/no-unused-vars
// async function mainkeyup() {
//   const search = await document.getElementById('search-box').value;
//   const output = document.getElementById('output');
//   const el = document.getElementById('pages');

//   // if (search === '') {
//   //   searchbox.style.display = 'none';
//   //   // 검색 결과 데이터 초기화
//   //   output.innerHTML = '';
//   //   el.innerHTML = '';
//   // }
// }

//메인화면 검색 부분
function searchresult(search) {
  console.log('실행');
  axios
    .get(`/books/search?booktitle=${search}`)
    .then(async function (response) {
      // configuration variables\
      const cards = response.data;
      const pages = numPages(cards);

      //   const itemsPerPage = 16;

      changePage(1); // set default page
      await addPages(); // generate page navigation

      // reference to keep track of current page
      let currentPage = 1;

      function numPages(cardsArray) {
        const itemsPerPage = 16;
        // returns the number of pages
        return Math.ceil(cardsArray.length / itemsPerPage);
      }

      function createCardElement(card) {
        let img = card.book_image;
        let defaultImg =
          'https://kowpic.cafe24.com/wp-content/plugins/mangboard/includes/mb-file.php?path=2019%2F12%2F05%2FF7_1196096794_test.png';

        let searchhtml = `
          <div onclick="carddetail(${card.id})" class="col-3 mb-3">
            <div class="col">
              <div class="card">
                <img src="${img}" class="card-img-top" onerror="this.src='${defaultImg}'" alt="...">
                <div class="card-body">
                  <h5 class="card-title">${card.title}</h5>
                </div>
              </div>
            </div>
          </div>
        `;

        return searchhtml;
      }

      function changePage(page) {
        const output = document.getElementById('output');
        output.innerHTML = '';
        const itemsPerPage = 16;

        if (page < 1) page = 1;
        if (page > pages) page = pages;
        output.innerHTML = '';

        for (
          let i = (page - 1) * itemsPerPage;
          i < page * itemsPerPage && i < cards.length;
          i++
        ) {
          // 검색 정보 배열로 저장

          const card = cards[i];
          output.innerHTML += createCardElement(card);
        }
      }

      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      async function addPages() {
        const el = document.getElementById('pages');
        el.innerHTML = '';
        for (let i = 1; i < pages + 1; i++) {
          el.innerHTML += `<li><a onclick="allgotoPage(${i})">${i}</a></li>`;
        }
      }

      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      async function nextPage() {
        if (currentPage < pages) changePage(++currentPage);
      }
      allnextPage = nextPage;

      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      async function prevPage() {
        if (currentPage > 1) changePage(--currentPage);
      }
      allprevPage = prevPage;

      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      async function gotoPage(page) {
        currentPage = page;
        changePage(page);
      }
      allgotoPage = gotoPage;
    })
    .catch(function (error) {
      console.log(error);
    });
}
