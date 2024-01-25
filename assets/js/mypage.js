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
  axios
    .get('/user/me', {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
      },
    })
    .then(function (response) {
      console.log(response.data);
    })
    .catch(function (error) {
      console.log(error);
    });
}
