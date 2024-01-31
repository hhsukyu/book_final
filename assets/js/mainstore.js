// 매장 정보를 가져와서 표시하는 함수
function loadStores() {
  console.log('로드 스토어 실행됨!!!!!!!!!!!!');
  const storeContainer = document.querySelector('.album-store');
  storeContainer.innerHTML = ''; // 기존 내용을 비웁니다.
  axios
    .get('/store')
    .then(function (response) {
      const stores = response.data;
      stores.forEach((store) => {
        const storeElement = `
          <div class="album-item">
            <img src="${store.store_img || '기본 이미지 경로'}" alt="${store.store_name}" />
            <div class="album-details">
              <span class="album-title">${store.store_name}</span>
              <span class="album-intro">${store.store_desc}</span>
              <span class="album-location">${store.store_address}</span>
              <span class="album-open">${store.store_open} ~ ${store.store_close}</span>
            </div>
          </div>
        `;
        storeContainer.innerHTML += storeElement;
      });
    })
    .catch(function (error) {
      console.log(error);
    });
}
