const iconreview = document.getElementById('reviewicon');
window.onload = function () {
  const cookieaccess = getCookie('accessToken');
  const cookierefresh = getCookie('refreshToken');

  if (cookieaccess && cookierefresh) {
    localStorage.setItem('accessToken', cookieaccess);
    localStorage.setItem('refreshToken', cookierefresh);
  }

  const token = localStorage.getItem('accessToken');

  if (!token) {
    loadHeader('home'); // load the home page by default
  } else if (token) {
    axios
      .get('/user/me', {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
        },
      })
      .then(function (response) {
        console.log(response.data);
        const user = response.data;
        if (user.role === 0) {
          console.log('유저');
          loadHeader('login');
          const userimg = document.getElementById('userimg');
          userimg.src = user.photo;
        } else if (user.role === 1) {
          console.log('사장');
          loadHeader('admin');
        } else if (user.role === 2) {
          console.log('사이트관리자');
          loadHeader('siteadmin');
        }
      })
      .catch(function (error) {
        console.log(error);
      });
  }

  reviewfade();

  genrefade();
  loadStores();
  mainBookcard();
};

// 검색 결과창 메인 화면에서 실행하지 않으면 안보이도록 작업

function reviewfade() {
  iconreview.style.display = 'none';
}

function genrefade() {
  genrecontain.style.display = 'none';
}
