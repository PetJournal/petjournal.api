import {
  accessTokenSchema,
  breedSchema,
  changePasswordParamsSchema,
  errorSchema,
  forgetPasswordSchema,
  guardianSchema,
  loginParamsSchema,
  petRegistryParamsSchema,
  petSchema,
  signUpParamsSchema,
  sizeSchema,
  specieSchema,
  waitingCodeParamsSchema
} from './schemas/'

export default {
  error: errorSchema,
  accessToken: accessTokenSchema,
  guardian: guardianSchema,
  pet: petSchema,
  specie: specieSchema,
  breed: breedSchema,
  size: sizeSchema,
  loginParams: loginParamsSchema,
  signUpParams: signUpParamsSchema,
  forgetPasswordParams: forgetPasswordSchema,
  changePasswordParams: changePasswordParamsSchema,
  waitingCodeParams: waitingCodeParamsSchema,
  petRegistryParams: petRegistryParamsSchema
}
