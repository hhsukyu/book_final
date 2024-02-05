document
  .getElementById('addToLikestoreButton')
  .addEventListener('click', function () {
    const storeId = document
      .getElementById('modalcardStorename')
      .getAttribute('data-store-id');

    console.log('버튼클릭후 storeId', storeId);
    const likestoreButton = document.getElementById('addToLikestoreButton');
    const heartIcon = likestoreButton.querySelector('.fa');

    // 라이크스토어에 이미 추가된 상태인지 확인하는 변수
    const isAddedToLikestore = heartIcon.classList.contains('fa-heart');

    if (isAddedToLikestore) {
      // 라이크스토어에서 삭제하는 경우
      axios
        .delete('/mypage/likestore', {
          data: { like_store: storeId },
          headers: {
            Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
          },
        })
        .then(function () {
          loadUserLikeStores();
          console.log('삭제 성공');
          // 라이크스토어에서 삭제 성공 시 하트 아이콘의 클래스 변경
          heartIcon.classList.remove('fa-heart');
          heartIcon.classList.add('fa-heart-o');
          heartIcon.style.color = 'black'; // 하트 색상을 원래대로 변경
        })
        .catch(function (error) {
          console.log(error);
          alert(error.response.data.message);
        });
    } else {
      // 라이크스토어에 추가하는 경우
      axios
        .post(
          '/mypage/likestore',
          { like_store: storeId },
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
            },
          },
        )
        .then(function () {
          loadUserLikeStores();
          console.log('수정 성공');
          // 라이크스토어에 추가 성공 시 하트 아이콘의 클래스 변경
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
