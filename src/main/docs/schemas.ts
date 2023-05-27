import { changePasswordParamsSchema, errorSchema, forgetPasswordSchema, guardianSchema, loginParamsSchema, signUpParamsSchema } from '@/main/docs/schemas/'

export default {
  error: errorSchema,
  forgetPasswordParams: forgetPasswordSchema,
  guardian: guardianSchema,
  loginParams: loginParamsSchema,
  signUpParams: signUpParamsSchema,
  changePasswordParams: changePasswordParamsSchema
}
