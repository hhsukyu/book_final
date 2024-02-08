// const review = document.getElementById('reviewcontain');
// const receiptdetail = document.getElementById('receipt-modal');
reviewinfo();
function reviewinfo() {
  axios
    .get('receipts', {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
      },
    })
    .then(async function (response) {
      const receipts = response.data;
      const pages = numPages(receipts);

      //   const itemsPerPage = 16;

      changePage(1); // set default page
      await addPages(); // generate page navigation

      // reference to keep track of current page
      let currentPage = 1;

      function numPages(cardsArray) {
        const itemsPerPage = 3;
        // returns the number of pages
        return Math.ceil(cardsArray.length / itemsPerPage);
      }

      function addreceiptlists(receipt) {
        const review = `   <div class="boardcontain">
        <div>
          <button
            type="button"
            id="reviewbtn"
            class="btn"
            data-bs-toggle="modal"
            data-bs-target="#detailreviewphoto"
          >
            자세히보기
          </button>
          <strong>지점 : ${receipt.store.store_name}</strong>
          <div class="boardcontain">
            <a
              >${receipt.store_reviews.content}</a
            >
          </div>
        </div>
        <div class="row">
          <div class="col-8"></div>
            <div class="col-4 text-end">
              <div id="reviewdrop" class="text-end">
                <form>
                  <select class="form-select" name="languages" id="choice">
                    <option value="accepet">승인</option>
                    <option value="reject">미승인</option>
                  </select>
                  <input
                   class="btn btn-outline-secondary btn-sm"
                   type="button"
                   onclick=""
                    value="Submit"
                  />
                </form>
              </div>
          </div>
          </div>
        </div>`;
        return review;
      }

      function changePage(page) {
        const output = document.getElementById('boardcontain');
        output.innerHTML = '';
        const itemsPerPage = 3;

        if (page < 1) page = 1;
        if (page > pages) page = pages;
        output.innerHTML = '';

        for (
          let i = (page - 1) * itemsPerPage;
          i < page * itemsPerPage && i < receipts.length;
          i++
        ) {
          // 검색 정보 배열로 저장

          const receipt = receipts[i];
          output.innerHTML += addreceiptlists(receipt);
          // receiptdetail.innerHTML += addreceiptimg(receipt);
        }
      }
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      async function addPages() {
        const el = document.getElementById('receiptpages');
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

function addreceiptimg() {
  $('#detailreviewphoto').modal('show');
  axios.get('/receipts/' + id).then(function (response) {
    console.log('response.data', response.data);
  });
}
