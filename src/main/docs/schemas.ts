import { errorSchema, guardianSchema, loginParamsSchema, signUpParamsSchema } from '@/main/docs/schemas/'

export default {
  error: errorSchema,
  guardian: guardianSchema,
  loginParams: loginParamsSchema,
  signUpParams: signUpParamsSchema
}
