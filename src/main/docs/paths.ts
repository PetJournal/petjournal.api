import { changePasswordPath, forgetPasswordPath, loginPath, signUpPath } from '@/main/docs/paths/'

export default {
  '/forget-password': forgetPasswordPath,
  '/login': loginPath,
  '/signup': signUpPath,
  '/guardian/change-password': changePasswordPath
}
