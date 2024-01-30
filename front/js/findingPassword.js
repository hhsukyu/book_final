const apiUrl = 'http://localhost:3000';

function sendEmail() {
  const email = document.getElementById('email').value;

  axios
    .post('apiUrl + /send-verification', { email })
    .then((response) => {
      // 성공적으로 이메일을 보냈을 때의 로직
      console.log(response.data);
      alert('인증번호를 전송했습니다.');
      document.getElementById('emailForm').style.display = 'none';
      document.getElementById('verificationForm').style.display = 'block';
    })
    .catch((error) => {
      // 이메일 전송에 실패했을 때의 로직
      console.error(error);
      // 실패 메시지를 사용자에게 보여줄 수 있습니다.
    });
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
