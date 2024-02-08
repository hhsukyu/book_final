// eslint-disable-next-line @typescript-eslint/no-unused-vars
let ownerApplicationModal;

// eslint-disable-next-line @typescript-eslint/no-unused-vars
function openOwnerApplicationModal() {
  alert(
    '사장님으로의 신청 안내\n\n' +
      '만화카페 사장님으로의 신청을 위해 홈페이지를 방문해 주셔서 감사합니다!\n' +
      '신청 전에 아래의 필수 지점정보를 fivebunnieswin@gmail.com으로 보내주시면, 더 빠르고 원활한 신청 진행이 가능합니다.\n\n' +
      '지점정보:\n' +
      '지점 이름:\n' +
      '위치 (주소):\n' +
      '전화번호:\n' +
      '운영 시간:\n' +
      '특별 안내 사항:\n' +
      '사업자 등록증 또는 사업주명:\n\n' +
      '정보를 보내주신 후, 저희 담당자가 신속하게 검토 후 답변 드리겠습니다. 언제든지 궁금한 점이 있으시면 문의해 주세요.\n\n' +
      '신청을 완료하시려면 [신청하기] 버튼을 클릭하세요.',
  );

  $('#myModal').modal('show');
}

// const userId = 11;

// eslint-disable-next-line @typescript-eslint/no-unused-vars
function changeUserType() {
  axios
    .put(
      '/auth/changeOwner',
      {},
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
        },
      },
    )
    .then((response) => {
      console.log('response', response.data);
      alert('사장님으로 전환되었습니다.');
      // 모달 닫기
      $('#myModal').modal('hide');
    })
    .catch((error) => {
      alert('사장님 전환에 실패했습니다.');
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
                id="ownercontent1"
                placeholder="대표자 이름을 작성해주세요."
              />
            </div>
            <label for="store-desc" class="form-label">지점명 : </label>
            <div class="mb-3">
              <input
                class="form-control"
                id="ownercontent2"
                placeholder="지점 이름를 작성해주세요."
              />
            </div>
            <label for="store-desc" class="form-label">지점장소 : </label>
            <div class="mb-3">
              <input
                class="form-control"
                id="ownercontent3"
                placeholder="지점 장소를 작성해주세요."
              />
            </div>
            <label for="store-desc" class="form-label">사업자등록증 : </label>
            <div class="mb-3">
              <input
                class="form-control"
                id="ownercontent4"
                placeholder="사업자등록증 번호를 작성해주세요."
              />
            </div>
            <div class="text-center modalBtn">
              <button
                class="btn-hover color-8"
                type="button"
                onclick="changeUserType()"
              >
                사장님으로 전환하기
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>`;
}
ownermodal();
