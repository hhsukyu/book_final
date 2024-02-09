const review = document.getElementById('reviewcontain');
const receiptdetail = document.getElementById('receipt-modal');

reviewinfo();
function reviewinfo() {
  review.innerHTML = '';
  axios
    .get(`/receipts`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
      },
    })
    .then(function (response) {
      console.log('response.data', response.data);
      const receipts = response.data;
      receipts.forEach((receipt) => {
        addreceiptlists(receipt);
        addreceiptimg(receipt);
        selectdropbox(receipt);
      });
    })
    .catch(function (error) {
      console.log(error);
    });
}
function addreceiptlists(receipt) {
  console.log(receipt);
  review.innerHTML += `   <div class="boardcontain">
  <div>
    <button
      type="button"
      id="reviewbtn"
      class="btn"
      data-bs-toggle="modal"
      data-bs-target="#detailreviewphoto${receipt.id}"
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
            <select class="form-select" name="languages" id="choice${receipt.id}">
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
}
function addreceiptimg(receipt) {
  // receiptdetail.innerHTML = '';
  receiptdetail.innerHTML += `
  <div
  class="modal fade"
  id="detailreviewphoto${receipt.id}"
  tabindex="-1"
  aria-labelledby="exampleModalLabel"
  aria-hidden="true"
>
  <div class="modal-dialog">
    <div class="modal-content">
      <div class="modal-header">
        <h1 class="modal-title fs-5" id="exampleModalLabel">
          영수증 사진 확인
        </h1>
        <button
          type="button"
          class="btn-close"
          data-bs-dismiss="modal"
          aria-label="Close"
        ></button>
      </div>
      <div class="modal-body">
      <img
      src=${receipt.receipt_img} width="400px"
      />
      </div>
      <div class="modal-footer">
        <button
          type="button"
          class="btn btn-secondary"
          data-bs-dismiss="modal"
        >
          Close
        </button>
        <button type="button" class="btn btn-primary">Save changes</button>
      </div>
    </div>
  </div>
</div>`;
}
function selectdropbox(receipt) {
  const dropdown = document.getElementById(`choice${receipt.id}`);
  const selecteddropdown = dropdown.value;
  console.log('this', selecteddropdown);
  if (selecteddropdown === 'accepet') {
    console.log('제발');
  } else if (selecteddropdown === 'reject') {
    console.log('qkf');
  }
  dropdown.addEventListener('change', selectdropbox);
}
