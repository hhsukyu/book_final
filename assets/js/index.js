const header = document.getElementById('header');
// const body = document.getElementById('content');

window.onload = function () {
  const token = localStorage.getItem('accessToken');

  if (!token) {
    loadHeader('home'); // load the home page by default
  } else {
    loadHeader('login');
  }
};

// header 부분
function loadHeader(page) {
  let headerContent = '';

  if (page === 'home') {
    headerContent = `<h2>Home Page</h2>`;
    // 로그인 시 로그인 회원 정보 출력
  } else if (page === 'login') {
    headerContent = `<h2>login Page</h2>`;
  }

  header.innerHTML = headerContent;
}
