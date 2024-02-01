// eslint-disable-next-line @typescript-eslint/no-unused-vars
async function loginForm(event) {
  event.preventDefault();

  const email = document.getElementById('email').value;
  const password = document.getElementById('password').value;

  axios
    .post('/auth/login', {
      email: email,
      password: password,
    })
    .then(function (response) {
      localStorage.setItem('accessToken', response.data.accessToken);
      localStorage.setItem('refreshToken', response.data.refreshToken);
      console.log(response);

      window.location.href = 'index.html';
      loadHeader('login');
    })
    .catch(function (error) {
      console.log(error.request.response);
      alert(error.request.response);
    });
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
function naverLogin() {
  window.location.href = '/auth/naver';
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
function kakaoLogin() {
  window.location.href = '/auth/kakao';
}

//로그아웃
// eslint-disable-next-line @typescript-eslint/no-unused-vars
function logout() {
  localStorage.removeItem('accessToken');
  localStorage.removeItem('refreshToken');

  document.cookie =
    'accessToken=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
  document.cookie =
    'refreshToken=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';

  window.location.reload();
}
