// configuration variables
const itemsPerPage = 16;

// reference to keep track of current page
let currentPage = 1;

// data, could be json from api
// const cards = [
//   {
//     title: '주술회전',
//     image:
//       'https://i.namu.wiki/i/ansU2jw14dqvAVa_i_XyHO4uCuBh56segYeOz69QjRUeSPnmzzgz2o5_MzEpDiAojF_sNwFMQJk3ExK0mVW9aw.webp',
//   },
//   {
//     title: '주술회전',
//     image:
//       'https://i.namu.wiki/i/ansU2jw14dqvAVa_i_XyHO4uCuBh56segYeOz69QjRUeSPnmzzgz2o5_MzEpDiAojF_sNwFMQJk3ExK0mVW9aw.webp',
//   },
//   {
//     title: '주술회전',
//     image:
//       'https://i.namu.wiki/i/ansU2jw14dqvAVa_i_XyHO4uCuBh56segYeOz69QjRUeSPnmzzgz2o5_MzEpDiAojF_sNwFMQJk3ExK0mVW9aw.webp',
//   },
//   {
//     title: '주술회전',
//     image:
//       'https://i.namu.wiki/i/ansU2jw14dqvAVa_i_XyHO4uCuBh56segYeOz69QjRUeSPnmzzgz2o5_MzEpDiAojF_sNwFMQJk3ExK0mVW9aw.webp',
//   },
//   {
//     title: '주술회전',
//     image:
//       'https://i.namu.wiki/i/ansU2jw14dqvAVa_i_XyHO4uCuBh56segYeOz69QjRUeSPnmzzgz2o5_MzEpDiAojF_sNwFMQJk3ExK0mVW9aw.webp',
//   },
//   {
//     title: '주술회전',
//     image:
//       'https://i.namu.wiki/i/ansU2jw14dqvAVa_i_XyHO4uCuBh56segYeOz69QjRUeSPnmzzgz2o5_MzEpDiAojF_sNwFMQJk3ExK0mVW9aw.webp',
//   },
//   {
//     title: '주술회전',
//     image:
//       'https://i.namu.wiki/i/ansU2jw14dqvAVa_i_XyHO4uCuBh56segYeOz69QjRUeSPnmzzgz2o5_MzEpDiAojF_sNwFMQJk3ExK0mVW9aw.webp',
//   },
//   {
//     title: '주술회전',
//     image:
//       'https://i.namu.wiki/i/ansU2jw14dqvAVa_i_XyHO4uCuBh56segYeOz69QjRUeSPnmzzgz2o5_MzEpDiAojF_sNwFMQJk3ExK0mVW9aw.webp',
//   },
//   {
//     title: '주술회전',
//     image:
//       'https://i.namu.wiki/i/ansU2jw14dqvAVa_i_XyHO4uCuBh56segYeOz69QjRUeSPnmzzgz2o5_MzEpDiAojF_sNwFMQJk3ExK0mVW9aw.webp',
//   },
//   {
//     title: '주술회전',
//     image:
//       'https://i.namu.wiki/i/ansU2jw14dqvAVa_i_XyHO4uCuBh56segYeOz69QjRUeSPnmzzgz2o5_MzEpDiAojF_sNwFMQJk3ExK0mVW9aw.webp',
//   },
//   {
//     title: '주술회전',
//     image:
//       'https://i.namu.wiki/i/ansU2jw14dqvAVa_i_XyHO4uCuBh56segYeOz69QjRUeSPnmzzgz2o5_MzEpDiAojF_sNwFMQJk3ExK0mVW9aw.webp',
//   },
//   {
//     title: '주술회전',
//     image:
//       'https://i.namu.wiki/i/ansU2jw14dqvAVa_i_XyHO4uCuBh56segYeOz69QjRUeSPnmzzgz2o5_MzEpDiAojF_sNwFMQJk3ExK0mVW9aw.webp',
//   },
//   {
//     title: '주술회전',
//     image:
//       'https://i.namu.wiki/i/ansU2jw14dqvAVa_i_XyHO4uCuBh56segYeOz69QjRUeSPnmzzgz2o5_MzEpDiAojF_sNwFMQJk3ExK0mVW9aw.webp',
//   },
//   {
//     title: '주술회전',
//     image:
//       'https://i.namu.wiki/i/ansU2jw14dqvAVa_i_XyHO4uCuBh56segYeOz69QjRUeSPnmzzgz2o5_MzEpDiAojF_sNwFMQJk3ExK0mVW9aw.webp',
//   },
//   {
//     title: '주술회전',
//     image:
//       'https://i.namu.wiki/i/ansU2jw14dqvAVa_i_XyHO4uCuBh56segYeOz69QjRUeSPnmzzgz2o5_MzEpDiAojF_sNwFMQJk3ExK0mVW9aw.webp',
//   },
//   {
//     title: '주술회전',
//     image:
//       'https://i.namu.wiki/i/ansU2jw14dqvAVa_i_XyHO4uCuBh56segYeOz69QjRUeSPnmzzgz2o5_MzEpDiAojF_sNwFMQJk3ExK0mVW9aw.webp',
//   },
//   {
//     title: '주술회전',
//     image:
//       'https://i.namu.wiki/i/ansU2jw14dqvAVa_i_XyHO4uCuBh56segYeOz69QjRUeSPnmzzgz2o5_MzEpDiAojF_sNwFMQJk3ExK0mVW9aw.webp',
//   },
//   {
//     title: '주술회전',
//     image:
//       'https://i.namu.wiki/i/ansU2jw14dqvAVa_i_XyHO4uCuBh56segYeOz69QjRUeSPnmzzgz2o5_MzEpDiAojF_sNwFMQJk3ExK0mVW9aw.webp',
//   },

//   // ... (add more card data)
// ];

// reference to total pages
const pages = numPages(cards);

function numPages(cardsArray) {
  // returns the number of pages
  return Math.ceil(cardsArray.length / itemsPerPage);
}

function createCardElement(card) {
  return `
    <div class="col-3 mb-3">
      <div class="col">
        <div class="card">
          <img src="${card.image}" class="card-img-top" alt="...">
          <div class="card-body">
            <h5 class="card-title">${card.title}</h5>
          </div>
        </div>
      </div>
    </div>
  `;
}

function changePage(page) {
  const output = document.getElementById('output');
  if (page < 1) page = 1;
  if (page > pages) page = pages;
  output.innerHTML = '';

  for (
    let i = (page - 1) * itemsPerPage;
    i < page * itemsPerPage && i < cards.length;
    i++
  ) {
    const card = cards[i];
    output.innerHTML += createCardElement(card);
  }
}

function addPages() {
  const el = document.getElementById('pages');
  for (let i = 1; i < pages + 1; i++) {
    el.innerHTML += `<li><a href="javascript:gotoPage(${i})">${i}</a></li>`;
  }
}

function nextPage() {
  if (currentPage < pages) changePage(++currentPage);
}

function prevPage() {
  if (currentPage > 1) changePage(--currentPage);
}

function gotoPage(page) {
  currentPage = page;
  changePage(page);
}

window.onload = function () {
  changePage(1); // set default page
  addPages(); // generate page navigation
};
