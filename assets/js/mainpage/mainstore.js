// 매장 정보를 가져와서 표시하는 함수
// eslint-disable-next-line @typescript-eslint/no-unused-vars
function loadStores() {
  console.log('로드 스토어 실행됨!!!!!!!!!!!!');
  axios
    .get('/store')
    .then(async function (response) {
      const stores = response.data;
      const pages = numPages(stores);

      //   const itemsPerPage = 16;

      changePage(1); // set default page
      await addPages(); // generate page navigation

      // reference to keep track of current page
      let currentPage = 1;

      function numPages(cardsArray) {
        const itemsPerPage = 8;
        // returns the number of pages
        return Math.ceil(cardsArray.length / itemsPerPage);
      }

      function createCardElement(store) {
        const storeElement = `
          <div class="album-item"onclick="storecarddetail(${store.id})">
            <img src="${store.store_img || '기본 이미지 경로'}" alt="${store.store_name}" />
            <div class="album-details">
              <span class="album-title">${store.store_name}</span>
              <span class="album-intro">${store.store_desc}</span>
              <span class="album-location">${store.store_address}</span>
              <span class="album-open">${store.store_open} ~ ${store.store_close}</span>
            </div>
          </div>
        `;
        return storeElement;
      }
      function changePage(page) {
        const output = document.querySelector('.album-store');
        output.innerHTML = '';
        const itemsPerPage = 8;

        if (page < 1) page = 1;
        if (page > pages) page = pages;
        output.innerHTML = '';

        for (
          let i = (page - 1) * itemsPerPage;
          i < page * itemsPerPage && i < stores.length;
          i++
        ) {
          // 검색 정보 배열로 저장

          const store = stores[i];
          output.innerHTML += createCardElement(store);
        }
      }

      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      async function addPages() {
        const el = document.getElementById('storepages');
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
