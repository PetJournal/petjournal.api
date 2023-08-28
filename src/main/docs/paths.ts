import {
  loginPath,
  signUpPath,
  forgetPasswordPath,
  changePasswordPath,
  waitingCodePath,
  petRegistryPath
} from './paths/'

export default {
  '/signup': signUpPath,
  '/login': loginPath,
  '/forget-password': forgetPasswordPath,
  '/guardian/change-password': changePasswordPath,
  '/waiting-code': waitingCodePath,
  '/pet': petRegistryPath
}
