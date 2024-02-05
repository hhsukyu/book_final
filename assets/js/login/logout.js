//로그아웃
// eslint-disable-next-line @typescript-eslint/no-unused-vars
function logout() {
  localStorage.removeItem('accessToken');
  localStorage.removeItem('refreshToken');

  window.location.href = 'index.html';
}
