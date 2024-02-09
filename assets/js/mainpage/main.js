const iconreview = document.getElementById('reviewicon');

const token = localStorage.getItem('accessToken');

// console.log(refrsh);
if (!token) {
  loadHeader('home'); // load the home page by default
  reviewfade();
} else {
  axios
    .get('/user/me', {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
      },
    })
    .then(function (response) {
      // console.log(response.data);
      const user = response.data;

      if (user.role === 0) {
        // console.log('유저');
        loadHeader('login');
        loadUserLikeStores();
        const userimg = document.getElementById('userimg');
        userimg.src = user.photo;
      } else if (user.role === 1) {
        // console.log('사장');
        loadHeader('admin');
        loadUserLikeStores();
        const userimg = document.getElementById('userimg');
        userimg.src = user.photo;
      } else if (user.role === 2) {
        // console.log('사이트관리자');
        loadHeader('siteadmin');
        const userimg = document.getElementById('userimg');
        userimg.src = user.photo;
      }
    })
    .catch(function () {
      // alert('다시 로그인 해주세요!');
      const refreshToken1 = localStorage.getItem('refreshToken');
      refreshToken(refreshToken1);
    });
}

function refreshToken(reftoken) {
  // 토큰 갱신 요청을 보내는 코드를 작성해야 합니다.
  axios
    .post(
      '/auth/refresh',
      {},
      {
        headers: {
          Authorization: `Bearer ${reftoken}`,
        },
      },
    )
    .then(function (response) {
      removeTokens();
      const newAccessToken = response.data.accessToken;
      const newRefreshToken = response.data.refreshToken;

      localStorage.setItem('accessToken', newAccessToken);
      localStorage.setItem('refreshToken', newRefreshToken);

      window.location.reload();
    })
    .catch(function (error) {
      console.log(error);
      alert('토큰 갱신에 실패했습니다. 다시 로그인 해주세요!');
      removeTokens();
      window.location.href = 'index.html';
    });
}

function removeTokens() {
  localStorage.removeItem('accessToken');
  localStorage.removeItem('refreshToken');
}

genrefade();
loadStores();
mainBookcard();

// 검색 결과창 메인 화면에서 실행하지 않으면 안보이도록 작업

function reviewfade() {
  iconreview.style.display = 'none';
}

function genrefade() {
  genrecontain.style.display = 'none';
}
