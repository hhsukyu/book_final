// header 부분
// eslint-disable-next-line @typescript-eslint/no-unused-vars
function loadHeader(page) {
  let headerContent = '';

  if (page === 'home') {
    headerContent = `
      <div class="container" style="max-width: 3000px;">
            <div class="d-flex flex-wrap align-items-center justify-content-center">
              <ul class="nav col col-lg-auto me-lg-5 mb-2 mb-md-0 text-center">
                <li><a href="index.html" class="nav-link px-2 text-white">HOME</a></li>
                <li><a id="introbtn" href="introduce.html" class="nav-link px-2 text-white">INTRODUCE</a></li>
              </ul>
              <form class="col-12 col-md-6 d-flex mb-3 mb-lg-0" role="search">
                <input   
                type="search"
                onclick="onkeyevent(event)"
                id="search-box"
                class="form-control"
                placeholder="Search..."
                aria-label="Search"
                />
              </form>
              <ul class="nav col col-lg-auto me-lg-5 mb-2 mb-md-0 text-center">
                <li><a href="login&signup.html" class="nav-link px-3 text-white">LOGIN</a></li>
              </ul>
            </div>
          </div>
      `;
    // 로그인 시 로그인 회원 정보 출력
  } else if (page === 'login') {
    headerContent = `
      <div class="container" style="max-width: 3000px">
          <div class="d-flex flex-wrap align-items-center justify-content-center">
            <ul class="nav col col-lg-auto me-lg-5 mb-2 mb-md-0 text-center">
              <li><a href="index.html" class="nav-link px-2 text-white">HOME</a></li>
              <li><a id="introbtn" href="introduce.html" class="nav-link px-2 text-white">INTRODUCE</a></li>
            </ul>
            <form class="col-12 col-md-6 d-flex mb-3 mb-lg-0" role="search">
              <input
                type="search"
                onkeypress="onkeyevent(event)"
                id="search-box"
                class="form-control"
                placeholder="Search..."
                aria-label="Search"
              />
            </form>
            <div style="display: flex; justify-content: center; align-items: center; margin-left: 2%">
            <button onclick="tostebtn()" type="button" class="btn" id="liveToastBtn"><i class="bi bi-bell-fill" style="color: white;"></i></button>
            </div>
            <div
              class="col-1 dropdown justify-content-lg-end justify-content-end" style="margin-left: 2%"
            >
              <a
                href="#"
                class="d-block link-body-emphasis text-decoration-none dropdown-toggle"
                data-bs-toggle="dropdown"
                aria-expanded="false"
              >
                <img
                    id="userimg"
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
                <li><a class="dropdown-item" href="mypage.html">내 정보</a></li>
                <li><a class="dropdown-item" href="wishlist.html">위시리스트</a></li>              
                <li><a class="dropdown-item" href="#" onclick="openOwnerApplicationModal()">사장님으로 전환하기</a></li>
                <li><hr class="dropdown-divider" /></li>
                <li><a onclick="logout()" class="dropdown-item">로그아웃</a></li>
              </ul>
            </div>
          </div>
        </div>
      `;
  } else if (page === 'admin') {
    headerContent = `
      <div class="container" style="max-width: 3000px">
          <div class="d-flex flex-wrap align-items-center justify-content-center">
            <ul class="nav col col-lg-auto me-lg-5 mb-2 mb-md-0 text-center">
              <li><a href="index.html" class="nav-link px-2 text-white">HOME</a></li>
              <li><a id="introbtn" href="introduce.html" class="nav-link px-2 text-white">INTRODUCE</a></li>
            </ul>
            <form class="col-12 col-md-6 d-flex mb-3 mb-lg-0" role="search">
              <input
                type="search"
                onclick="onkeyevent(event)"
                id="search-box"
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
                <li><a class="dropdown-item" href="mypage.html">내 정보 & 지점</a></li>
                <li><a class="dropdown-item" href="wishlist.html">위시리스트</a></li>              
                <li><hr class="dropdown-divider" /></li>
                <li><a onclick="logout()" class="dropdown-item">로그아웃</a></li>
              </ul>
            </div>
          </div>
        </div>
      `;
  } else if (page === 'siteadmin') {
    headerContent = `
      <div class="container" style="max-width: 3000px">
          <div class="d-flex flex-wrap align-items-center justify-content-center">
            <ul class="nav col col-lg-auto me-lg-5 mb-2 mb-md-0 text-center">
              <li><a href="index.html" class="nav-link px-2 text-white">HOME</a></li>
              <li><a id="introbtn" href="introduce.html" class="nav-link px-2 text-white">INTRODUCE</a></li>
            </ul>
            <form class="col-12 col-md-6 d-flex mb-3 mb-lg-0" role="search">
              <input
                type="search"
                onclick="onkeyevent(event)"
                id="search-box"
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
                <li><a class="dropdown-item" href="mypage.html">내 정보</a></li>
                <li><a class="dropdown-item" href="wishlist.html">위시리스트</a></li>              
                <li><a class="dropdown-item" href="adminsite.html" onclick="">Admin Site</a></li>
                <li><hr class="dropdown-divider" /></li>
                <li><a onclick="logout()" class="dropdown-item">로그아웃</a></li>
              </ul>
            </div>
          </div>
        </div>
      `;
  }
  header.innerHTML = headerContent;
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
async function tostebtn() {
  const toastTrigger = document.getElementById('liveToastBtn');
  const toastLiveExample = document.getElementById('liveToast');

  if (toastTrigger) {
    const toastBootstrap =
      await bootstrap.Toast.getOrCreateInstance(toastLiveExample);
    toastTrigger.addEventListener('click', () => {
      toastBootstrap.show();
    });
  }
}
