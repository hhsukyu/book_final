// 사용자의 Like Store 목록을 저장할 변수
// eslint-disable-next-line @typescript-eslint/no-unused-vars
let userLikeStores = [];
// eslint-disable-next-line @typescript-eslint/no-unused-vars
let userWishList = [];

// 사용자의 Like Store 목록을 가져오는 함수
// 사용자의 위시리스트(wishlist) 목록을 가져오는 함수
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
      userWishList = response.data.wish_list;
      // console.log('라이크스토어 리스트', userLikeStores);
      // console.log('위시 리스트', userWishList);
    })
    .catch(function () {
      // console.error('라이크스토어 리스트 로딩오류:', error);
    });
}
