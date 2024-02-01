function handleStarClick(starIndex) {
  // Loop through all stars
  for (let i = 1; i <= 5; i++) {
    const starElement = $(`.star${i}`);

    if (i <= starIndex) {
      // If the current star is less than or equal to the clicked star index, set it to solid and yellow
      starElement.html(
        '<i class="fa-solid fa-star" style="color: #FFD43B;"></i>',
      );
    } else {
      // Otherwise, set it to regular
      starElement.html('<i class="fa-regular fa-star"></i>');
    }
  }
}

// Attach click event listeners to each star
$('.star1').click(() => handleStarClick(1));
$('.star2').click(() => handleStarClick(2));
$('.star3').click(() => handleStarClick(3));
$('.star4').click(() => handleStarClick(4));
$('.star5').click(() => handleStarClick(5));
