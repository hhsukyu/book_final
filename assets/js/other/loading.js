const loading_page = document.getElementById('loading');

// eslint-disable-next-line @typescript-eslint/no-unused-vars
function loadingshow() {
  loading_page.innerHTML = ` 
  <div id="load">
  <img src="./url/Book.gif" alt="loading" />
</div>
  `;
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
function loadingfade() {
  loading_page.innerHTML = ``;
}

loadingshow();

window.addEventListener('load', function () {
  // 로딩 중인 요소를 제거하거나 숨기는 작업을 여기에 작성합니다.
  // 예를 들어, 로딩 UI를 숨기는 작업을 수행할 수 있습니다.
  loadingfade();
});
