function genrebtn(genre) {
  maincard.style.display = 'none';
  genreform.style.display = 'none';
  storecontain.style.display = 'none';
  console.log(genre);
  axios
    .get(`/books/genre?bookgenre=${genre}`)
    .then(function (response) {
      console.log(response);
    })
    .catch(function (error) {
      console.log(error);
    });
}

// 장르별 검색결과 화면 출력
function genreui() {}
