async function fetchNotifications() {
  try {
    const response = await axios.get('/user/me', {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
      },
    });
    const user = response.data;

    const userId = user.id;

    // 사용자 ID를 사용하여 알림 데이터 가져오기
    const notificationResponse = await axios.get(
      `/notification/user/${userId}`,
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
        },
      },
    );
    const notifications = notificationResponse.data;
    // console.log('알림 데이터:', notifications);

    // 알림 데이터를 화면에 표시하는 로직 구현
    updateNotificationList(notifications);
  } catch (error) {
    console.log(error);
  }
}

async function updateNotificationList(notifications) {
  const notificationList = document.getElementById('notificationList');
  notificationList.innerHTML = ''; // 알림 리스트 초기화

  if (notifications.length === 0) {
    notificationList.innerHTML = '<li>알림이 없습니다.</li>';
  } else {
    for (const notification of notifications) {
      let message = notification.message;

      const storeIdMatches = [...message.matchAll(/storeId(\d+)/g)];
      const bookIdMatches = [...message.matchAll(/bookId(\d+)/g)];

      for (const match of storeIdMatches) {
        const storeId = match[1];
        const storeName = await fetchStoreName(storeId);
        message = message.replace(`storeId${storeId}`, storeName);
      }

      for (const match of bookIdMatches) {
        const bookId = match[1];
        const bookTitle = await fetchBookTitle(bookId);
        message = message.replace(`bookId${bookId}`, bookTitle);
      }

      const listItem = document.createElement('li');
      listItem.textContent = message; // 치환된 메시지 설정
      notificationList.appendChild(listItem);
    }
  }
}
// 매장 정보를 가져오는 함수
async function fetchStoreName(storeId) {
  try {
    const response = await axios.get(`/store/${storeId}`);
    return response.data[0].store_name; // 첫 번째 매장의 이름을 반환
  } catch (error) {
    console.error('매장 정보를 가져오는 중 오류 발생:', error);
    return '알 수 없는 매장'; // 오류 발생 시 기본 텍스트 반환
  }
}

// 책 정보를 가져오는 함수
async function fetchBookTitle(bookId) {
  try {
    const response = await axios.get(`/books/${bookId}`);
    return response.data.title; // 책 제목 반환
  } catch (error) {
    console.error('책 정보를 가져오는 중 오류 발생:', error);
    return '알 수 없는 책'; // 오류 발생 시 기본 텍스트 반환
  }
}

function tostebtn() {
  const notificationContainer = document.getElementById(
    'notificationContainer',
  );
  const notificationList = document.getElementById('notificationList');

  // 알림창 내용 초기화 및 기본 메시지 추가
  notificationList.innerHTML = '<li>알림창이 비어있습니다</li>';

  // 알림창의 표시 상태를 토글
  if (notificationContainer.style.display === 'none') {
    notificationContainer.style.display = 'block';

    fetchNotifications();
  } else {
    notificationContainer.style.display = 'none';
  }
}

// 알림창 요소를 선택
const notificationContainer = document.getElementById('notificationContainer');

// 페이지 전체에 클릭 이벤트 리스너를 추가
document.addEventListener('click', function (event) {
  // 클릭된 요소가 알림 버튼인지 확인
  const isBellClicked = event.target.closest('#liveToastBtn') !== null;

  // 클릭된 요소가 알림창 내부인지 확인
  const isClickInsideNotification = notificationContainer.contains(
    event.target,
  );

  // 알림 버튼을 클릭했거나, 알림창 내부를 클릭한 경우 아무 작업도 수행하지 않음
  if (isBellClicked || isClickInsideNotification) {
    return;
  }

  // 그 외의 경우, 알림창이 표시되어 있으면 숨김
  if (notificationContainer.style.display === 'block') {
    notificationContainer.style.display = 'none';
  }
});
