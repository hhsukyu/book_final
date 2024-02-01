// 매장 정보를 가져와서 표시하는 함수
function loadStores() {
  console.log('로드 스토어 실행됨!!');
  const storeContainer = document.querySelector('.album-store');
  storeContainer.innerHTML = ''; // 기존 내용을 비웁니다.
  axios
    .get('/store')
    .then(function (response) {
      const stores = response.data;
      stores.forEach((store) => {
        const storeElement = `
          <div class="album-item"onclick="storecarddetail(${store.id})">
            <img src="${store.store_img || '기본 이미지 경로'}" alt="${store.store_name}" />
            <div class="album-details">
              <span class="album-title">${store.store_name}</span>
              <span class="album-intro">${store.store_desc}</span>
              <span class="album-location">${store.store_address}</span>
              <span class="album-open">${store.store_open} ~ ${store.store_close}</span>
            </div>
          </div>
        `;
        storeContainer.innerHTML += storeElement;
      });
    })
    .catch(function (error) {
      console.log(error);
    });
}

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
      console.log('response.data', response.data);
      storereview(storeid);
      const store = response.data[0];
      console.log('store', store);

      storelabel.innerHTML = store.store_name;
      bodyname.innerHTML = store.store_name;
      bodystoredesc.innerHTML = store.store_desc;
      bodyad.innerHTML = store.store_address;
      bodyopen.innerHTML = store.store_open;
      storecardimage.src = store.store_img;
      bodyclose.innerHTML = store.store_close;
    })
    .catch(function (error) {
      console.log(error);
    });
}
const storereviewbox1 = document.getElementById('storereviewlist');
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
      console.log('comments', comments);
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
  console.log('adminReviews', adminReviews);
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
      <div class="admin-review">
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
  console.log('reviewstoreid', reviewstoreid);
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
    console.log('starValue', starValue, 'comment', comment);

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
      .then(function (response) {
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
// 특정 리뷰에 대한 사장님리뷰 답글 조회
function findAdminReviewsByReview(storeid, storeReviewid) {
  return axios
    .get(`/reviews/${storeid}/${storeReviewid}/adminReview`)
    .then((response) => {
      const adminReviews = response.data;
      console.log('adminReviews', adminReviews);

      return adminReviews;
    })
    .catch((error) => {
      console.error('Error fetching Admin Reviews:', error);

      throw error;
    });
}
