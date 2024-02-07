document.addEventListener('DOMContentLoaded', function () {
  const preOwnersList = document.getElementById('preOwnersList');

  // Fetch pre-owners and display them
  function fetchPreOwners() {
    axios
      .get('applyowner')
      .then(function (response) {
        const preOwners = response.data;
        console.log('response.data', response.data);
        preOwners.forEach(function (preOwner) {
          const listItem = document.createElement('li');

          // Create <span> elements for each property
          const ownerNameSpan = document.createElement('span');
          ownerNameSpan.textContent = `대표자 성함: ${preOwner.owner_name}`;
          listItem.appendChild(ownerNameSpan);

          const businessLicenseNumberSpan = document.createElement('span');
          businessLicenseNumberSpan.textContent = `사업자등록증번호: ${preOwner.business_license_number}`;
          listItem.appendChild(businessLicenseNumberSpan);

          const businessLocationSpan = document.createElement('span');
          businessLocationSpan.textContent = `사업장 소재지: ${preOwner.business_location}`;
          listItem.appendChild(businessLocationSpan);

          const approveButton = document.createElement('button');
          approveButton.textContent = '승인';
          approveButton.addEventListener('click', function () {
            approveOwner(preOwner.id);
          });

          listItem.appendChild(approveButton);
          preOwnersList.appendChild(listItem);
        });
      })
      .catch(function (error) {
        console.error('Error fetching pre-owners', error);
      });
  }

  // Send approval request to the backend
  function approveOwner(userId) {
    axios
      .put(`applyowner/${userId}`)
      .then(function () {
        // After approval, refresh the list of pre-owners
        preOwnersList.innerHTML = '';
        fetchPreOwners();
      })
      .catch(function (error) {
        console.error('Error approving owner', error);
      });
  }

  // Initialize the page by fetching and displaying pre-owners
  fetchPreOwners();
});
