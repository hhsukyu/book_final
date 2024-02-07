// /**
//  *
//  * @callback addressToCoordinateCallback
//  */

// /**
//  *
//  * @param {string} address
//  * @param {addressToCoordinateCallback} callback
//  */
// function addressToCoordinate(address, callback) {
//   naver.maps.Service.geocode(
//     {
//       query: address,
//     },
//     function (status, response) {
//       if (status === naver.maps.Service.Status.ERROR) {
//         return alert('Something Wrong!');
//       }

//       if (response.v2.meta.totalCount === 0) {
//         return alert('totalCount' + response.v2.meta.totalCount);
//       }

//       var htmlAddresses = [],
//         item = response.v2.addresses[0],
//         point = new naver.maps.Point(item.x, item.y);

//       if (item.roadAddress) {
//         htmlAddresses.push('[도로명 주소] ' + item.roadAddress);
//       }
//       if (item.jibunAddress) {
//         htmlAddresses.push('[지번 주소] ' + item.jibunAddress);
//       }
//       if (item.englishAddress) {
//         htmlAddresses.push('[영문명 주소] ' + item.englishAddress);
//       }
//       callback(point);
//     },
//   );
// }

// function onReq(address) {
//   addressToCoordinate(address, (point) => {
//     map.setCenter(point);
//     storeSearch([point[1], point[0]]);
//   });
// }
// eslint-disable-next-line @typescript-eslint/no-unused-vars
let allprevPage;
// eslint-disable-next-line @typescript-eslint/no-unused-vars
let allnextPage;
// eslint-disable-next-line @typescript-eslint/no-unused-vars
let allgotoPage;

// onload
async function start() {
  const token = localStorage.getItem('accessToken');

  if (!token) {
    loadHeader('home'); // load the home page by default
  } else {
    loadHeader('login');
  }

  introduce();
  searchResult();
}

function introduce() {
  const geo = navigator.geolocation;
  if (geo) {
    /**
     * navigator.geolocation 은 Chrome 50 버젼 이후로 HTTP 환경에서 사용이 Deprecate 되어 HTTPS 환경에서만 사용 가능 합니다.
     * http://localhost 에서는 사용이 가능하며, 테스트 목적으로, Chrome 의 바로가기를 만들어서 아래와 같이 설정하면 접속은 가능합니다.
     * chrome.exe --unsafely-treat-insecure-origin-as-secure="http://example.com"
     */
    geo.getCurrentPosition(onSuccessGeolocation, onErrorGeolocation);
  } else {
    console.log('Geolocation not supported');
  }
}
// 사용자 위치 불러오기
async function onSuccessGeolocation(position) {
  const mapDiv = document.getElementById('map');
  let location = new naver.maps.LatLng(
    position.coords.latitude,
    position.coords.longitude,
  );
  let map = new naver.maps.Map(mapDiv, {
    center: location,
    zoom: 12,
  });
  let mylocation = new naver.maps.Marker({
    position: location,
    map: map,
  });

  const locationText = location.toString().split(',');
  const locationData = `${locationText[1].slice(4, -1)}, ${locationText[0].substring(5)}`;
  const marker = await storeSearch(locationData);
  console.log(marker);
  let markers = [];
  for (let i = 0; i < marker.length; i = i + 2) {
    const newmarker = new naver.maps.Marker({
      position: new naver.maps.LatLng(marker[i], marker[i + 1]),
      map: map,
    });
    markers.push(newmarker);
  }
}

async function onErrorGeolocation() {
  const mapDiv = document.getElementById('map');
  console.log('위치 정보 권한 획득 실패');
  let map = new naver.maps.Map(mapDiv, {
    center: new naver.maps.LatLng(37.4986253, 127.0280285),
    zoom: 12,
  });
  let mylocation = new naver.maps.Marker({
    position: new naver.maps.LatLng(37.4986253, 127.0280285),
    map: map,
  });
  const marker = await storeSearch('127.0280285, 37.4986253');
  console.log(marker);
  let markers = [];
  for (let i = 0; i < marker.length; i = i + 2) {
    const newmarker = new naver.maps.Marker({
      position: new naver.maps.LatLng(marker[i], marker[i + 1]),
      map: map,
    });
    markers.push(newmarker);
  }
}

async function storeSearch(location) {
  try {
    const response = await axios.get(`/map/${location}`);
    const stores = response.data;

    console.log(stores);
    if (!stores) {
      console.log('no nearby store');
      return;
    }

    let latlngs = [];
    stores.forEach((element) => {
      console.log(element);
      const x = String(element.place).slice(6, -1);
      const y = x.split(' ');
      latlngs.push(y[1]); //위도 경도 순서 바꾸기
      latlngs.push(y[0]);
    });
    return latlngs;
  } catch (error) {
    console.log(error);
  }
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
        const el = document.getElementById('storepages');
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

start();
