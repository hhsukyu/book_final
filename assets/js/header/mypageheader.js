//마이페이지 헤더
//메인페이지에 유저 라이크 리스트를 제거한 부분
const token = localStorage.getItem('accessToken');

if (!token) {
  loadHeader('home'); // load the home page by default
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
        const userimg = document.getElementById('userimg');
        userimg.src = user.photo;
      } else if (user.role === 1) {
        // console.log('사장');
        loadHeader('admin');
        const userimg = document.getElementById('userimg');
        userimg.src = user.photo;
      } else if (user.role === 2) {
        // console.log('사이트관리자');
        loadHeader('siteadmin');
        const userimg = document.getElementById('userimg');
        userimg.src = user.photo;
      } else {
        alert('다시 로그인 해주세요!');
        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');
        window.location.href = 'index.html';
      }
    })
    .catch(function (error) {
      console.log(error);
    });
}
