//---------------지점자세히 보기---------------------------//

// eslint-disable-next-line @typescript-eslint/no-unused-vars
function storecarddetail(storeid) {
  const storelabel = document.getElementById('storemodallabel');
  const bodyname = document.getElementById('modalcardStorename');
  const bodystoredesc = document.getElementById('modalcardStoredesc');
  const bodyad = document.getElementById('modalcardStoreAd');
  const bodyopen = document.getElementById('modalcardStoreOp');
  const bodyclose = document.getElementById('modalcardStoreCl');
  const storecardimage = document.getElementById('storecardImage');

  addStoreReview.style.display = 'none';

  reviewstoreid = storeid;
  $('#storeModal').modal('show');
  axios
    .get('/store/' + storeid)
    .then(function (response) {
      // console.log('response.data', response.data);
      storereview(storeid);
      menuinfo(storeid);
      bookinfo(storeid);
      const store = response.data[0];
      // console.log('store', store);

      storelabel.innerHTML = store.store_name;
      bodyname.innerHTML = store.store_name;
      bodyname.setAttribute('data-store-id', store.id);
      // console.log('data-store-id', store.id);
      bodystoredesc.innerHTML = store.store_desc;
      bodyad.innerHTML = store.store_address;
      bodyopen.innerHTML = store.store_open;
      storecardimage.src = store.store_img;
      bodyclose.innerHTML = store.store_close;

      // 매장이 사용자의 Like Store 목록에 있는지 확인
      const isLiked = userLikeStores.includes(store.id.toString());
      const likeStoreButton = document.getElementById('addToLikestoreButton');
      const heartIcon = likeStoreButton.querySelector('.fa');

      if (isLiked) {
        heartIcon.classList.remove('fa-heart-o');
        heartIcon.classList.add('fa-heart');
        heartIcon.style.color = 'red';
      } else {
        heartIcon.classList.remove('fa-heart');
        heartIcon.classList.add('fa-heart-o');
        heartIcon.style.color = 'black';
      }
    })
    .catch(function (error) {
      console.log(error);
    });
}

const storereviewbox1 = document.getElementById('storereviewcardbox');
function storereview(storeid) {
  axios
    .get('/reviews/' + storeid, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
      },
    })
    .then(function (response) {
      storeReviewcard.style.display = 'block';
      storereviewbox1.innerHTML = '';
      const comments = response.data;
      // console.log('comments', comments);
      comments.forEach((comment) => {
        storereviewlist(comment);
      });
    })
    .catch(function (error) {
      console.log(error);
    });
}

//리뷰 부분 유저 이름 확인
async function username(userid) {
  try {
    const response = await axios.get(`/user/mypage/${userid}`);
    const user = response.data;
    let result = `
          <a>${user.nickname}</a>
        `;
    return result;
  } catch (error) {
    console.log(error);
  }
}

// 지점 리뷰 등록 버튼 클릭 이벤트

async function storereviewlist(comment) {
  const usernameResult = await username(comment.user_id);

  // 리뷰에 대한 답글 조회
  const adminReviews = await findAdminReviewsByReview(
    reviewstoreid,
    comment.id,
  );
  // console.log('adminReviews', adminReviews);
  storereviewbox1.innerHTML += `
    <div class="box-top">
  <!-- profile-box -->
  <div class="profile-box">
    <!-- user-image -->
    
    <!-- username-Name -->
    <div class="name-user">
      <strong id="reviewname">${usernameResult}</strong>
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
  <h6 id="reviewcomment">
    ${comment.content}
  </h6>
  </div>
  <!-- 리뷰에 대한 답글 표시 -->
      ${adminReviews
        .map(
          (adminReview) => `
        <div class="admin-review bookboard">
        <p class="admin-comment-heading"><strong>사장님의 댓글:</strong></p>
          <p>${adminReview.content}</p>
        </div>
      `,
        )
        .join('')}
  `;
  function reviewstar(rating) {
    let stars = '';
    for (let i = 1; i <= rating; i++) {
      stars += '<i class="fa fa-star"></i>';
    }
    return stars;
  }
}
// eslint-disable-next-line @typescript-eslint/no-unused-vars
let submitstorereview;

const storeReviewcard = document.getElementById('storereviewlist');
const addStoreReview = document.getElementById('addStoreReview');

//리뷰등록
// eslint-disable-next-line @typescript-eslint/no-unused-vars
async function addstorereviewbtn() {
  const commentTextarea = document.getElementById('storecomment');
  const starInputs = document.querySelectorAll('input[name="rate"]');
  //리뷰 등록 부분 초기화
  commentTextarea.value = '';
  let selectedStarValue = null;
  // 책 리뷰 부분 숨김
  storeReviewcard.style.display = 'none';
  addStoreReview.style.display = 'block';
  // console.log('reviewstoreid', reviewstoreid);
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
    sendStoreFeedback(selectedStarValue, comment);
  }

  // 지점리뷰 데이터 저장
  function sendStoreFeedback(starValue, comment) {
    // console.log('starValue', starValue, 'comment', comment);

    axios
      .post(
        '/reviews/' + reviewstoreid,
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
        addStoreReview.style.display = 'none';
        commentTextarea.value = '';
        starValue = null;
        storereview(reviewstoreid);
      })
      .catch(function (error) {
        alert(error);
      });
  }

  // 이벤트 핸들러 등록
  const submitStoreReviewBtn = document.getElementById('submitStoreReviewBtn');
  submitStoreReviewBtn.addEventListener('click', handleSubmit);

  // submitstorereview 변수에 handleSubmit 함수 할당
  submitstorereview = handleSubmit;
}

// 영수증 리뷰 등록
// eslint-disable-next-line @typescript-eslint/no-unused-vars
function addreceiptreview(event) {
  event.preventDefault();
  // 영수증 이미지
  const receiptImg = document.getElementById('receiptimg');
  const receiptImgFile = receiptImg.files[0];

  // 영수증 댓글
  const receiptCommentTextarea = document.getElementById(
    'receipt-storecomment',
  );
  const receiptComment = receiptCommentTextarea.value;
  // 영수증 별점
  const receiptStarInputs = document.querySelectorAll(
    'input[name="receipt-rate"]',
  );
  receiptStarInputs.forEach((input) => {
    if (input.checked) {
      selectedReceiptStarValue = input.id.split('-')[1];
    }
  });

  // console.log(receiptImgFile, receiptComment, selectedReceiptStarValue);
  const formData = new FormData();

  formData.append('file', receiptImgFile);
  formData.append('content', receiptComment);
  formData.append('rating', selectedReceiptStarValue);

  // 영수증에 데이터 저장
  axios
    .post(`receipts/review/` + reviewstoreid, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
        Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
      },
    })
    .then(function () {
      alert(
        '등록이 성공했습니다.관리자의 검토 후 영수증 인증여부가 표시됩니다.',
      );
      window.location.reload();
      //리뷰 등록 부분 초기화
      receiptCommentTextarea.value = '';
      selectedReceiptStarValue = null;
    })
    .catch(function (error) {
      alert(error.response['data'].message);
    });
}

// 특정 리뷰에 대한 사장님리뷰 답글 조회
function findAdminReviewsByReview(storeid, storeReviewid) {
  return axios
    .get(`/reviews/${storeid}/${storeReviewid}/adminReview`)
    .then((response) => {
      const adminReviews = response.data;
      // console.log('adminReviews', adminReviews);

      return adminReviews;
    })
    .catch((error) => {
      console.error('Error fetching Admin Reviews:', error);

      throw error;
    });
}

//도서
//
const storebookinfo = document.getElementById('storebooklist');

let userbookstoreid;
//지점소장도서 정보
function bookinfo(storeid) {
  storebookinfo.innerHTML = '';
  axios
    .get(`storebook/${storeid}`)
    .then(function (response) {
      //   console.log(response.data);
      const books = response.data;

      books.forEach((book) => {
        // console.log(book);
        booklist(book);
      });
      userbookstoreid = storeid;
    })
    .catch(function (error) {
      console.log(error);
    });
}

// 키 입력 이벤트 발생 함수
// eslint-disable-next-line @typescript-eslint/no-unused-vars
async function keyupEvent(event) {
  const search = await document.getElementById('searchbox').value;

  if (event.key === 'Enter') {
    event.preventDefault();

    if (search === '') {
      // 검색어가 없을 때의 처리
      storebookinfo.innerHTML = '<p>검색 결과가 없습니다.</p>';
    } else {
      // 서버에 검색 요청 보내기
      axios
        .get(`books/searchStoreBook?storeId=1&bookTitle=${search}`)
        .then((response) => {
          // 서버로부터 받은 도서 목록을 표시
          // console.log('response.data', response.data);
          const books = response.data.data;

          if (books.length === 0) {
            // 검색 결과가 없을 때의 처리
            storebookinfo.innerHTML = '<p>검색 결과가 없습니다.</p>';
          } else {
            // 검색 결과가 있을 때의 처리
            showSearchingBooks(books);
          }
        })
        .catch((error) => {
          console.error('API 요청 중 에러 발생:', error);
        });
    }
  }
}

//소장도서 검색
// eslint-disable-next-line @typescript-eslint/no-unused-vars
async function mainkeyup(event) {
  const search = await document.getElementById('searchbox').value;
  if (search === '') {
    event.preventDefault(); // 백스페이스 키이고 검색어가 없는 경우
    // const bookCard = document.getElementById('bookListContainer');
    storebookinfo.innerHTML = '';
    bookinfo(userbookstoreid);
  }
}

// 검색도서를 표시하는 함수
function showSearchingBooks(books) {
  // console.log('books', books);
  // 도서 목록 초기화
  storebookinfo.innerHTML = '';

  // 각 도서를 도서 목록에 추가
  books.forEach((book) => {
    storebookinfo.innerHTML += `
      <div class="col"> 
            <div class="card">
            <img src="${book.book_image}" alt="" />
            <div class="card-body">
              <h5 class="card-title">${book.title}</h5>
            </div>
          </div>
        </div>
    `;
  });
}

//도서 상세정보
function booklist(book) {
  const bookinfo = book.book;
  // console.log(book);
  // console.log('bookinfo', bookinfo);
  storebookinfo.innerHTML += `
    <div id="booklistcard" class="card mb-3" >
      <div class="row g-0">
        <div class="col-md-4">
          <img src="${bookinfo.book_image}" class="img-fluid rounded-start" alt="...">
        </div>
        <div class="col-md-8">
          <div class="card-body">
          <div>
            <h5 class="card-title">${bookinfo.title}</h5>
          </div>  
            <p class="card-text">${bookinfo.writer}</p>
            <div id="menucardbtn">
            <p class="card-text"><small class="text-body-secondary">${bookinfo.publisher}</small></p>
            </div>  
            </div>
        </div>
      </div>
    </div>
    `;
}

//메뉴
//
//메뉴 불러오기
// eslint-disable-next-line @typescript-eslint/no-unused-vars
function menuinfo(storeid) {
  storemenuinfo.innerHTML = '';
  // console.log(storeid);
  axios
    .get('/menu/storeid/' + storeid)
    .then(function (response) {
      //   console.log(response.data);
      const menus = response.data;

      menus.forEach((menu) => {
        // console.log(menu);
        menulists(menu);
      });
    })
    .catch(function (error) {
      console.log(error);
    });
}

const storemenuinfo = document.getElementById('storemenulist');
//메뉴 화면에 출력
function menulists(menu) {
  let img = `${menu.food_img}`;

  if (menu.food_img === '') {
    img =
      'https://kowpic.cafe24.com/wp-content/plugins/mangboard/includes/mb-file.php?path=2019%2F12%2F05%2FF7_1196096794_test.png';
  }

  storemenuinfo.innerHTML += `
    <div id="menulistcard" class="card mb-3" >
      <div class="row g-0">
        <div class="col-md-4">
          <img src="${img}" class="img-fluid rounded-start" alt="...">
        </div>
        <div class="col-md-8">
          <div class="card-body">
            <h5 class="card-title">${menu.food_name}</h5>
            <p class="card-text">${menu.food_desc}</p>
            <div id="menucardbtn">
            <p class="card-text"><small class="text-body-secondary">${menu.food_price}</small></p>
            </div>  
            </div>
        </div>
      </div>
    </div>`;
}

loadUserLikeStores();
