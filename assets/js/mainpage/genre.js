// eslint-disable-next-line @typescript-eslint/no-unused-vars
let genreprevPage;
// eslint-disable-next-line @typescript-eslint/no-unused-vars
let genrenextPage;
// eslint-disable-next-line @typescript-eslint/no-unused-vars
let genregotoPage;

// eslint-disable-next-line @typescript-eslint/no-unused-vars
async function genrebtn(genre) {
  maincard.style.display = 'none';
  genreform.style.display = 'none';
  storecontain.style.display = 'none';
  genrecontain.style.display = 'block';

  console.log(genre);
  axios
    .get(`/books/genre?bookgenre=${genre}`)
    .then(async function (response) {
      loadingshow();
      setTimeout(function () {
        loadingfade();
      }, 3500);
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
          'http://kowpic.cafe24.com/wp-content/plugins/mangboard/includes/mb-file.php?path=2019%2F12%2F05%2FF7_1196096794_test.png';

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
        const output = document.getElementById('genreoutput');
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
        const el = document.getElementById('genrepages');
        el.innerHTML = '';
        for (let i = 1; i < pages + 1; i++) {
          el.innerHTML += `<li><a onclick="genregotoPage(${i})">${i}</a></li>`;
        }
      }

      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      async function nextPage() {
        if (currentPage < pages) changePage(++currentPage);
      }
      genrenextPage = nextPage;

      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      async function prevPage() {
        if (currentPage > 1) changePage(--currentPage);
      }
      genreprevPage = prevPage;

      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      async function gotoPage(page) {
        currentPage = page;
        changePage(page);
      }
      genregotoPage = gotoPage;
    })
    .catch(function (error) {
      console.log(error);
    });
}
