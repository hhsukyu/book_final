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
