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

// 구글 애널리틱스 API 클라이언트 라이브러리 로드
gapi.load('client:auth2', initAnalytics);

function initAnalytics() {
  // API 클라이언트 초기화
  gapi.client
    .init({
      apiKey: 'AIzaSyAxaM7EQsn_vYnuct4hqukbFqlZN3JeTwo', // 여기에 생성한 API 키를 입력하세요
    })
    .then(function () {
      // API 호출
      return gapi.client.request({
        path: '/v4/reports:batchGet',
        root: 'https://analyticsreporting.googleapis.com/',
        method: 'POST',
        body: {
          reportRequests: [
            {
              viewId: 'G-8FHVJJ85S5', // 여기에 구글 애널리틱스 뷰 ID를 입력하세요
              dateRanges: [
                {
                  startDate: '2024-02-04',
                  endDate: '2024-02-04',
                },
              ],
              metrics: [
                {
                  expression: 'ga:sessions',
                },
              ],
            },
          ],
        },
      });
    })
    .then(function (response) {
      // API 호출 결과 처리
      var data = response.result.reports[0].data;
      var totalSessions = data.totals[0].values[0];
      console.log('Total Sessions:', totalSessions);
    })
    .catch(function (error) {
      console.error('Error:', error);
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
