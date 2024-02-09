const review = document.getElementById('reviewcontain');
const receiptdetail = document.getElementById('receipt-modal');

function reviewinfo() {
  review.innerHTML = '';
  axios
    .get(`/receipts`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
      },
    })
    .then(function (response) {
      // console.log('response.data', response.data);
      const receipts = response.data;

      receipts.forEach((receipt) => {
        addreceiptlists(receipt);

        // const receiptOne = document.getElementById(`boardcontain${receipt.id}`);
        // const form = document.getElementById(`submitReceipt${receipt.id}`);
        // form.addEventListener('click', function () {
        //   review.innerHTML = '';
        // });
      });
    })
    .catch(function (error) {
      console.log(error);
    });
}
function addreceiptlists(receipt) {
  // console.log(receipt);

  review.innerHTML += `   
  <div class="boardcontain" id="boardcontain${receipt.id}">
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
                <option value="1">승인</option>
                <option value="2" selected>미승인</option>
              </select>
               <button onclick="testbtn(${receipt.id})" type="button" class="btn btn-outlin-secondary">Save changes</button>
            </form>  
          </div>
      </div>
      </div>
    </div>`;
  addreceiptimg(receipt);
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
         
        </div>
      </div>
    </div>
  </div>`;
}

// function selectdropbox(receipt) {
//   const dropdown = document.getElementById(`choice${receipt.id}`);
//   dropdown.addEventListener('input', function () {
//     // getValue(receipt);
//     console.log(receipt);
//   });
// }

// eslint-disable-next-line @typescript-eslint/no-unused-vars
function testbtn(receiptid) {
  axios
    .get('/receipts/' + receiptid, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
      },
    })
    .then(function (response) {
      // console.log(response);
      const rece = response.data[0];

      const dropdown = document.getElementById(`choice${receiptid}`);
      const selectedIndex = dropdown.selectedIndex;
      // console.log('index', selectedIndex);
      const selectedValue = dropdown.options[selectedIndex].value;
      console.log(selectedValue);

      axios
        .patch(
          `receipts/${rece.id}`,
          { status: selectedValue },
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
            },
          },
        )
        .then(function (response) {
          const data = response.config.data;
          const parsedData = JSON.parse(data);
          const status = parsedData.status;
          if (status === '1') {
            alert('승인하였습니다.');
          } else if (status === '2') {
            alert('거절하였습니다.');
          }
          // const receiptOne = document.getElementById(`boardcontain${receipt.id}`);
          // receiptOne.innerHTML = '';
        });
    })
    .catch(function (error) {
      console.log(error);
    });
}

// function getValue(receipt) {
//   axios
//     .patch(
//       `receipts/${receipt.id}`,
//       { status: selectedValue },
//       {
//         headers: {
//           Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
//         },
//       },
//     )
//     .then(function (response) {
//       const data = response.config.data;
//       const parsedData = JSON.parse(data);
//       const status = parsedData.status;
//       if (status === '1') {
//         alert('승인하였습니다.');
//       } else if (status === '2') {
//         alert('거절하였습니다.');
//       }
//       // const receiptOne = document.getElementById(`boardcontain${receipt.id}`);
//       // receiptOne.innerHTML = '';
//     });
// }
reviewinfo();
