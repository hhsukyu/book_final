// eslint-disable-next-line @typescript-eslint/no-unused-vars
async function signupform(event) {
  event.preventDefault();

  const formData = new FormData(document.getElementById('signupForm'));

  axios
    .post('/auth/signup', {
      nickname: formData.get('Regnickname'),
      email: formData.get('Regemail'),
      password: formData.get('Regpassword'),
      age: formData.get('age'),
      phone: formData.get('phone'),
      checkPassword: formData.get('RegpasswordConfirm'),
    })
    .then(function (response) {
      console.log(response.data);

      alert('회원가입 완료');
      //로그인 토글로 이동하도록 수정
      window.location.href = 'login&signup.html';
    })
    .catch(function (error) {
      console.log(error);
    });
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
function checkPasswordMatch() {
  const password = document.getElementById('Regpassword').value;
  const confirmPassword = document.getElementById('RegconfirmPassword').value;
  const passwordError = document.getElementById('passwordError');

  if (password !== confirmPassword) {
    passwordError.textContent = '비밀번호가 일치하지 않습니다.';
  } else {
    passwordError.textContent = '비밀번호가 일치합니다.';
  }
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
function checkDuplicateEmail(event) {
  const emailInput = document.getElementById('Regemail');
  const emailError = document.getElementById('emailError');

  axios
    .get(`/user/email?email=${emailInput.value}`)
    .then(function (response) {
      const isEmailExists = response.data.isEmailExists;

      if (emailInput.value === '') {
        emailError.textContent = '이메일을 입력해주세요';
      } else if (!isEmailExists) {
        event.preventDefault();
        emailError.textContent = '사용 가능한 이메일입니다.';
      } else {
        emailError.textContent = '중복된 이메일입니다.';
      }
    })
    .catch(function (error) {
      console.log(error);
    });

  // 중복 확인 이후에 입력한 이메일 유지
  event.preventDefault();
}
