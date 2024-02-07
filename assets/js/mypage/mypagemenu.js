//메뉴 불러오기
// eslint-disable-next-line @typescript-eslint/no-unused-vars
function menuinfo(storeid) {
  console.log(storeid);
  axios
    .get('/menu/storeid/' + storeid)
    .then(function (response) {
      //   console.log(response.data);
      const menus = response.data;

      menus.forEach((menu) => {
        // console.log(menu);
        menulists(menu);
      });
    })
    .catch(function (error) {
      console.log(error);
    });
}

//메뉴 화면에 출력
function menulists(menu) {
  let img = `${menu.food_img}`;

  if (menu.food_img === '') {
    img =
      'https://kowpic.cafe24.com/wp-content/plugins/mangboard/includes/mb-file.php?path=2019%2F12%2F05%2FF7_1196096794_test.png';
  }

  menulist.innerHTML += `
  <div id="menulistcard" class="card mb-3" >
    <div class="row g-0">
      <div class="col-md-4">
        <img src="${img}" class="img-fluid rounded-start" alt="...">
      </div>
      <div class="col-md-8">
        <div class="card-body">
          <h5 class="card-title">${menu.food_name}</h5>
          <p class="card-text">${menu.food_desc}</p>
          <div id="menucardbtn">
          <p class="card-text"><small class="text-body-secondary">${menu.food_price}</small></p>
          <button onclick="updatemenumodal(event, ${menu.id})" class="btn" data-bs-target="#updatemenumodal" data-bs-toggle="modal">수정하기</button>
          </div>  
          </div>
      </div>
    </div>
  </div>`;
}

//메뉴 등록 부분
// eslint-disable-next-line @typescript-eslint/no-unused-vars
function addmenu(event) {
  event.preventDefault();
  //food 이미지 부분
  const menuimgInput = document.getElementById('menuimg');
  const menuimgFile = menuimgInput.files[0];

  const menuname = document.getElementById('menuname').value;

  const menudesc = document.getElementById('menudesc').value;
  const menuprice = document.getElementById('menuprice').value;

  //   if(menuimgInput.value === "") {

  //   }

  const formData = new FormData();
  formData.append('food_name', menuname);

  formData.append('file', menuimgFile);
  formData.append('food_desc', menudesc);
  formData.append('food_price', menuprice);

  //스토어 아이디 확인용
  console.log(checkstoreid);
  axios
    .post('menu/storeid/' + checkstoreid, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
        Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
      },
    })
    .then(function () {
      alert('메뉴등록 성공');
      window.location.reload();
    })
    .catch(function (error) {
      console.log(error);
    });
}

//수정할 메뉴 아이디
let checkmenuid;

// eslint-disable-next-line @typescript-eslint/no-unused-vars
function updatemenumodal(event, menuid) {
  event.preventDefault();
  //   console.log(checkstoreid, menuid);
  const menuname = document.getElementById('upmenuname');
  const menuimg = document.getElementById('upmenuimge');
  const menudesc = document.getElementById('upmenudesc');
  const menuprice = document.getElementById('upmenuprice');

  axios
    .get(`/menu/storeid/${checkstoreid}/${menuid}`)
    .then(function (response) {
      const menu = response.data;
      menuname.value = menu.food_name;
      menudesc.value = menu.food_desc;
      menuimg.src = menu.food_img;
      menuprice.value = menu.food_price;
      checkmenuid = menuid;
    })
    .catch(function (error) {
      console.log(error);
    });
}

//메뉴 수정
// eslint-disable-next-line @typescript-eslint/no-unused-vars
function updatemenu(event) {
  event.preventDefault();
  //   console.log(checkstoreid, checkmenuid);

  const menuimgInput = document.getElementById('upmenuimg');
  const menuimgFile = menuimgInput.files[0];

  const formData = new FormData();
  formData.append('food_name', document.getElementById('upmenuname').value);
  formData.append('food_desc', document.getElementById('upmenudesc').value);
  formData.append('file', menuimgFile);
  formData.append('food_price', document.getElementById('upmenuprice').value);

  axios
    .patch(`/menu/storeid/${checkstoreid}/${checkmenuid}`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
        Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
      },
    })
    .then(function () {
      alert('메뉴수정 성공');
      window.location.reload();
    })
    .catch(function (error) {
      console.log(error);
    });
}
