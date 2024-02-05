let mapDiv = document.getElementById('map');
/**
 *
 * @callback addressToCoordinateCallback
 */

/**
 *
 * @param {string} address
 * @param {addressToCoordinateCallback} callback
 */
function addressToCoordinate(address, callback) {
  naver.maps.Service.geocode(
    {
      query: address,
    },
    function (status, response) {
      if (status === naver.maps.Service.Status.ERROR) {
        return alert('Something Wrong!');
      }

      if (response.v2.meta.totalCount === 0) {
        return alert('totalCount' + response.v2.meta.totalCount);
      }

      var htmlAddresses = [],
        item = response.v2.addresses[0],
        point = new naver.maps.Point(item.x, item.y);

      if (item.roadAddress) {
        htmlAddresses.push('[도로명 주소] ' + item.roadAddress);
      }
      if (item.jibunAddress) {
        htmlAddresses.push('[지번 주소] ' + item.jibunAddress);
      }
      if (item.englishAddress) {
        htmlAddresses.push('[영문명 주소] ' + item.englishAddress);
      }
      callback(point);
    },
  );
}

window.onload = function () {
  const token = localStorage.getItem('accessToken');

  if (!token) {
    loadHeader('home'); // load the home page by default
  } else {
    loadHeader('login');
  }

  let map = new naver.maps.Map(mapDiv, {
    center: new naver.maps.LatLng(37.4986253, 127.0280285),
    zoom: 16,
  });

  searchResult();

  // load the map by default
  if (!token) {
    return;
  }

  // load userinfo
  axios
    .get('/mypage', {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
      },
    })
    .then(function (response) {
      address = response.data.address;
      if (!address) {
        console.log('no address');
      } else {
        onReq(address);
      }
    })
    .catch(function (error) {
      console.log(error);
    });

  function onReq(address) {
    addressToCoordinate(address, (point) => {
      map.setCenter(point);
    });
  }
};

async function storeSearch(location) {
  axios.get(`/map/${location}`, {}).then(async function (response) {
    const stores = response.data;
    let marker = new naver.maps.Marker({});
    stores.forEach((element) => {
      element.place;
    });
  });
}

async function searchResult() {
  axios
    .get('/store', {})
    .then(async function (response) {
      const stores = response.data;
      const pages = numPages(stores);

      changePage(1); // set default page
      await addPages(); // generate page navigation

      // reference to keep track of current page
      let currentPage = 1;

      function numPages(cardsArray) {
        const itemsPerPage = 16;
        // returns the number of pages
        return Math.ceil(cardsArray.length / itemsPerPage);
      }

      function createCardElement(card) {
        let searchhtml = `
          <div onclick="carddetail(${card.id})" class="col-3 mb-3">
            <div class="col">
              <div class="card">
                <img src="${card.store_image}" class="card-img-top" alt="...">
                <div class="card-body">
                  <h5 class="card-title">${card.store_name}</h5>
                </div>
              </div>
            </div>
          </div>
        `;

        return searchhtml;
      }

      function changePage(page) {
        const output = document.getElementById('output');
        output.innerHTML = '';
        const itemsPerPage = 16;

        if (page < 1) page = 1;
        if (page > pages) page = pages;
        output.innerHTML = '';

        for (
          let i = (page - 1) * itemsPerPage;
          i < page * itemsPerPage && i < stores.length;
          i++
        ) {
          // 검색 정보 배열로 저장

          const card = stores[i];
          output.innerHTML += createCardElement(card);
        }
      }

      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      async function addPages() {
        const el = document.getElementById('pages');
        el.innerHTML = '';
        for (let i = 1; i < pages + 1; i++) {
          el.innerHTML += `<li><a onclick="allgotoPage(${i})">${i}</a></li>`;
        }
      }

      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      async function nextPage() {
        if (currentPage < pages) changePage(++currentPage);
      }
      allnextPage = nextPage;

      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      async function prevPage() {
        if (currentPage > 1) changePage(--currentPage);
      }
      allprevPage = prevPage;

      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      async function gotoPage(page) {
        currentPage = page;
        changePage(page);
      }
      allgotoPage = gotoPage;
    })
    .catch(function (error) {
      console.log(error);
    });
}

function introduce() {
  if (navigator.geolocation) {
    /**
     * navigator.geolocation 은 Chrome 50 버젼 이후로 HTTP 환경에서 사용이 Deprecate 되어 HTTPS 환경에서만 사용 가능 합니다.
     * http://localhost 에서는 사용이 가능하며, 테스트 목적으로, Chrome 의 바로가기를 만들어서 아래와 같이 설정하면 접속은 가능합니다.
     * chrome.exe --unsafely-treat-insecure-origin-as-secure="http://example.com"
     */
    navigator.geolocation.getCurrentPosition(
      onSuccessGeolocation,
      onErrorGeolocation,
    );
  } else {
    console.log('error');
  }
}
// 사용자 위치 불러오기
function onSuccessGeolocation(position) {
  var location = new naver.maps.LatLng(
    position.coords.latitude,
    position.coords.longitude,
  );

  map.setCenter(location); // 얻은 좌표를 지도의 중심으로 설정합니다.
  map.setZoom(16); // 지도의 줌 레벨을 변경합니다.

  console.log('Coordinates: ' + location.toString());
}

function onErrorGeolocation() {
  console.log('위치 정보 권한 획득 실패');
}
