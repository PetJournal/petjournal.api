import { accessTokenSchema, errorSchema, forgetPasswordSchema, guardianSchema, loginParamsSchema, signUpParamsSchema, waitingCodeParamsSchema } from '@/main/docs/schemas/'

export default {
  error: errorSchema,
  accessToken: accessTokenSchema,
  forgetPasswordParams: forgetPasswordSchema,
  guardian: guardianSchema,
  loginParams: loginParamsSchema,
  signUpParams: signUpParamsSchema,
  waitingCodeParams: waitingCodeParamsSchema
}
