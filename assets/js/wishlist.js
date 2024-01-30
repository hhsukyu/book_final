const wishlist = document.getElementById('result-wish-box');

window.onload = function () {
  const token = localStorage.getItem('accessToken');

  if (!token) {
    loadHeader('home'); // load the home page by default
  } else {
    loadHeader('login');
  }

  userme();
};

// eslint-disable-next-line @typescript-eslint/no-unused-vars
function userme() {
  axios
    .get('/user/me', {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
      },
    })
    .then(function (response) {
      console.log(response.data);
      const user = response.data;
      const mypage = response.data.myPage;
      const wishs = mypage.wish_list;

      if (user.mypage === null) {
        console.log('test');
      } else if (user.mypage !== null) {
        // console.log(wishs);
        if (wishs) {
          Object.keys(wishs).forEach(function (key) {
            let wishname = wishs[key];
            console.log(wishname);
            booknamedb(wishname);

            //위시리스트 추가 부분
          });
        } else {
        }
      }
    })
    .catch(function (error) {
      console.log(error);
    });
}

function booknamedb(bookid) {
  axios
    .get('books/wishlist/' + bookid)
    .then(function (response) {
      const bookid = response.data.id;
      const booktitle = response.data.title;
      console.log(booktitle);

      wishlist.innerHTML += `<div class="wishteg"><a>${booktitle}</a>&nbsp &nbsp<i onclick="removewish(${bookid})" class="fa fa-xing"></i></div>`;
    })
    .catch(function (error) {
      console.log(error);
    });
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
async function wishkey(event) {
  const searchresult = document.getElementById('searchResults');
  const searchbox = await document.getElementById('wishlistInput').value;
  const fullsearchbox = document.getElementById('wishlistsearch');

  if (searchbox !== '') {
    searchresult.style.display = 'block';
    fullsearchbox.style.height = '200px';
    if (event.key === 'Enter') {
      getAutocompleteResults(searchbox);
    }
  } else {
    searchresult.style.display = 'none';
    searchresult.innerHTML = ``;
  }
}

//keyup delete searchbox
// eslint-disable-next-line @typescript-eslint/no-unused-vars
async function deletebox() {
  const searchbox = await document.getElementById('wishlistInput').value;
  const searchresult = document.getElementById('searchResults');
  const fullsearchbox = document.getElementById('wishlistsearch');

  if (searchbox === '') {
    fullsearchbox.style.height = '0px';
    searchresult.innerHTML = '';
  }
}

// 위시리스트 도서 검색
async function getAutocompleteResults(searchbox) {
  const searchresult = document.getElementById('searchResults');
  searchresult.innerHTML = ``;
  await axios
    .get(`/books/wishlist?booktitle=${searchbox}`)
    .then(function (response) {
      // console.log(response.data);
      const books = response.data;
      // console.log(books);
      searchresult.innerHTML += '<ul>';
      books.forEach((book) => {
        searchresult.innerHTML += `<li id="wishlistli" onclick="addwish(${book.id})">${book.title}</li>`;
      });
      searchresult.innerHTML += '</ul>';
    })
    .catch(function (error) {
      console.log(error);
    });
}

// 위시리스트 도서 검색 클릭시 위시리스트에 저장
function addwish(bookid) {
  //위시리스트에 위시리스트 목록만 저장
  console.log(bookid);
  axios
    .post(
      '/mypage/wishlist',
      {
        wish_list: bookid,
      },
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
        },
      },
    )
    .then(function (response) {
      console.log('수정 성공');
      window.location.reload();
    })
    .catch(function (error) {
      console.log(error);
    });
}

// 위시리스트를 태그
function removewish(wishlist) {
  // 위시리스트만 삭제하는 api 구현
  console.log(wishlist);
  axios
    .delete('/mypage/wishlist', {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
      },
      data: {
        wish_list: wishlist,
      },
    })
    .then(function (response) {
      alert('삭제 성공');
      window.location.reload();
    })
    .catch(function (error) {
      console.log(error);
    });
}
