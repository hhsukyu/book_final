async function loginForm(event) {
  event.preventDefault();

  const email = document.getElementById('email').value;
  const password = document.getElementById('password').value;

  axios
    .post('/auth/login', {
      email: email,
      password: password,
    })
    .then(function (response) {
      localStorage.setItem('accessToken', response.data.accessToken);
      localStorage.setItem('refreshToken', response.data.refreshToken);
      console.log(response);

      window.location.href = 'index.html';
      loadHeader('login');
    })
    .catch(function (error) {
      console.log(error.request.response);
      alert(error.request.response);
    });
}
