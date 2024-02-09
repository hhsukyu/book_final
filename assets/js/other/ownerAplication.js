// eslint-disable-next-line @typescript-eslint/no-unused-vars
let ownerApplicationModal;

// eslint-disable-next-line @typescript-eslint/no-unused-vars
function openOwnerApplicationModal() {
  alert(
    '북서핑(BookSurfing) 지점사장 신청 안내\n\n' +
      '만화카페 사장님으로의 신청을 위해 홈페이지를 방문해 주셔서 감사합니다!\n' +
      '신청 전에 아래의 필수 지점정보를 songsari1995@gmail.com으로 보내주시면,\n' +
      '더 빠르고 원활한 신청 진행이 가능합니다.\n\n' +
      '정보를 보내주신 후, 저희 담당자가 신속하게 검토 후 처리해 드리겠습니다.\n' +
      '언제든지 궁금한 점이 있으시면 문의해 주세요.\n\n' +
      '신청을 완료하시려면 [신청하기] 버튼을 클릭하세요.',
  );

  $('#myModal').modal('show');
}

// const userId = 11;

// eslint-disable-next-line @typescript-eslint/no-unused-vars
// function changeUserType() {
//   axios
//     .put(
//       '/auth/changeOwner',
//       {},
//       {
//         headers: {
//           Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
//         },
//       },
//     )
//     .then((response) => {
//       console.log('response', response.data);
//       alert('사장님으로 전환되었습니다.');
//       // 모달 닫기
//       $('#myModal').modal('hide');
//     })
//     .catch((error) => {
//       alert('사장님 전환에 실패했습니다.');
//       console.error(error);
//       // 모달 닫기
//       $('#myModal').modal('hide');
//     });
// }
function applyOwner() {
  const ownername = document.getElementById('ownername').value;
  const storename = document.getElementById('storename').value;
  const storelocation = document.getElementById('storelocation').value;
  const businessnumber = document.getElementById('businessnumber').value;

  const requestData = {
    owner_name: ownername,
    store_name: storename,
    business_location: storelocation,
    business_license_number: businessnumber,
  };
  const config = {
    headers: {
      Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
    },
  };
  axios
    .post('/applyowner', requestData, config)
    .then((response) => {
      // console.log(response.data);
      alert('신청이 완료되었습니다.');
      $('#myModal').modal('hide');
    })
    .catch((error) => {
      alert('신청에 실패했습니다.');
      console.error(error);
      // 모달 닫기
      $('#myModal').modal('hide');
    });
}

const ownerchangemodal = document.getElementById('ownermodaldiv');

function ownermodal() {
  ownerchangemodal.innerHTML = `
  <!-- 사장님 전환 모달창 -->
  <div class="modal fade" tabindex="-1" id="myModal">
    <div class="modal-dialog modal-lg passwordSettingModal">
      <div class="modal-content">
        <!-- Modal Header -->
        <div class="modal-header">
          <h5 class="modal-title">지점사장 전환</h5>
        </div>

        <!-- Modal Body -->
        <div class="modal-body">
          <!-- Verification Form -->
          <div id="verificationForm">
            <label for="store-desc" class="form-label">대표자 : </label>
            <div class="mb-3">
              <input
                class="form-control"
                id="ownername"
                placeholder="대표자 이름을 작성해주세요."
              />
            </div>
            <label for="store-desc" class="form-label">지점명 : </label>
            <div class="mb-3">
              <input
                class="form-control"
                id="storename"
                placeholder="지점 이름를 작성해주세요."
              />
            </div>
            <label for="store-desc" class="form-label">지점장소 : </label>
            <div class="mb-3">
              <input
                class="form-control"
                id="storelocation"
                placeholder="지점 장소를 작성해주세요."
              />
            </div>
            <label for="store-desc" class="form-label">사업자등록증 : </label>
            <div class="mb-3">
              <input
                class="form-control"
                id="businessnumber"
                placeholder="사업자등록증 번호를 작성해주세요."
              />
            </div>
            <div class="text-center modalBtn">
              <button
                class="btn-hover color-8"
                type="button"
                onclick="applyOwner()"
              >
                신청하기
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>`;
}
ownermodal();
