const wishlist = document.getElementById('result-wish-box');

const storelist = document.getElementById('result-store-box');

window.onload = function () {
  const token = localStorage.getItem('accessToken');

  if (!token) {
    loadHeader('home'); // load the home page by default
  } else if (token) {
    axios
      .get('/user/me', {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
        },
      })
      .then(function (response) {
        console.log(response.data);
        const user = response.data;
        if (user.role === 0) {
          console.log('유저');
          loadHeader('login');
        } else if (user.role === 1) {
          console.log('사장');
          loadHeader('admin');
        } else if (user.role === 2) {
          console.log('사이트관리자');
          loadHeader('siteadmin');
        }
      })
      .catch(function (error) {
        console.log(error);
      });
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
      const stores = mypage.like_store;

      if (user.mypage === null) {
        console.log('test');
      } else if (user.mypage !== null) {
        if (stores) {
          Object.keys(stores).forEach(function (key) {
            let storeid = stores[key];
            // console.log(storeid);
            storenamedb(storeid);
            //위시리스트 추가 부분
          });
        }

        if (wishs) {
          Object.keys(wishs).forEach(function (key) {
            let wishname = wishs[key];
            // console.log(wishname);
            booknamedb(wishname);

            //위시리스트 추가 부분
          });
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
      // console.log(booktitle);

      wishlist.innerHTML += `<div class="wishteg"><a>${booktitle}</a>&nbsp &nbsp<i onclick="removewish(${bookid})" class="fa fa-xing"></i></div>`;
    })
    .catch(function (error) {
      console.log(error);
    });
}

function storenamedb(storeid) {
  axios
    .get('store/liststore/' + storeid)
    .then(function (response) {
      console.log(response);
      const storeid = response.data.id;
      const storename = response.data.store_name;
      // console.log(storename);

      storelist.innerHTML += `<div class="wishteg"><a>${storename}</a>&nbsp &nbsp<i onclick="removestore(${storeid})" class="fa fa-xing"></i></div>`;
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
      wishResults(searchbox);
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
async function wishResults(searchbox) {
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
// eslint-disable-next-line @typescript-eslint/no-unused-vars
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
    .then(function () {
      console.log('수정 성공');
      window.location.reload();
    })
    .catch(function (error) {
      console.log(error);
      alert(error.response.data.message);
      window.location.reload();
    });
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
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
    .then(function () {
      alert('삭제 성공');
      window.location.reload();
    })
    .catch(function (error) {
      console.log(error);
    });
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
async function storykey(event) {
  const searchresult = document.getElementById('storesearchResults');
  const searchbox = await document.getElementById('storelistInput').value;
  const fullsearchbox = document.getElementById('storelistsearch');

  if (searchbox !== '') {
    searchresult.style.display = 'block';
    fullsearchbox.style.height = '200px';
    if (event.key === 'Enter') {
      storeResults(searchbox);
    }
  } else {
    searchresult.style.display = 'none';
    searchresult.innerHTML = ``;
  }
}

//keyup delete searchbox
// eslint-disable-next-line @typescript-eslint/no-unused-vars
async function storydeletebox() {
  const searchbox = await document.getElementById('storelistInput').value;
  const searchresult = document.getElementById('storesearchResults');
  const fullsearchbox = document.getElementById('storelistsearch');

  if (searchbox === '') {
    fullsearchbox.style.height = '0px';
    searchresult.innerHTML = '';
  }
}

// 위시리스트 도서 검색
async function storeResults(searchbox) {
  const searchresult = document.getElementById('storesearchResults');
  searchresult.innerHTML = ``;
  await axios
    .get(`/store/mypage?storeName=${searchbox}`)
    .then(function (response) {
      // console.log(response.data);
      const stores = response.data;
      // console.log(books);
      searchresult.innerHTML += '<ul>';
      stores.forEach((store) => {
        searchresult.innerHTML += `<li id="wishlistli" onclick="addstore(${store.id})">${store.store_name}</li>`;
      });
      searchresult.innerHTML += '</ul>';
    })
    .catch(function (error) {
      console.log(error);
    });
}

// 위시리스트 도서 검색 클릭시 위시리스트에 저장
// eslint-disable-next-line @typescript-eslint/no-unused-vars
function addstore(storeid) {
  //위시리스트에 위시리스트 목록만 저장
  console.log(storeid);
  axios
    .post(
      '/mypage/likestore',
      {
        like_store: storeid,
      },
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
        },
      },
    )
    .then(function () {
      console.log('수정 성공');
      window.location.reload();
    })
    .catch(function (error) {
      alert(error.response.data.message);
    });
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
function removestore(storeid) {
  // 위시리스트만 삭제하는 api 구현
  console.log(storeid);
  axios
    .delete('/mypage/likestore', {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
      },
      data: {
        like_store: storeid,
      },
    })
    .then(function () {
      alert('삭제 성공');
      window.location.reload();
    })
    .catch(function (error) {
      console.log(error);
    });
}
