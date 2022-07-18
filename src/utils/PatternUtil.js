
const EMAIL_ERROR_MESSAGE = '邮箱格式不正确';
const EMAIL_PATTERN = /^[a-zA-Z0-9_-]+@[a-zA-Z0-9_-]+(\.[a-zA-Z0-9_-]+)+$/;
const emailValid = (email) => EMAIL_PATTERN.test(email);

const USERNAME_ERROR_MESSAGE =
  '用户名只能包含中英文、数字、下划线、减号，长度必须在 2 - 16 之间';
const USERNAME_PATTERN = /^[a-zA-Z0-9\u4e00-\u9fa5\-_]{2,16}$/;
const usernameValid = (username) => USERNAME_PATTERN.test(username);

const PASSWORD_ERROR_MESSAGE =
  '密码必须同时包含字母和数字，长度至少为 8，若有特殊字符则只允许 @#$()+-/*%^&,.?! 这几个特殊字符';
const PASSWORD_PATTERN = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d@#$()+\-*/%^&,.?!]{8,}$$/;
const passwordValid = (password) => PASSWORD_PATTERN.test(password);


const PHONE_PATTERN = /^1[3-9]\d{9}$/;
const PHONE_ERROR_MESSAGE = "手机号格式不正确";
const phoneValid = (phone) => PHONE_PATTERN.test(phone);

export default {
  EMAIL_ERROR_MESSAGE,
  EMAIL_PATTERN,
  emailValid,
  USERNAME_ERROR_MESSAGE,
  USERNAME_PATTERN,
  usernameValid,
  PASSWORD_ERROR_MESSAGE,
  PASSWORD_PATTERN,
  passwordValid,
  PHONE_PATTERN,
  PHONE_ERROR_MESSAGE,
  phoneValid,
}
