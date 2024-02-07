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
