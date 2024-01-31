// 서버 주소 (백엔드 API 주소로 수정 필요)
const apiUrl = 'http://localhost:3000';

let mapOptions = {
  center: new naver.maps.LatLng(37.4986253, 127.0280285),
  zoom: 10,
};

let mapDiv = document.getElementById('map');
let map = new naver.maps.Map(mapDiv);
