const header = document.getElementById('header');
const body = document.getElementById('card-list');
// eslint-disable-next-line @typescript-eslint/no-unused-vars
const maincard = document.getElementById('maincard');
// eslint-disable-next-line @typescript-eslint/no-unused-vars
const searchbox = document.getElementById('searchbox');
// eslint-disable-next-line @typescript-eslint/no-unused-vars
const genreform = document.getElementById('genre');
// eslint-disable-next-line @typescript-eslint/no-unused-vars
const storecontain = document.getElementById('stores');
// eslint-disable-next-line @typescript-eslint/no-unused-vars
const genrecontain = document.getElementById('genrebox');
let reviewbookid;

//쿠키값을 로컬스토리지로 변경해주는 함수
// eslint-disable-next-line @typescript-eslint/no-unused-vars
function getCookie(name) {
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) return parts.pop().split(';').shift();
}

//메인 추천도서 카드 부분
// eslint-disable-next-line @typescript-eslint/no-unused-vars
function mainBookcard() {
  mainCardSlide();
  axios
    .get('/books/main')
    .then(function (response) {
      const books = response.data;
      books.forEach((book) => {
        // console.log(book);
        body.innerHTML += `
        <div onclick="carddetail(${book.id})" class="swiper-slide card">
        <div class="card-content">
          <div class="image">
            <img
              src="${book.book_image}"
              alt=""
            />
          </div>

          <div id="profession" class="name-profession">
            <span class="name">${book.title}</span>
            <span class="profession">${book.genre}</span>
          </div> 
        </div>
      </div>`;
      });
    })
    .catch(function (error) {
      console.log(error);
    });
}

//슬라이드 스크립트 부분
function mainCardSlide() {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  var swiper = new Swiper('.mySwiper', {
    slidesPerView: 5,
    spaceBetween: 30,
    slidesPerGroup: 5,
    loop: true,
    loopFillGroupWithBlank: true,
    pagination: {
      el: '.swiper-pagination',
      clickable: true,
    },
    navigation: {
      nextEl: '.swiper-button-next',
      prevEl: '.swiper-button-prev',
    },
  });
}

//검색창 선택시 검색 페이지로 이동
// eslint-disable-next-line @typescript-eslint/no-unused-vars
function onkeyevent(event) {
  window.location.href = 'search.html';
}

//로그아웃
// eslint-disable-next-line @typescript-eslint/no-unused-vars
function logout() {
  localStorage.removeItem('accessToken');
  localStorage.removeItem('refreshToken');

  document.cookie =
    'accessToken=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
  document.cookie =
    'refreshToken=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';

  window.location.href = 'index.html';
}

//책 자세히보기
// eslint-disable-next-line @typescript-eslint/no-unused-vars
function carddetail(bookid) {
  const booklabel = document.getElementById('bookmodallabel');
  const bodytitle = document.getElementById('modalcardtitle');
  const bodydesc = document.getElementById('modalcarddesc');
  const bodywr = document.getElementById('modalcardwr');
  const bodyil = document.getElementById('modalcardil');
  const bookcardimage = document.getElementById('bookcardImage');
  const bookpublisher = document.getElementById('modalcardpublisher');
  const bookpudate = document.getElementById('modalcardpudate');
  const bookgenre = document.getElementById('modalcardgenre');
  //연재확인
  const fnishYn = document.getElementById('modalcardYn');
  const addreview = document.getElementById('reviewadd');

  addreview.style.display = 'none';

  reviewbookid = bookid;
  $('#bookModal').modal('show');
  axios
    .get('/books/' + bookid)
    .then(function (response) {
      console.log(response.data);
      bookreivew(bookid);
      const book = response.data;

      booklabel.innerHTML = book.title;
      bodytitle.innerHTML = book.title;
      bodytitle.setAttribute('data-book-id', book.id);
      bodydesc.innerHTML = book.book_desc;
      bodywr.innerHTML = book.writer;
      bodyil.innerHTML = book.illustrator;
      bookcardimage.src = book.book_image;
      bookpublisher.innerHTML = book.publisher;
      bookpudate.innerHTML = book.publication_date;
      bookgenre.innerHTML = book.genre;

      if (book.fnshYn === 'N') {
        fnishYn.innerHTML = '연재중';
      } else {
        fnishYn.innerHTML = '완결';
      }
    })
    .catch(function (error) {
      console.log(error);
    });
}

function bookreivew(bookid) {
  axios
    .get('/bookreview/' + bookid, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
      },
    })
    .then(function (response) {
      const reviewbox1 = document.getElementById('reviewlist');
      reviewcard.style.display = 'block';
      reviewbox1.innerHTML = '';
      const comments = response.data;
      console.log(comments);

      comments.forEach((comment) => {
        reviewbox1.innerHTML += `
        <div class="box-top">
      <!-- profile-box -->
      <div class="profile-box">
        <!-- user-image -->
        <div class="profile-img">
          <img id="reviewimage" src="${comment.user.photo}" />
        </div>
        <!-- username-Name -->
        <div class="name-user">
          <strong id="reviewname">${comment.user.nickname}</strong>
        </div>
      </div>

      <!-- review box -->
      <div id="review-box" class="review-box">
        ${reviewstar(comment.rating)}
        <!-- 별 부분 -->  
      </div>
    </div>

    <!-- comment part -->
    <div class="client-comment">
      <p id="reviewcomment">
        ${comment.content}
      </p>
    </div>
    `;
      });
      function reviewstar(rating) {
        let stars = '';
        for (let i = 1; i <= rating; i++) {
          stars += '<i class="fa fa-star"></i>';
        }
        return stars;
      }
    })
    .catch(function (error) {
      console.log(error);
    });
}

//책 리뷰 등록 버튼 클릭 이벤트

// eslint-disable-next-line @typescript-eslint/no-unused-vars
let submitreview;

const reviewcard = document.getElementById('reviewlist');
const addreview = document.getElementById('reviewadd');

// eslint-disable-next-line @typescript-eslint/no-unused-vars
async function addreviewbtn() {
  const commentTextarea = document.getElementById('comment');
  const starInputs = document.querySelectorAll('input[name="rate"]');
  //리뷰 등록 부분 초기화
  commentTextarea.value = '';
  let selectedStarValue = null;
  // 책 리뷰 부분 숨김
  reviewcard.style.display = 'none';
  addreview.style.display = 'block';
  console.log(reviewbookid);
  // 전송 처리 함수

  function handleSubmit(event) {
    event.preventDefault();
    // 선택된 별점 값 가져오기

    starInputs.forEach((input) => {
      if (input.checked) {
        selectedStarValue = input.id.split('-')[1];
      }
    });
    // 작성된 댓글 가져오기

    const comment = commentTextarea.value;

    // console.log(comment, selectedStarValue);

    // 서버로 데이터 전송
    sendFeedback(selectedStarValue, comment);
  }

  // 리뷰 데이터 저장
  function sendFeedback(starValue, comment) {
    console.log(starValue, comment);

    axios
      .post(
        '/bookreview/' + reviewbookid,
        {
          rating: starValue,
          content: comment,
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
          },
        },
      )
      .then(function (response) {
        alert('댓글 등록');
        // reviewcard.style.display = 'block';
        addreview.style.display = 'none';
        commentTextarea.value = '';
        starValue = null;
        bookreivew(reviewbookid);
      })
      .catch(function (error) {
        alert(error);
      });
  }

  // 이벤트 핸들러 등록
  const submitBtn = document.getElementById('submitBtn');
  submitBtn.addEventListener('click', handleSubmit);

  // submitreview 변수에 handleSubmit 함수 할당
  submitreview = handleSubmit;
}
