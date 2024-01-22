const header = document.getElementById('header');
const body = document.getElementById('card-list');

window.onload = function () {
  const token = localStorage.getItem('accessToken');

  if (!token) {
    loadHeader('home'); // load the home page by default
  } else {
    loadHeader('login');
  }

  mainBookcard();
};

function mainBookcard() {
  axios
    .get('/books/main')
    .then(function (response) {
      const books = response.data;
      books.forEach((book) => {
        // console.log(book);
        body.innerHTML += `
        <div class="col">
                <div class="card h-100">
                  <img
                    src="${book.book_image}"
                    class="card-img-top"
                    alt="..."
                  />
                  <div class="card-body">
                    <h5 class="card-title">${book.title}</h5>
                    <p class="card-text">
                      ${book.genre}
                    </p>
                    <p class="card-text">
                      ${book.publisher}
                    </p>  
                  </div>
                </div>
              </div>`;
      });
    })
    .catch(function (error) {
      console.log(error);
    });
}

// header 부분
function loadHeader(page) {
  let headerContent = '';

  if (page === 'home') {
    headerContent = `<h2>Home Page</h2>`;
    // 로그인 시 로그인 회원 정보 출력
  } else if (page === 'login') {
    headerContent = `
    <div class="container" style="max-width: 3000px">
        <div class="d-flex flex-wrap align-items-center justify-content-center">
          <ul class="nav col col-lg-auto me-lg-5 mb-2 mb-md-0 text-center">
            <li><a href="#" class="nav-link px-2 text-white">HOME</a></li>
            <li><a href="#" class="nav-link px-2 text-white">INTRODUCE</a></li>
          </ul>
          <form class="col-12 col-md-6 d-flex mb-3 mb-lg-0" role="search">
            <input
              type="search"
              class="form-control"
              placeholder="Search..."
              aria-label="Search"
            />
          </form>
          <div
            class="col-1 dropdown text-end justify-content-lg-end justify-content-end"
          >
            <a
              href="#"
              class="d-block link-body-emphasis text-decoration-none dropdown-toggle"
              data-bs-toggle="dropdown"
              aria-expanded="false"
            >
              <img
                src="https://github.com/mdo.png"
                alt="mdo"
                width="32"
                height="32"
                class="rounded-circle"
              />
            </a>
            <ul
              class="dropdown-menu text-small justify-content-end text-end text-center"
            >
              <li><a class="dropdown-item" href="#">내 정보</a></li>
              <li><a class="dropdown-item" href="#">위시리스트</a></li>
              <li><hr class="dropdown-divider" /></li>
              <li><a class="dropdown-item" href="#">로그아웃</a></li>
            </ul>
          </div>
        </div>
      </div>
    `;
  }

  header.innerHTML = headerContent;
}
