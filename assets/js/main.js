const introducebox = document.getElementById('introduceContain');
const iconreview = document.getElementById('reviewicon');
window.onload = function () {
  const cookieaccess = getCookie('accessToken');
  const cookierefresh = getCookie('refreshToken');

  if (cookieaccess && cookierefresh) {
    localStorage.setItem('accessToken', cookieaccess);
    localStorage.setItem('refreshToken', cookierefresh);
  }

  const token = localStorage.getItem('accessToken');

  if (!token) {
    loadHeader('home'); // load the home page by default
    searchfade();
    introducefade();
    reviewfade();
  } else {
    loadHeader('login');
    searchfade();
    introducefade();
  }

  mainBookcard();
};

// 검색 결과창 메인 화면에서 실행하지 않으면 안보이도록 작업
async function searchfade() {
  const searchbox = document.getElementById('searchbox');
  const search = await document.getElementById('search-box').value;

  if (search === '') {
    searchbox.style.display = 'none';
  }
}

async function introducefade() {
  introducebox.style.display = 'none';
}

function reviewfade() {
  iconreview.style.display = 'none';
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
function showintroduce() {
  const introducebox = document.getElementById('introduceContain');
  maincard.style.display = 'none';
  genreform.style.display = 'none';
  storecontain.style.display = 'none';
  introducebox.style.display = 'block';
}
