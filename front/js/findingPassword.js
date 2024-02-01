const apiUrl = 'http://43.203.75.81:3000/';

function sendEmail() {
  const email = document.getElementById('email').value;

  axios
    .post(`${apiUrl}/auth/send-verification`, { email })
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

let checkEmail = '';

function verifyCode() {
  const code = document.getElementById('verificationCode').value;
  const email = document.getElementById('email').value;

  axios
    .post(`${apiUrl}/auth/verify-code`, { code, email })
    .then((response) => {
      // 성공적으로 코드를 확인했을 때의 로직
      console.log('response.config.data', response.config.data);
      // response.config.data를 JSON 형식으로 파싱
      const requestData = JSON.parse(response.config.data);

      // email 속성에 접근
      const email = requestData.email;
      checkEmail = email;
      console.log('email', email);

      document.getElementById('verificationForm').style.display = 'none';
      document.getElementById('passwordResetForm').style.display = 'block';
    })
    .catch((error) => {
      // 코드 확인에 실패했을 때의 로직
      console.error(error);
      if (error.response.status === 409) {
        // 인증 코드가 일치하지 않는 경우
        alert('인증 코드가 일치하지 않습니다. 다시 확인해주세요.');
      } else {
        alert('인증 코드 확인에 실패했습니다. 다시 시도해주세요.');
      }
    });
}

function resetPassword() {
  const newPassword = document.getElementById('newPassword').value;
  const confirmPassword = document.getElementById('confirmPassword').value;

  if (newPassword === confirmPassword) {
    axios
      .put(`${apiUrl}/auth/update-password`, {
        email: checkEmail,
        password: newPassword,
        checkPassword: confirmPassword,
      })
      .then((response) => {
        // 성공적으로 비밀번호를 재설정했을 때의 로직
        console.log(response.data);

        alert('비밀번호가 성공적으로 재설정되었습니다.');
        $('#myModal').modal('hide');
      })
      .catch((error) => {
        // 비밀번호 재설정에 실패했을 때의 로직
        console.error(error);
        alert('비밀번호 재설정에 실패했습니다. 다시 시도해주세요.');
      });
  } else {
    alert('비밀번호가 일치하지 않습니다. 다시 확인해주세요.');
  }
}
