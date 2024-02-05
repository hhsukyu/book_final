const userinfo = document.getElementById('userlist');
const admininfo = document.getElementById('ownerlist');
userlist();
ownerlist();

function userlist() {
  axios
    .get('user/userinfo')
    .then(function (response) {
      const users = response.data;

      users.forEach((user) => {
        console.log(user);
        userinfo.innerHTML += `
        <ul">
        <li>${user.nickname}</li>
        </ul>
        `;
      });
    })
    .catch(function (error) {
      console.log(error);
    });
}

function ownerlist() {
  axios
    .get('user/ownerinfo')
    .then(function (response) {
      //   console.log(response.data);
      const admins = response.data;

      admins.forEach((admin) => {
        admininfo.innerHTML += `
        <ul">
        <li>${admin.nickname}</li>
        </ul>
        `;
      });
    })
    .catch(function (error) {
      console.log(error);
    });
}
