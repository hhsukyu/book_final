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
function userme() {
  const storetab = document.getElementById('storetab');
  const userimage = document.getElementById('formFile');
  const useraddress = document.getElementById('addressSearch');

  axios
    .get('/mypage', {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
      },
    })
    .then(function (response) {
      console.log(response.data);
      user = response.data;

      if (user.role === 0) {
        storetab.style.display = 'none';
      }

      userimage.defaultValue = user.photo;
      useraddress.value = user.address;
    })
    .catch(function (error) {
      console.log(error);
    });
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
function searchAddress() {
  new daum.Postcode({
    oncomplete: function (data) {
      document.getElementById('addressSearch').value = data.roadAddress;
    },
  }).open();
}
