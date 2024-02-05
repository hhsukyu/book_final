//쿠키값을 로컬스토리지로 변경해주는 함수
// eslint-disable-next-line @typescript-eslint/no-unused-vars
function getCookie(name) {
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) return parts.pop().split(';').shift();
}

//검색창 선택시 검색 페이지로 이동
// eslint-disable-next-line @typescript-eslint/no-unused-vars
function onkeyevent(event) {
  window.location.href = 'search.html';
}
