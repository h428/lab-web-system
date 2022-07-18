import { doGet, doPost } from '@/utils/request';

const PREFIX = '/open';

export async function reqLogin(email, password) {
  return doPost(`${PREFIX}/login`, { body: { email, password } });
}

export async function reqRegisterCaptcha(email) {
  return doPost(`${PREFIX}/captcha/register/${email}`);
}

export async function reqRegister({ email, username, password, confirmPassword, captcha }) {
  return doPost(`${PREFIX}/register`, {
    body: { email, username, password, confirmPassword, captcha },
  });
}

export async function reqResetPasswordCaptcha(email) {
  return doPost(`${PREFIX}/captcha/reset-password/${email}`);
}

export async function reqResetPassword({ email, password, confirmPassword, captcha }) {
  return doPost(`${PREFIX}/reset-password`, {
    body: { email, password, confirmPassword, captcha },
  });
}

export async function reqExistEmail(email) {
  return doGet(`${PREFIX}/check/email-exist/${email}`);
}

export async function reqExistUsername(username) {
  return doGet(`${PREFIX}/check/username-exist/${username}`);
}
