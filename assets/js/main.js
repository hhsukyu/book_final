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
  } else {
    loadHeader('login');
  }

  mainBookcard();
};
