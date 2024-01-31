window.onload = function () {
  const token = localStorage.getItem('accessToken');

  if (!token) {
    loadHeader('home'); // load the home page by default
  } else {
    loadHeader('login');
  }

  userme();
};

// eslint-disable-next-line @typescript-eslint/no-unused-vars

// eslint-disable-next-line @typescript-eslint/no-unused-vars
function userme() {
  const storetab = document.getElementById('storetab');

  const userimage = document.getElementById('profileImage');
  const useraddress = document.getElementById('addressSearch');

  axios
    .get('/user/me', {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
      },
    })
    .then(function (response) {
      console.log(response);
      user = response.data;

      userimage.src = user.photo;
      useraddress.value = user.myPage.address;
      console.log(user.photo);

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
}

//지점 신규 등록
// eslint-disable-next-line @typescript-eslint/no-unused-vars
function storebtn(event) {
  event.preventDefault();

  const storeimgInput = document.getElementById('createstoreimg');
  const storeimgFile = storeimgInput.files[0];

  const formData = new FormData();
  formData.append('store_name', document.getElementById('storename').value);
  formData.append('store_desc', document.getElementById('storedesc').value);
  formData.append('file', storeimgFile);
  formData.append(
    'store_address',
    document.getElementById('createstoreaddress').value +
      document.getElementById('storedetailaddress').value,
  );
  formData.append('store_open', document.getElementById('opening-time').value);
  formData.append('store_close', document.getElementById('closing-time').value);

  axios
    .post('/store', formData, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
      },
    })
    .then(function () {
      alert('지점이 등록되었습니다.');
    })
    .catch(function (error) {
      console.log(error);
    });
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
      console.log(response);
      user = response.data;
      let checkstore = user.stores;
      console.log(checkstore);
      if (checkstore.length !== 0) {
        axios
          .get('/store/mystore', {
            headers: {
              Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
            },
          })
          .then(function (response) {
            console.log(response.data);
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
}

//지점 신규 등록
// eslint-disable-next-line @typescript-eslint/no-unused-vars
function storebtn(event) {
  event.preventDefault();

  const storeimgInput = document.getElementById('createstoreimg');
  const storeimgFile = storeimgInput.files[0];

  const formData = new FormData();
  formData.append('store_name', document.getElementById('storename').value);
  formData.append('store_desc', document.getElementById('storedesc').value);
  formData.append('file', storeimgFile);
  formData.append(
    'store_address',
    document.getElementById('createstoreaddress').value +
      document.getElementById('storedetailaddress').value,
  );
  formData.append('store_open', document.getElementById('opening-time').value);
  formData.append('store_close', document.getElementById('closing-time').value);

  axios
    .post('/store', formData, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
      },
    })
    .then(function () {
      alert('지점이 등록되었습니다.');
    })
    .catch(function (error) {
      console.log(error);
    });
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
      console.log(response);
      user = response.data;
      let checkstore = user.stores;
      console.log(checkstore);
      if (checkstore.length !== 0) {
        axios
          .get('/store/mystore', {
            headers: {
              Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
            },
          })
          .then(function (response) {
            console.log(response.data);
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
      'http://kowpic.cafe24.com/wp-content/plugins/mangboard/includes/mb-file.php?path=2019%2F12%2F05%2FF7_1196096794_test.png';
  }

  console.log(store);
  storelist.innerHTML += `
    <div id="storelistcard" class="card mb-3" onclick="updatemodal(${store.id})" >
      <div class="row g-0">
        <div class="col-md-4">
          <img src="${img}" class="img-fluid rounded-start" alt="...">
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
      console.log(response.data[0]);
      const store = response.data[0];

      let img = `${store.store_img}`;

      if (store.store_img === '') {
        img =
          'http://kowpic.cafe24.com/wp-content/plugins/mangboard/includes/mb-file.php?path=2019%2F12%2F05%2FF7_1196096794_test.png';
      }

      storename.value = store.store_name;
      storeimg.src = img;
      storedesc.value = store.store_desc;
      storeaddress.value = store.store_address;
      opentime.value = store.store_open;
      closetime.value = store.store_close;
      checkstoreid = store.id;
      console.log(checkstoreid);
      menuinfo(checkstoreid);
    })
    .catch(function (error) {
      console.log(error);
    });
}

//지점 수정
// eslint-disable-next-line @typescript-eslint/no-unused-vars
function updatestore(event) {
  event.preventDefault();

  const storeimgInput = document.getElementById('storeimg');
  const storeimgFile = storeimgInput.files[0];

  const formData = new FormData();
  formData.append('store_name', document.getElementById('upstorename').value);
  formData.append('store_desc', document.getElementById('upstoredesc').value);
  formData.append('file', storeimgFile);
  formData.append(
    'store_address',
    document.getElementById('upstoreaddress').value +
      document.getElementById('upstoredetailaddress').value,
  );

  formData.append('place', [0, 0]); // 추후 네이버 좌표변환 API 적용

  formData.append(
    'store_open',
    document.getElementById('upopening-time').value,
  );
  formData.append(
    'store_close',
    document.getElementById('upclosing-time').value,
  );

  axios
    .put('store/' + checkstoreid, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
        Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
      },
    })
    .then(function () {
      alert('수정 성공');
    })
    .catch(function (error) {
      console.log(error);
    });
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
function storemodalfade() {
  $('#updatestoremodal').modal('hide');
}

//책 수정 버튼
// eslint-disable-next-line @typescript-eslint/no-unused-vars
function bookbtn() {}

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
