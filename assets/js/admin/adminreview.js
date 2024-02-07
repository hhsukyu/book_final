const review = document.getElementById('reviewcontain');

function reviewinfo() {
  axios
    .get()
    .then(function (response) {
      console.log(response);

      // 드롭 박스로 선택해서 onclick 함수가 실행되도록 작성
    })
    .catch(function (error) {
      console.log(error);
    });
}

function reviewview() {
  axios
    .post()
    .then(function (response) {
      console.log(response);
    })
    .catch(function (error) {
      console.log(error);
    });
}
