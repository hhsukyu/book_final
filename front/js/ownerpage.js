function changeTitle(selectedItem) {
  // 선택된 항목의 내용으로 드롭다운 토글 제목을 변경
  document.getElementById('dropdownToggleTitle').innerHTML = selectedItem;
  if (selectedItem === '지점 정보') {
    document.querySelector('.store-container').style.display = 'block';
    document.querySelector('.menu-container').style.display = 'none';
    document.querySelector('.booklist-container').style.display = 'none';
    document.querySelector('#post-book').style.display = 'none';
  }
  if (selectedItem === '메뉴 정보') {
    document.querySelector('.store-container').style.display = 'none';
    document.querySelector('.menu-container').style.display = 'block';
    document.querySelector('.booklist-container').style.display = 'none';
    document.querySelector('#post-book').style.display = 'none';
  }
  if (selectedItem === '보유 책 정보') {
    document.querySelector('.store-container').style.display = 'none';
    document.querySelector('.menu-container').style.display = 'none';
    document.querySelector('.booklist-container').style.display = 'block';
    document.querySelector('#post-book').style.display = 'block';
  }
}

function searchAddress() {
  new daum.Postcode({
    oncomplete: function (data) {
      document.getElementById('addressSearch').value = data.roadAddress;
    },
  }).open();
}

function clickModal() {
  $('#menuUpdateModal').modal('show');
}

function deleteMenu() {
  document.querySelector('#menuCard').style.display = 'none';
}
