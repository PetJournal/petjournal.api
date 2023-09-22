import {
  accessTokenSchema,
  changePasswordParamsSchema,
  errorSchema,
  forgetPasswordSchema,
  guardianSchema,
  loginParamsSchema,
  petRegistryParamsSchema,
  petSchema,
  signUpParamsSchema,
  specieSchema,
  waitingCodeParamsSchema
} from './schemas/'

export default {
  error: errorSchema,
  accessToken: accessTokenSchema,
  guardian: guardianSchema,
  pet: petSchema,
  specie: specieSchema,
  loginParams: loginParamsSchema,
  signUpParams: signUpParamsSchema,
  forgetPasswordParams: forgetPasswordSchema,
  changePasswordParams: changePasswordParamsSchema,
  waitingCodeParams: waitingCodeParamsSchema,
  petRegistryParams: petRegistryParamsSchema
}
