function sendEmail() {
  document.getElementById('emailForm').style.display = 'none';
  document.getElementById('verificationForm').style.display = 'block';
}

function verifyCode() {
  document.getElementById('verificationForm').style.display = 'none';
  document.getElementById('passwordResetForm').style.display = 'block';
}

function resetPassword() {
  let newPassword = document.getElementById('newPassword').value;
  let confirmPassword = document.getElementById('confirmPassword').value;

  if (newPassword === confirmPassword) {
    alert('비밀번호가 재설정되었습니다.');
    $('#myModal').modal('hide');
  } else {
    alert('비밀번호가 일치하지 않습니다. 다시 확인해주세요.');
  }
}
