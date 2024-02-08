// login-success에서 받아온 토큰 값을 localStorage에 저장
const accessToken = new URLSearchParams(window.location.search).get(
  'accessToken',
);
const refreshToken = new URLSearchParams(window.location.search).get(
  'refreshToken',
);

// localStorage에 토큰 저장
localStorage.setItem('accessToken', accessToken);
localStorage.setItem('refreshToken', refreshToken);

// index.html로 리다이렉트
window.location.href = '/index.html';
