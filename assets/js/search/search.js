// eslint-disable-next-line @typescript-eslint/no-unused-vars
let allprevPage;
// eslint-disable-next-line @typescript-eslint/no-unused-vars
let allnextPage;
// eslint-disable-next-line @typescript-eslint/no-unused-vars
let allgotoPage;

const query = new URLSearchParams(window.location.search).get('book');

if (query) {
  // query를 사용하여 검색 결과를 가져와서 표시하는 함수 호출
  console.log(query);
  searchresult(query);
}
loadingshow();

setTimeout(function () {
  loadingfade();
}, 3000);

// eslint-disable-next-line @typescript-eslint/no-unused-vars
// async function mainkeyup() {
//   const search = await document.getElementById('search-box').value;
//   const output = document.getElementById('output');
//   const el = document.getElementById('pages');

//   // if (search === '') {
//   //   searchbox.style.display = 'none';
//   //   // 검색 결과 데이터 초기화
//   //   output.innerHTML = '';
//   //   el.innerHTML = '';
//   // }
// }

//메인화면 검색 부분
function searchresult(search) {
  console.log('실행');
  axios
    .get(`/books/search?booktitle=${search}`)
    .then(async function (response) {
      // configuration variables\
      const cards = response.data;
      const pages = numPages(cards);

      //   const itemsPerPage = 16;

      changePage(1); // set default page
      await addPages(); // generate page navigation

      // reference to keep track of current page
      let currentPage = 1;

      function numPages(cardsArray) {
        const itemsPerPage = 16;
        // returns the number of pages
        return Math.ceil(cardsArray.length / itemsPerPage);
      }

      function createCardElement(card) {
        let img = card.book_image;
        let defaultImg =
          'http://kowpic.cafe24.com/wp-content/plugins/mangboard/includes/mb-file.php?path=2019%2F12%2F05%2FF7_1196096794_test.png';

        let searchhtml = `
          <div onclick="carddetail(${card.id})" class="col-3 mb-3">
            <div class="col">
              <div class="card">
                <img src="${img}" class="card-img-top" onerror="this.src='${defaultImg}'" alt="...">
                <div class="card-body">
                  <h5 class="card-title">${card.title}</h5>
                </div>
              </div>
            </div>
          </div>
        `;

        return searchhtml;
      }

      function changePage(page) {
        const output = document.getElementById('output');
        output.innerHTML = '';
        const itemsPerPage = 16;

        if (page < 1) page = 1;
        if (page > pages) page = pages;
        output.innerHTML = '';

        for (
          let i = (page - 1) * itemsPerPage;
          i < page * itemsPerPage && i < cards.length;
          i++
        ) {
          // 검색 정보 배열로 저장

          const card = cards[i];
          output.innerHTML += createCardElement(card);
        }
      }

      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      async function addPages() {
        const el = document.getElementById('pages');
        el.innerHTML = '';
        for (let i = 1; i < pages + 1; i++) {
          el.innerHTML += `<li><a onclick="allgotoPage(${i})">${i}</a></li>`;
        }
      }

      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      async function nextPage() {
        if (currentPage < pages) changePage(++currentPage);
      }
      allnextPage = nextPage;

      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      async function prevPage() {
        if (currentPage > 1) changePage(--currentPage);
      }
      allprevPage = prevPage;

      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      async function gotoPage(page) {
        currentPage = page;
        changePage(page);
      }
      allgotoPage = gotoPage;
    })
    .catch(function (error) {
      console.log(error);
    });
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
      reviewcard2.style.display = 'block';
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

// eslint-disable-next-line @typescript-eslint/no-unused-vars
async function addreviewbtn() {
  const commentTextarea = document.getElementById('comment');
  const starInputs = document.querySelectorAll('input[name="rate"]');
  //리뷰 등록 부분 초기화
  commentTextarea.value = '';
  let selectedStarValue = null;
  // 책 리뷰 부분 숨김
  reviewcard2.style.display = 'none';
  addreview2.style.display = 'block';
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
      .then(function () {
        alert('댓글 등록');
        // reviewcard.style.display = 'block';
        addreview2.style.display = 'none';
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
