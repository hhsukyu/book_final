document
  .getElementById('addToWishlistButton')
  .addEventListener('click', function () {
    const bookId = document
      .getElementById('modalcardtitle')
      .getAttribute('data-book-id');
    const wishlistButton = document.getElementById('addToWishlistButton');
    const heartIcon = wishlistButton.querySelector('.fa');

    // 위시리스트에 이미 추가된 상태인지 확인하는 변수
    const isAddedToWishlist = heartIcon.classList.contains('fa-heart');

    if (isAddedToWishlist) {
      // 위시리스트에서 삭제하는 경우
      axios
        .delete('/mypage/wishlist', {
          data: { wish_list: bookId },
          headers: {
            Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
          },
        })
        .then(function () {
          loadUserLikeStores();
          console.log('삭제 성공');
          // 위시리스트에서 삭제 성공 시 하트 아이콘의 클래스 변경
          heartIcon.classList.remove('fa-heart');
          heartIcon.classList.add('fa-heart-o');
          heartIcon.style.color = 'black'; // 하트 색상을 원래대로 변경
        })
        .catch(function (error) {
          console.log(error);
          alert(error.response.data.message);
        });
    } else {
      // 위시리스트에 추가하는 경우
      axios
        .post(
          '/mypage/wishlist',
          { wish_list: bookId },
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
            },
          },
        )
        .then(function () {
          loadUserLikeStores();
          console.log('수정 성공');
          // 위시리스트에 추가 성공 시 하트 아이콘의 클래스 변경
          heartIcon.classList.remove('fa-heart-o');
          heartIcon.classList.add('fa-heart');
          heartIcon.style.color = 'red'; // 하트 색상을 빨간색으로 변경
        })
        .catch(function (error) {
          console.log(error);
          alert(error.response.data.message);
        });
    }
  });
