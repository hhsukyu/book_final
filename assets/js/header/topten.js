function showTopTen() {
  axios
    .get('http://localhost:3000/books/getTopTenSearchTerms')
    .then((response) => {
      const topTenData = response.data;
      const topTenList = document.getElementById('ticker');
      // 데이터 정렬 (책 이름만 추출하여 정렬)
      const sortedData = topTenData.map((item) => item.split(':')[1]).sort();

      // 정렬된 데이터를 topTenList에 삽입
      topTenList.innerHTML = sortedData
        .map((book, index) => `<li>${index + 1}. ${book}</li>`)
        .join('');

      // 이후 차트 생성 코드 등 추가 작업 수행
    })
    .catch((error) => {
      console.error('Error fetching top ten search terms:', error);
    });
}

// showTopTen 함수 호출
showTopTen();

jQuery(function ($) {
  var ticker = function () {
    timer = setTimeout(function () {
      $('#ticker li:first').animate({ marginTop: '-20px' }, 400, function () {
        $(this).detach().appendTo('ul#ticker').removeAttr('style');
      });
      ticker();
    }, 2000);
  };
  // 0번 이전 기능
  $(document).on('click', '.prev', function () {
    $('#ticker li:last').hide().prependTo($('#ticker')).slideDown();
    clearTimeout(timer);
    ticker();
    if ($('#pause').text() == 'Unpause') {
      $('#pause').text('Pause');
    }
  }); // 0번 기능 끝

  // 1. 클릭하면 다음 요소 보여주기... 클릭할 경우 setTimeout 을 clearTimeout 해줘야 하는데 어떻게 하지..
  $(document).on('click', '.next', function () {
    $('#ticker li:first').animate({ marginTop: '-20px' }, 400, function () {
      $(this).detach().appendTo('ul#ticker').removeAttr('style');
    });
    clearTimeout(timer);
    ticker();
    //3 함수와 연계 시작
    if ($('#pause').text() == 'Unpause') {
      $('#pause').text('Pause');
    } //3 함수와 연계
  }); // next 끝. timer 를 전연변수보다 지역변수 사용하는게 나을 것 같은데 방법을 모르겠네요.

  //2. 재생정지기능 시작, 아직 다음 기능과 연동은 안됨...그래서 3을 만듦
  var autoplay = true;
  $(document).on('click', '.pause', function () {
    if (autoplay == true) {
      clearTimeout(timer);
      $(this).text('재생');
      autoplay = false;
    } else {
      autoplay = true;
      $(this).text('정지');
      ticker();
    }
  }); // 재생정지기능 끝
  // 3. 재생정지 함수 시작. 2와 기능 동일함.
  var tickerpause = function () {
    $('#pause').click(function () {
      $this = $(this);
      if ($this.text() == 'Pause') {
        $this.text('Unpause');
        clearTimeout(timer);
      } else {
        ticker();
        $this.text('Pause');
      }
    });
  };
  tickerpause();
  //3 재생정지 함수 끝
  //4 마우스를 올렸을 때 기능 정지
  var tickerover = function () {
    $('#ticker').mouseover(function () {
      clearTimeout(timer);
    });
    $('#ticker').mouseout(function () {
      ticker();
    });
  };
  tickerover();
  // 4 끝
  ticker();
});
