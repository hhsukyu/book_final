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

// // 네이버 로그인 이후 처리
// function handleNaverLogin(code) {
//   axios
//     .get(`/auth/naver/callback?code=${code}`)
//     .then(function (response) {
//       // 서버에서 받은 토큰을 처리하는 함수 호출
//       handleLogin(response);
//     })
//     .catch(function (error) {
//       console.error(error);
//       // 에러 처리 로직 추가
//     });
// }

// // 로그인 완료 후 서버에서 받은 토큰을 처리하는 함수
// function handleLogin(response) {
//   // 토큰을 로컬 스토리지에 저장
//   localStorage.setItem('accessToken', response.data.accessToken);
//   localStorage.setItem('refreshToken', response.data.refreshToken);

//   // 리다이렉트 또는 화면 갱신 등 필요한 작업 수행
//   window.location.href = 'index.html';
// }

// function naverLoginCallback() {
//   axios
//     .get('/auth/naver/callback', {
//       headers: {
//         Authorization: `Bearer ${accessToken}`,
//       },
//     })
//     .then(function (response) {
//       localStorage.setItem('accessToken', response.data.accessToken);
//       localStorage.setItem('refreshToken', response.data.refreshToken);
//       console.log('response.data.accessToken', response.data.accessToken);
//       // window.location.href = 'index.html';
//       // loadHeader('login');
//     })
//     .catch(function (error) {
//       console.log(error.request.response);
//       alert(error.request.response);
//     });
// }
