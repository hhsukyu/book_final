const refreshToken = localStorage.getItem('refreshToken');

if (!token) {
  if (refreshToken) {
    refreshTokenadd();
  }
}

function refreshTokenadd() {
  // 토큰 갱신 요청을 보내는 코드를 작성해야 합니다.
  axios
    .post(
      '/auth/refresh',
      {},
      {
        headers: {
          Authorization: `Bearer ${refreshToken}`,
        },
      },
    )
    .then(function (response) {
      console.log(response.data);
      const newAccessToken = response.data;
      // const newRefreshToken = response.data.refreshToken;

      localStorage.setItem('accessToken', newAccessToken);
      // localStorage.setItem('refreshToken', newRefreshToken);

      window.location.reload();
    })
    .catch(function (error) {
      console.log(error);
      alert('토큰 갱신에 실패했습니다. 다시 로그인 해주세요!');
      removeTokens();
      removereTokens();
      window.location.href = 'index.html';
    });
}

function removeTokens() {
  localStorage.removeItem('accessToken');
}

function removereTokens() {
  localStorage.removeItem('refreshToken');
}
