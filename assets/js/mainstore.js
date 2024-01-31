// 매장 정보를 가져와서 표시하는 함수
function loadStores() {
  console.log('로드 스토어 실행됨!!!!!!!!!!!!');
  const storeContainer = document.querySelector('.album-store');
  storeContainer.innerHTML = ''; // 기존 내용을 비웁니다.
  axios
    .get('/store')
    .then(function (response) {
      const stores = response.data;
      stores.forEach((store) => {
        const storeElement = `
          <div class="album-item">
            <img src="${store.store_img || '기본 이미지 경로'}" alt="${store.store_name}" />
            <div class="album-details">
              <span class="album-title">${store.store_name}</span>
              <span class="album-intro">${store.store_desc}</span>
              <span class="album-location">${store.store_address}</span>
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
// function carddetail(bookid) {
//   const storelabel = document.getElementById('storemodallabel');
//   const bodytitle = document.getElementById('modalcardStoretitle');
//   const bodydesc = document.getElementById('modalcardStoredesc');
//   const bodyad = document.getElementById('modalcardStoreAd');
//   const bodyop = document.getElementById('modalcardStoreOp');
//   const bodycl = document.getElementById('modalcardStoreCl');

//   addStoreReview.style.display = 'none';

//   reviewbookid = bookid;
//   $('#storeModal').modal('show');
//   axios
//     .get('/books/' + bookid)
//     .then(function (response) {
//       console.log(response.data);
//       bookreivew(bookid);
//       const book = response.data;

//       booklabel.innerHTML = book.title;
//       bodytitle.innerHTML = book.title;
//       bodydesc.innerHTML = book.book_desc;
//       bodywr.innerHTML = book.writer;
//       bodyil.innerHTML = book.illustrator;
//       bookcardimage.src = book.book_image;
//       bookpublisher.innerHTML = book.publisher;
//       bookpudate.innerHTML = book.publication_date;
//       bookgenre.innerHTML = book.genre;

//       if (book.fnshYn === 'N') {
//         fnishYn.innerHTML = '연재중';
//       } else {
//         fnishYn.innerHTML = '완결';
//       }
//     })
//     .catch(function (error) {
//       console.log(error);
//     });
// }

// function bookreivew(bookid) {
//   axios
//     .get('/bookreview/' + bookid, {
//       headers: {
//         Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
//       },
//     })
//     .then(function (response) {
//       const reviewbox1 = document.getElementById('reviewlist');
//       reviewcard.style.display = 'block';
//       reviewbox1.innerHTML = '';
//       const comments = response.data;
//       console.log(comments);

//       comments.forEach((comment) => {
//         reviewbox1.innerHTML += `
//         <div class="box-top">
//       <!-- profile-box -->
//       <div class="profile-box">
//         <!-- user-image -->
//         <div class="profile-img">
//           <img id="reviewimage" src="${comment.user.photo}" />
//         </div>
//         <!-- username-Name -->
//         <div class="name-user">
//           <strong id="reviewname">${comment.user.nickname}</strong>
//         </div>
//       </div>

//       <!-- review box -->
//       <div id="review-box" class="review-box">
//         ${reviewstar(comment.rating)}
//         <!-- 별 부분 -->
//       </div>
//     </div>

//     <!-- comment part -->
//     <div class="client-comment">
//       <p id="reviewcomment">
//         ${comment.content}
//       </p>
//     </div>
//     `;
//       });
//       function reviewstar(rating) {
//         let stars = '';
//         for (let i = 1; i <= rating; i++) {
//           stars += '<i class="fa fa-star"></i>';
//         }
//         return stars;
//       }
//     })
//     .catch(function (error) {
//       console.log(error);
//     });
// }

// //책 리뷰 등록 버튼 클릭 이벤트

// // eslint-disable-next-line @typescript-eslint/no-unused-vars
// let submitreview;

// const reviewcard = document.getElementById('reviewlist');
// const addStoreReview = document.getElementById('addStoreReview');

// // eslint-disable-next-line @typescript-eslint/no-unused-vars
// async function addreviewbtn() {
//   const commentTextarea = document.getElementById('comment');
//   const starInputs = document.querySelectorAll('input[name="rate"]');
//   //리뷰 등록 부분 초기화
//   commentTextarea.value = '';
//   let selectedStarValue = null;
//   // 책 리뷰 부분 숨김
//   reviewcard.style.display = 'none';
//   addStoreReview.style.display = 'block';
//   console.log(reviewbookid);
//   // 전송 처리 함수

//   function handleSubmit(event) {
//     event.preventDefault();
//     // 선택된 별점 값 가져오기

//     starInputs.forEach((input) => {
//       if (input.checked) {
//         selectedStarValue = input.id.split('-')[1];
//       }
//     });
//     // 작성된 댓글 가져오기

//     const comment = commentTextarea.value;

//     // console.log(comment, selectedStarValue);

//     // 서버로 데이터 전송
//     sendFeedback(selectedStarValue, comment);
//   }

//   // 리뷰 데이터 저장
//   function sendFeedback(starValue, comment) {
//     console.log(starValue, comment);

//     axios
//       .post(
//         '/bookreview/' + reviewbookid,
//         {
//           rating: starValue,
//           content: comment,
//         },
//         {
//           headers: {
//             Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
//           },
//         },
//       )
//       .then(function (response) {
//         alert('댓글 등록');
//         // reviewcard.style.display = 'block';
//         addreview.style.display = 'none';
//         commentTextarea.value = '';
//         starValue = null;
//         bookreivew(reviewbookid);
//       })
//       .catch(function (error) {
//         alert(error);
//       });
//   }

//   // 이벤트 핸들러 등록
//   const submitBtn = document.getElementById('submitBtn');
//   submitBtn.addEventListener('click', handleSubmit);

//   // submitreview 변수에 handleSubmit 함수 할당
//   submitreview = handleSubmit;
// }
