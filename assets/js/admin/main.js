const cookieaccess = getCookie('accessToken');
const cookierefresh = getCookie('refreshToken');

if (cookieaccess && cookierefresh) {
  localStorage.setItem('accessToken', cookieaccess);
  localStorage.setItem('refreshToken', cookierefresh);
}

const token = localStorage.getItem('accessToken');

// if (!token) {
//   alert('관리자로 로그인 해주세요');
// } else if (token) {
//   axios
//     .get('/user/me', {
//       headers: {
//         Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
//       },
//     })
//     .then(function (response) {
//       const adminname = document.getElementById('adminName');
//       const adminimg = document.getElementById('adminimg');
//       console.log(response.data);
//       const user = response.data;
//       if (user.role === 2) {
//         alert('관라지가 접속했습니다.');
//         adminname.innerHTML = `<a>${user.nickname}</a>`;
//         adminimg.src = user.photo;
//       } else {
//         alert('관리자가 아닙니다. 확인해주세요!');
//         window.location.href = 'index.html';
//       }
//     })
//     .catch(function (error) {
//       console.log(error);
//     });
// }

//쿠키값을 로컬스토리지로 변경해주는 함수
// eslint-disable-next-line @typescript-eslint/no-unused-vars
function getCookie(name) {
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) return parts.pop().split(';').shift();
}
