// 사용자의 Like Store 목록을 저장할 변수
let userLikeStores = [];

// 사용자의 Like Store 목록을 가져오는 함수
// eslint-disable-next-line @typescript-eslint/no-unused-vars
function loadUserLikeStores() {
  axios
    .get('/mypage', {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
      },
    })
    .then(function (response) {
      userLikeStores = response.data.like_store;
      console.log('라이크스토어 리스트', userLikeStores);
    })
    .catch(function (error) {
      console.error('라이크스토어 리스트 로딩오류:', error);
    });
}
