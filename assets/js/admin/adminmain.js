// const userinfo = document.getElementById('userlist');
userlist();
ownerlist();

function userlist() {
  axios
    .get('user/userinfo')
    .then(function (response) {
      const user = response.data;
    })
    .catch(function (error) {
      console.log(error);
    });
}

function ownerlist() {
  axios
    .get('user/ownerinfo')
    .then(function (response) {
      console.log(response.data);
    })
    .catch(function (error) {
      console.log(error);
    });
}
