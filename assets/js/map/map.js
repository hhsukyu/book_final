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

introduce();
searchResult();

function introduce() {
  const geo = navigator.geolocation;
  if (geo) {
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
    zoom: 13,
  });
  let mylocation = new naver.maps.Marker({
    position: location,
    map: map,
    icon: {
      url: '../url/marker-pink.png',
    },
  });

  const contentString = `
    <div class="iw_inner">
      <p>내 위치</p>
    </div>`;

  const infowindow = new naver.maps.InfoWindow({
    content: contentString,
  });

  naver.maps.Event.addListener(mylocation, 'click', () => {
    if (infowindow.getMap()) {
      infowindow.close();
    } else {
      infowindow.open(map, mylocation);
    }
  });

  const locationText = location.toString().split(',');
  const locationData = `${locationText[1].slice(4, -1)}, ${locationText[0].substring(5)}`;
  const marker = await storeSearch(locationData);
  let markers = [];
  for (let i = 0; i < marker.length; i = i + 3) {
    const newmarker = new naver.maps.Marker({
      position: new naver.maps.LatLng(marker[i], marker[i + 1]),
      map: map,
    });

    const contentString = `
    <div class="iw_inner">
      <p>${marker[i + 2]}</p>
    </div>`;

    const infowindow = new naver.maps.InfoWindow({
      content: contentString,
    });

    naver.maps.Event.addListener(newmarker, 'click', () => {
      if (infowindow.getMap()) {
        infowindow.close();
      } else {
        infowindow.open(map, newmarker);
      }
    });

    markers.push(newmarker);
  }
}

async function onErrorGeolocation() {
  const mapDiv = document.getElementById('map');
  console.log('위치 정보 권한 획득 실패');
  let map = new naver.maps.Map(mapDiv, {
    center: new naver.maps.LatLng(37.4986253, 127.0280285),
    zoom: 13,
  });
  let mylocation = new naver.maps.Marker({
    position: new naver.maps.LatLng(37.4986253, 127.0280285),
    map: map,
    icon: {
      url: '../url/marker-pink.png',
    },
  });

  const contentString = `
    <div class="iw_inner">
      <p>내 위치</p>
    </div>`;

  const infowindow = new naver.maps.InfoWindow({
    content: contentString,
  });

  naver.maps.Event.addListener(mylocation, 'click', () => {
    if (infowindow.getMap()) {
      infowindow.close();
    } else {
      infowindow.open(map, mylocation);
    }
  });

  const marker = await storeSearch('127.0280285, 37.4986253');
  let markers = [];
  for (let i = 0; i < marker.length; i = i + 3) {
    const newmarker = new naver.maps.Marker({
      position: new naver.maps.LatLng(marker[i], marker[i + 1]),
      map: map,
    });

    const contentString = `
    <div class="iw_inner">
      <p>${marker[i + 2]}</p>
    </div>`;

    const infowindow = new naver.maps.InfoWindow({
      content: contentString,
    });

    naver.maps.Event.addListener(newmarker, 'click', () => {
      if (infowindow.getMap()) {
        infowindow.close();
      } else {
        infowindow.open(map, newmarker);
      }
    });

    markers.push(newmarker);
  }
}

async function storeSearch(location) {
  try {
    const response = await axios.get(`/map/${location}`);
    const stores = response.data;

    if (stores.length === 0) {
      console.log('no nearby store');
      return;
    }

    let latlngs = [];
    let storesResult = [];
    stores.forEach((element) => {
      storesResult.push(element);
      const x = String(element.place).slice(6, -1);
      const y = x.split(' ');
      latlngs.push(y[1]); //위도 경도 순서 바꾸기
      latlngs.push(y[0]);
      latlngs.push(element.store_name);
    });
    searchResult(storesResult);
    return latlngs;
  } catch (error) {
    console.log(error);
  }
}

async function searchResult(storesResult) {
  const stores = storesResult;
  if (!stores) {
    console.log('검색 결과가 없습니다.');
    const output = document.getElementById('output');
    output.innerHTML += createNullElement();
    return;
  }
  const pages = numPages(stores);

  changePage(1); // set default page
  await addPages(); // generate page navigation

  // reference to keep track of current page
  let currentPage = 1;

  function createNullElement() {
    const nullElement = `
          <p>주변 3km 이내에 가게가 존재하지 않습니다.</p>
    `;
    return nullElement;
  }

  function numPages(cardsArray) {
    const itemsPerPage = 8;
    // returns the number of pages
    return Math.ceil(cardsArray.length / itemsPerPage);
  }

  function createCardElement(store) {
    const storeElement = `
          <div class="album-item"onclick="storecarddetail(${store.id})">
            <img src="${store.store_img || '기본 이미지 경로'}" alt="${store.store_name}" />
            <div class="album-details">
              <span class="album-title">${store.store_name}</span>
              <span class="album-location">${store.store_address}</span>
            </div>
          </div>
        `;

    return storeElement;
  }

  function changePage(page) {
    const output = document.getElementById('output');
    output.innerHTML = '';
    const itemsPerPage = 8;

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
}
