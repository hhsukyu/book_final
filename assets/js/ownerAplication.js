// 페이지 로딩 시 알림창 띄우기
window.onload = function () {
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
};
const userId = 11;

function changeUserType() {
  // const authCode = document.getElementById("authCode").value;

  // 서버에서 이미 얻은 사용자 ID를 사용
  // const userId = getUserIdFromServer();
  // console.log(userId);
  // if (!userId) {
  //   alert('로그인이 필요합니다.');
  //   return;
  // }

  axios
    .put(
      'http://localhost:3000/auth/changeOwner',
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
    })
    .catch((error) => {
      alert('사장님 전환에 실패했습니다.');
      console.error(error);
    });
}

// //서버에서 사용자 ID를 받아오는 함수
// function getUserIdFromServer() {
//   const serverResponse = getServerResponse(); // 어떤 방식으로든 서버 응답을 획득
//   return serverResponse.userId;
// }

// // 예시 함수: 서버 응답을 가정한 함수
// function getServerResponse() {
//   // 여기에서 서버로부터 응답을 받는 로직을 구현
//   // 예시: 임시로 응답 객체를 생성하여 반환
//   return { userId }; // 실제로는 서버 응답을 사용
// }

// // 알림창 띄우기
// alert('축하합니다! 사장님으로 전환되셨습니다.');
