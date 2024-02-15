const giftbox = document.getElementById('giftlistbox');

IMP.init('imp61713201');

giftlist();

function giftlist() {
  axios
    .get('/gift')
    .then(function (response) {
      console.log(response.data);
      const giftlist = response.data;

      giftlist.forEach((gift) => {
        console.log(gift.gift_name);
        giftbox.innerHTML += `
        <div class="giftitem bookboard text-bg-dark">
          <!-- <img src="..." class="card-img" alt="..." /> -->
          <div>
            <h5 class="card-title">${gift.gift_name}</h5>
            <p class="card-text">
              ${gift.gift_desc}
            </p>
            <p>가격 : ${gift.gift_price}원</p>
            <p class="card-text"><small>유효기간: 1년</small></p>
            <div class="text-end">
              <button onclick="giftbuybtn(${gift.id})" type="button" class="btn btn-outline-secondary">
                구매하기
              </button>
            </div>
          </div>
        </div>
        `;
      });
    })
    .catch(function (error) {
      console.log(error);
    });
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
function giftbuybtn(giftid) {
  axios
    .get(`/gift/${giftid}`)
    .then(function (response) {
      const gift = response.data;
      console.log(gift);
      IMP.request_pay(
        {
          pg: 'kakaopay',
          pay_mathod: 'card',
          amount: gift.gift_price,
          name: gift.gift_name,
          gift_id: giftid,
        },
        function (response) {
          //   console.log(response);
          const { status, success, error_msg, imp_uid } = response;

          if (success === false) {
            alert(error_msg);
          }
          if (status === 'paid') {
            alert('결제완료');
            giftcheck(imp_uid, giftid)
              .then(function (result) {
                if (result.status === 201) {
                  usergift(giftid);
                } else {
                  alert('결제에 오류가 발생했습니다. 관리자에게 문의해주세요.');
                }
              })
              .catch(function (error) {
                console.log(error);
              });
          }
        },
      );
    })
    .catch(function (error) {
      console.log(error);
    });
}

//유저 결제후 이용권저장
function usergift(id) {
  console.log(id);
  axios
    .get(`gift/${id}`)
    .then(function (response) {
      const gift = response.data;

      axios
        .post(
          `/giftuser`,
          {
            gift_name: gift.gift_name,
            gift_desc: gift.gift_desc,
            gift_price: gift.gift_price,
            gift_use: gift.gift_use,
          },
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
            },
          },
        )
        .then(function () {
          console.log('이용권이 구매되었습니다.');
        });
    })
    .catch(function (error) {
      console.log(error);
    });
}

async function giftcheck(imp_uid, giftid) {
  try {
    console.log(imp_uid);
    const response = await axios.post('/gift/check', {
      imp_uid: imp_uid,
      giftid: giftid,
    });
    // console.log(response);
    return response; // API 응답 데이터를 반환합니다.
  } catch (error) {
    console.log(error);
    throw error; // 에러를 다시 던져서 호출한 측에서 처리할 수 있도록 합니다.
  }
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
function addgiftinfo() {
  const giftname = document.getElementById('inputgiftname').value;
  const giftdesc = document.getElementById('inputgiftdesc').value;
  const giftprice = document.getElementById('inputgiftprice').value;
  const giftuse = document.getElementById('inputgiftuse').value;

  axios
    .post(
      '/gift',
      {
        gift_name: giftname,
        gift_desc: giftdesc,
        gift_price: giftprice,
        gift_use: giftuse,
      },
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
        },
      },
    )
    .then(function () {
      console.log('기프트카드가 저장되었습니다.');
      window.location.reload();
    })
    .catch(function (error) {
      console.log(error);
    });
}
