function searchAddress() {
  new daum.Postcode({
    oncomplete: function (data) {
      document.getElementById('addressSearch').value = data.roadAddress;
    },
  }).open();
}
