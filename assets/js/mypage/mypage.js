userme();

// eslint-disable-next-line @typescript-eslint/no-unused-vars
function userme() {
  const storetab = document.getElementById('storetab');

  const userimage = document.getElementById('profileImage');
  const useraddress = document.getElementById('addressSearch');
  const useremail = document.getElementById('user-Email');
  const usernickname = document.getElementById('user-Nickname');

  axios
    .get('/user/me', {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
      },
    })
    .then(function (response) {
      // console.log(response);
      user = response.data;

      useremail.innerHTML = `<p class="fs-6">${user.email}</p>`;
      usernickname.innerHTML = `<p class="fs-6">${user.nickname}</p>`;
      userimage.src = user.photo;
      useraddress.value = user.myPage.address;
      // console.log(user.photo);

      if (user.role === 0) {
        storetab.style.display = 'none';
      }
    })
    .catch(function (error) {
      console.log(error);
    });
}

//마이페이지 수정 및 저장
// eslint-disable-next-line @typescript-eslint/no-unused-vars
function myprofilebtn(event) {
  event.preventDefault();
  const profileimgInput = document.getElementById('profileimg');
  const addressInput = document.getElementById('addressSearch');

  const profileimgFile = profileimgInput.files[0];
  const address = addressInput.value;

  const formData = new FormData();
  formData.append('file', profileimgFile);

  if (!profileimgFile) {
    console.log('넘어가기');
  } else {
    axios
      .put('/user/profileimg', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
        },
      })
      .then(function () {
        // 성공적으로 이미지를 서버로 전송한 후의 처리

        console.log('이미지 저장 성공');
      })
      .catch(function (error) {
        // 에러 처리
        console.log(error);
      });
  }

  if (address !== '') {
    axios
      .put(
        '/mypage/address',
        {
          address: address,
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
          },
        },
      )
      .then(function () {
        console.log('주소 저장 성공');
      })
      .catch(function (error) {
        console.log(error);
      });
  } else {
    console.log('넘어가기');
  }

  setTimeout(function () {
    alert('수정완료');
    window.location.reload();
  }, 1000);
}

//지점 신규 등록
//플레이스 지도 변환 js
// eslint-disable-next-line @typescript-eslint/no-unused-vars
async function storebtn(event) {
  event.preventDefault();
  const createstoreaddressInput = document.getElementById('createstoreaddress');
  // const storedetailaddressInput = document.getElementById('storedetailaddress');
  const storenameInput = document.getElementById('storename');
  const storedescInput = document.getElementById('storedesc');
  const storeimgInput = document.getElementById('createstoreimg');
  const openingtimeInput = document.getElementById('opening-time');
  const closingtimeInput = document.getElementById('closing-time');

  const resultaddress = createstoreaddressInput.value;

  const addressToCoordinate = async (address) => {
    return new Promise((resolve, reject) => {
      naver.maps.Service.geocode(
        {
          query: address,
        },
        function (status, response) {
          if (status === naver.maps.Service.Status.ERROR) {
            return reject('Something Wrong!');
          }

          if (response.v2.meta.totalCount === 0) {
            return reject('totalCount' + response.v2.meta.totalCount);
          }

          var item = response.v2.addresses[0],
            x = item.x,
            y = item.y,
            coordinate = [x, y];

          resolve(coordinate);
        },
      );
    });
  };

  try {
    const coordinate = await addressToCoordinate(resultaddress);

    // console.log(coordinate);
    const storeimgFile = storeimgInput.files[0];

    const formData = new FormData();
    formData.append('store_name', storenameInput.value);
    formData.append('store_desc', storedescInput.value);
    formData.append('file', storeimgFile);
    formData.append('place', coordinate);
    formData.append('store_address', resultaddress);
    formData.append('store_open', openingtimeInput.value);
    formData.append('store_close', closingtimeInput.value);

    axios
      .post('/store', formData, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
        },
      })
      .then(function () {
        alert('지점이 등록되었습니다.');
        window.location.reload();
      })
      .catch(function (error) {
        console.log(error);
      });
  } catch (error) {
    console.error(error);
  }
}

//store 처음 저장
const storelist = document.getElementById('mypagestores');
const menulist = document.getElementById('menulist');

//지점 정보 가져오는 부분
// eslint-disable-next-line @typescript-eslint/no-unused-vars
function storeinfo() {
  storelist.innerHTML = '';

  axios
    .get('/user/me', {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
      },
    })
    .then(function (response) {
      // console.log(response);
      user = response.data;
      let checkstore = user.stores;
      // console.log(checkstore);
      if (checkstore.length !== 0) {
        axios
          .get('/store/mystore', {
            headers: {
              Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
            },
          })
          .then(function (response) {
            // console.log(response.data);
            const storeinfos = response.data;
            storeinfos.forEach((store) => {
              addstorelist(store);
            });
          })
          .catch(function (error) {
            console.log(error);
          });
      } else {
        console.log('등록된 지점이 없습니다.');
      }
    })
    .catch(function (error) {
      console.log(error);
    });
}

// 카드 생성 함수
function addstorelist(store) {
  let img = `${store.store_img}`;

  if (store.store_img === '') {
    img =
      'https://kowpic.cafe24.com/wp-content/plugins/mangboard/includes/mb-file.php?path=2019%2F12%2F05%2FF7_1196096794_test.png';
  }

  // console.log(store);
  storelist.innerHTML += `
    <div id="storelistcard" class="card mb-3" onclick="updatemodal(${store.id})" >
      <div class="row g-0">
        <div class="col-md-4">
          <img src="${img}" id="storelistcardimg" class="img-fluid rounded-start" alt="...">
        </div>
        <div class="col-md-8">
          <div class="card-body">
            <h5 class="card-title">${store.store_name}</h5>
            <p class="card-text">${store.store_desc}</p>
            <p class="card-text"><small class="text-body-secondary">${store.store_address}</small></p>
            <p class="card-text"><small class="text-body-secondary">${store.store_open} ~ ${store.store_close}</small></p>
          </div>
        </div>
      </div>
    </div>
  `;
}

let checkstoreid;

// eslint-disable-next-line @typescript-eslint/no-unused-vars
function updatemodal(store) {
  $('#updatestoremodal').modal('show');
  menulist.innerHTML = '';
  booklist.innerHTML = '';
  reviews.innerHTML = '';
  const storename = document.getElementById('upstorename');
  const storeimg = document.getElementById('storeImage');
  const storedesc = document.getElementById('upstoredesc');
  const storeaddress = document.getElementById('upstoreaddress');
  // const storeaddressdetail = document.getElementById('upstoredetailaddress');
  const opentime = document.getElementById('upopening-time');
  const closetime = document.getElementById('upclosing-time');

  axios
    .get('store/' + store)
    .then(function (response) {
      // console.log(response.data[0]);
      const store = response.data[0];

      let img = `${store.store_img}`;

      if (store.store_img === '') {
        img =
          'https://kowpic.cafe24.com/wp-content/plugins/mangboard/includes/mb-file.php?path=2019%2F12%2F05%2FF7_1196096794_test.png';
      }

      storename.value = store.store_name;
      storeimg.src = img;
      storedesc.value = store.store_desc;
      storeaddress.value = store.store_address;
      opentime.value = store.store_open;
      closetime.value = store.store_close;
      checkstoreid = store.id;
      // console.log(checkstoreid);
      menuinfo(checkstoreid);
      bookinfo(checkstoreid);
      reviewinfo(checkstoreid);
    })
    .catch(function (error) {
      console.log(error);
    });
}

//지점 수정
// eslint-disable-next-line @typescript-eslint/no-unused-vars
async function updatestorebtn(event) {
  event.preventDefault();

  const createstoreaddressInput2 = document.getElementById('upstoreaddress');
  // const storedetailaddressInput2 = document.getElementById(
  //   'updatestoreaddress2',
  // );
  const storenameInput = document.getElementById('upstorename');
  const storedescInput = document.getElementById('upstoredesc');
  const storeimgInput = document.getElementById('upstoreimg');
  const openingtimeInput = document.getElementById('upopening-time');
  const closingtimeInput = document.getElementById('upclosing-time');

  // console.log(createstoreaddressInput2, storedetailaddressInput2);

  const resultaddress = createstoreaddressInput2.value;

  const addressToCoordinate = async (address) => {
    return new Promise((resolve, reject) => {
      naver.maps.Service.geocode(
        {
          query: address,
        },
        function (status, response) {
          if (status === naver.maps.Service.Status.ERROR) {
            return reject('Something Wrong!');
          }

          if (response.v2.meta.totalCount === 0) {
            return reject('totalCount' + response.v2.meta.totalCount);
          }

          var item = response.v2.addresses[0],
            x = item.x,
            y = item.y,
            coordinate = [x, y];

          resolve(coordinate);
        },
      );
    });
  };

  try {
    const coordinate = await addressToCoordinate(resultaddress);

    console.log(coordinate);
    const storeimgFile = storeimgInput.files[0];

    const formData = new FormData();
    formData.append('store_name', storenameInput.value);
    formData.append('store_desc', storedescInput.value);
    formData.append('file', storeimgFile);
    formData.append('place', coordinate);
    formData.append('store_address', resultaddress);
    formData.append('store_open', openingtimeInput.value);
    formData.append('store_close', closingtimeInput.value);

    axios
      .put(`/store/${checkstoreid}`, formData, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
        },
      })
      .then(function () {
        alert('지점이 수정되었습니다.');
        window.location.reload();
      })
      .catch(function (error) {
        console.log(error);
      });
  } catch (error) {
    console.error(error);
  }
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
function storemodalfade() {
  $('#updatestoremodal').modal('hide');
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
function searchAddress() {
  new daum.Postcode({
    oncomplete: function (data) {
      document.getElementById('addressSearch').value = data.roadAddress;
    },
  }).open();
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
function createstoreAddress() {
  new daum.Postcode({
    oncomplete: function (data) {
      document.getElementById('createstoreaddress').value = data.roadAddress;
    },
  }).open();
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
function updatestoreAddress() {
  new daum.Postcode({
    oncomplete: function (data) {
      document.getElementById('upstoreaddress').value = data.roadAddress;
    },
  }).open();
}
