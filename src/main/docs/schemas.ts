import { errorSchema, forgetPasswordSchema, signUpParamsSchema } from '@/main/docs/schemas/'

export default {
  error: errorSchema,
  signUpParams: signUpParamsSchema,
  forgetPasswordParams: forgetPasswordSchema
}
