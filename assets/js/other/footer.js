// XMLHttpRequest를 사용하여 footer.html 파일을 로드
var xhr = new XMLHttpRequest();
xhr.onreadystatechange = function () {
  if (this.readyState == 4 && this.status == 200) {
    // 로드된 내용을 푸터에 삽입
    document.getElementById('footer-placeholder').innerHTML = this.responseText;
  }
};
xhr.open('GET', 'footer.html', true);
xhr.send();
