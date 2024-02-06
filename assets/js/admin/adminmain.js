const userinfo = document.getElementById('userlist');
const admininfo = document.getElementById('ownerlist');
userlist();
ownerlist();
storeinfo();

function userlist() {
  axios
    .get('user/userinfo')
    .then(function (response) {
      const users = response.data;

      users.forEach((user) => {
        console.log(user);
        userinfo.innerHTML += `
        <ul">
        <li>${user.nickname}</li>
        </ul>
        `;
      });
    })
    .catch(function (error) {
      console.log(error);
    });
}

function ownerlist() {
  axios
    .get('user/ownerinfo')
    .then(function (response) {
      //   console.log(response.data);
      const admins = response.data;

      admins.forEach((admin) => {
        admininfo.innerHTML += `
        <ul">
        <li>${admin.nickname}</li>
        </ul>
        `;
      });
    })
    .catch(function (error) {
      console.log(error);
    });
}

const storelist = document.getElementById('storelist');

function storeinfo() {
  //   storelist.innerHTML = '';

  axios
    .get('store/admin')
    .then(function (response) {
      // console.log(response);
      console.log(response.data);
      const stores = response.data;
      stores.forEach((store) => {
        addstorelist(store);
      });
    })
    .catch(function (error) {
      console.log(error);
    });
}

// 카드 생성 함수
function addstorelist(store) {
  //   storelist.innerHTML = '';
  let img = `${store.store_img}`;

  if (store.store_img === '') {
    img =
      'http://kowpic.cafe24.com/wp-content/plugins/mangboard/includes/mb-file.php?path=2019%2F12%2F05%2FF7_1196096794_test.png';
  }

  // console.log(store);
  storelist.innerHTML += `
      <div id="storelistcard" class="card mb-3" >
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
