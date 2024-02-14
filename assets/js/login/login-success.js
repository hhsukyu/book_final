// // login-success에서 받아온 토큰 값을 localStorage에 저장
// const accessToken = new URLSearchParams(window.location.search).get(
//   'accessToken',
// );
// const refreshToken = new URLSearchParams(window.location.search).get(
//   'refreshToken',
// );

// localStorage에 토큰 저장
// localStorage.setItem('accessToken', accessToken);
// localStorage.setItem('refreshToken', refreshToken);

const code = new URLSearchParams(window.location.search).get('code');

axios
  .post('auth/verifyCodeGetToken', { code })
  .then((response) => {
    localStorage.setItem('accessToken', response.data.accessToken);
    localStorage.setItem('refreshToken', response.data.refreshToken);
    // console.log(response);
    console.log(response);
    window.location.href = 'index.html';
  })
  .catch((error) => {
    console.log(error);
    alert(error.request.response);
  });
