import {
  loginPath,
  signUpPath,
  forgetPasswordPath,
  changePasswordPath,
  waitingCodePath
} from './paths/'

export default {
  '/signup': signUpPath,
  '/login': loginPath,
  '/forget-password': forgetPasswordPath,
  '/guardian/change-password': changePasswordPath,
  '/waiting-code': waitingCodePath
}
