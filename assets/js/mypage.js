window.onload = function () {
  const token = localStorage.getItem('accessToken');

  if (!token) {
    loadHeader('home'); // load the home page by default
  } else {
    loadHeader('login');
  }

  userme();
};

// eslint-disable-next-line @typescript-eslint/no-unused-vars
function changeTitle(selectedItem) {
  // 선택된 항목의 내용으로 드롭다운 토글 제목을 변경
  document.getElementById('dropdownToggleTitle').innerHTML = selectedItem;
  if (selectedItem === '지점 정보') {
    document.querySelector('.store-container').style.display = 'block';
    document.querySelector('.menu-container').style.display = 'none';
    document.querySelector('.booklist-container').style.display = 'none';
    document.querySelector('#post-book').style.display = 'none';
  }
  if (selectedItem === '메뉴 정보') {
    document.querySelector('.store-container').style.display = 'none';
    document.querySelector('.menu-container').style.display = 'block';
    document.querySelector('.booklist-container').style.display = 'none';
    document.querySelector('#post-book').style.display = 'none';
  }
  if (selectedItem === '보유 책 정보') {
    document.querySelector('.store-container').style.display = 'none';
    document.querySelector('.menu-container').style.display = 'none';
    document.querySelector('.booklist-container').style.display = 'block';
    document.querySelector('#post-book').style.display = 'block';
  }
}

function startstorefade() {
  const menulist = document.getElementById('storemenulist');
  const booklist = document.getElementById('storebooklist');

  menulist.style.display = 'none';
  booklist.style.display = 'none';
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
function userme() {
  const storetab = document.getElementById('storetab');

  const userimage = document.getElementById('formFile');
  const useraddress = document.getElementById('addressSearch');

  axios
    .get('/user/me', {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
      },
    })
    .then(function (response) {
      console.log(response);
      user = response.data;

      if (user.role === 0) {
        storetab.style.display = 'none';
      } else if (user.role === 1) {
      }

      if (user.mypage == null) {
        console.log('test');
      } else {
        userimage.defaultValue = user.photo;
        useraddress.value = user.address;
      }
    })
    .catch(function (error) {
      console.log(error);
    });
}

//마이페이지 수정 및 저장
function myprofilebtn() {}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
function searchAddress() {
  new daum.Postcode({
    oncomplete: function (data) {
      document.getElementById('addressSearch').value = data.roadAddress;
    },
  }).open();
}
