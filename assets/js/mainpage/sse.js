// 메인 페이지 로드 시 SSE 연결 설정
document.addEventListener('DOMContentLoaded', () => {
  const accessToken = localStorage.getItem('accessToken'); // 로컬 스토리지에서 액세스 토큰 가져오기
  if (!accessToken) {
    console.log('로그인이 필요합니다.');
    return;
  }

  // 현재 로그인한 사용자의 정보를 가져오기
  axios
    .get('/user/me', {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    })
    .then(function (response) {
      const user = response.data;
      const userId = user.id; // 로그인한 사용자의 ID

      // SSE 연결 설정, 사용자 ID를 URL에 포함
      const eventSource = new EventSource(`/sse/notifications/user/${userId}`, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      eventSource.onmessage = (event) => {
        const message = event.data;
        // console.log('받은 데이터:', message);
        // 받은 알림 데이터를 토스트 메시지로 표시
        displayToastMessage(message); // 여기서 'data.data'는 서버에서 보낸 메시지가 들어있는 부분
      };

      eventSource.onerror = (error) => {
        console.error('SSE 연결 오류:', error);
        eventSource.close();
      };
    })
    .catch(function (error) {
      console.log('사용자 정보 가져오기 실패:', error);
    });
});

// 토스트 메시지 표시 함수
function displayToastMessage(message) {
  const toastBody = document.querySelector('.toast-body');
  toastBody.textContent = message; // 메시지 내용 설정

  const toast = new bootstrap.Toast(document.getElementById('liveToast'));
  toast.show(); // 토스트 메시지 표시
}
