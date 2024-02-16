const iconreview = document.getElementById('reviewicon');

const storereviewbtn = document.getElementById('storereviewbox');

const token = localStorage.getItem('accessToken');

genrefade();
loadStores();
mainBookcard();

// console.log(refrsh);
if (!token) {
  loadHeader('home'); // load the home page by default
  reviewfade();
  storereviewbtn.style.display = 'none';
} else {
  // window.location.reload();

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
    .catch(function (error) {
      // alert('다시 로그인 해주세요!');
      removeTokens();
      console.log(error);
      window.location.reload();
    });
}

// 검색 결과창 메인 화면에서 실행하지 않으면 안보이도록 작업

function reviewfade() {
  iconreview.style.display = 'none';
}

function genrefade() {
  genrecontain.style.display = 'none';
}

// const tokens = localStorage.getItem('refreshToken');
// const decodedToken = jwt.decode(tokens);

// // 만료 시간 확인
// const expirationTime = decodedToken.exp;
// const currentTime = Math.floor(Date.now() / 1000); // 현재 시간을 초 단위로 변환

// // 현재 시간과 비교
// if (expirationTime < currentTime) {
//   console.log('토큰이 만료되었습니다.');
// } else {
//   console.log('토큰이 유효합니다.');
// }
