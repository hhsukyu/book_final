// eslint-disable-next-line @typescript-eslint/no-unused-vars
function reviewinfo(storeid) {
  axios
    .get(`/reviews/${storeid}`)
    .then(function (response) {
      //   console.log(response);
      const reviews = response.data;

      reviews.forEach((review) => {
        reviewlist(review, storeid);
      });
    })
    .catch(function (error) {
      console.log(error);
    });
}

//리뷰 부분 ui 보여주기
const reviews = document.getElementById('ownerreviewlist');

async function reviewlist(review, storeid) {
  // console.log(review.id);
  const usernameResult = await username(review.user_id);

  const adminReviews = await adminreviewslist(review.id, storeid);

  reviews.innerHTML += `
      <div class="bookboard">
        <button id="adminreviewbtn" class="btn" onclick="openowner(${review.id}, ${storeid})" data-bs-target="#addownerreviewmodal" data-bs-toggle="modal">답글달기</button>
        <div class="author">${usernameResult}</div>
        <div class="content">${review.content}</div>
        <!-- 별 부분 -->  
        <div id="review-box" class="review-box">
            ${reviewstar(review.rating)}
        </div>
        <div id="ownerresult" class="bookboard">
        ${adminReviews}
        </div>
      </div>
    `;

  async function adminreviewslist(reviewid, storeid) {
    try {
      const response = await axios.get(
        `reviews/${storeid}/${reviewid}/adminReview`,
      );
      // console.log(response);
      const reviews = response.data;

      let result = '';
      reviews.forEach((review) => {
        console.log(review.content);
        result += `<a>${review.content} <button data-bs-target="#updateownerreviewmodal" data-bs-toggle="modal" onclick="updatecommentinfo(${review.id}, ${storeid})" class="btn">수정</button></a>`;
      });
      return result;
    } catch (error) {
      console.log(error);
    }
  }

  function reviewstar(rating) {
    let stars = '';
    for (let i = 1; i <= rating; i++) {
      stars += '<i class="fa fa-star"></i>';
    }
    return stars;
  }
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

let admincontentstoreid;
let admincontentreviewid;
let adminreviewid;
//사장님 댓글 나기는 부분
// eslint-disable-next-line @typescript-eslint/no-unused-vars
function openowner(reviewid, storeid) {
  admincontentstoreid = storeid;
  admincontentreviewid = reviewid;
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
function submitadminreview(event) {
  event.preventDefault();
  const admincontent = document.getElementById('ownerreview').value;
  // console.log(admincontentreviewid, admincontentstoreid);
  axios
    .post(
      `reviews/${admincontentstoreid}/${admincontentreviewid}/adminReview`,
      { content: admincontent },
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
        },
      },
    )
    .then(function () {
      alert('사장님 댓글 등록 완료');
    })
    .catch(function (error) {
      console.log(error);
    });
}
const admincontent = document.getElementById('upownerreview');

// eslint-disable-next-line @typescript-eslint/no-unused-vars
function updateadminreview(event) {
  event.preventDefault();
  // console.log(adminreviewid, admincontentstoreid, admincontentreviewid);
  const result = admincontent.value;
  axios
    .put(
      `reviews/${admincontentstoreid}/${admincontentreviewid}/adminReview/${adminreviewid}`,
      { content: result },
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
        },
      },
    )
    .then(function () {
      alert('사장님 댓글 수정완료');
      reviewinfo(admincontentstoreid);
    })
    .catch(function (error) {
      console.log(error);
    });
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
function updatecommentinfo(reviewid, storeid) {
  // console.log(reviewid, storeid);
  axios
    .get(`reviews/${storeid}/${reviewid}/adminReview`)
    .then(function (response) {
      const adminreviewcontent = response.data[0];
      // console.log(adminreviewcontent);
      adminreviewid = adminreviewcontent.id;
      admincontentstoreid = storeid;
      admincontentreviewid = reviewid;
      admincontent.value = adminreviewcontent.content;
    })
    .catch(function (error) {
      console.log(error);
    });
}
