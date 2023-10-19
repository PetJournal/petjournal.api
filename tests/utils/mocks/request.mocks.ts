import { type TokenDecoder } from '@/data/protocols'
import {
  type AuthMiddlewareRequest,
  type LoginRequest,
  type SignUpRequest,
  type ForgetPasswordRequest,
  type ChangePasswordRequest,
  type WaitingCodeRequest,
  type PetRegistryRequest
} from '@/tests/utils'

const makeFakeLoginRequest = (): LoginRequest => {
  const body = {
    email: 'any_email@mail.com',
    password: 'any_password'
  }

  return { body }
}

const makeFakeSignUpRequest = (): SignUpRequest => {
  const body = {
    firstName: 'any_first_name',
    lastName: 'any_last_name',
    email: 'any_email@mail.com',
    password: 'any_password',
    passwordConfirmation: 'any_password',
    phone: 'any_phone'
  }

  return { body }
}

const makeFakeForgetPasswordRequest = (): ForgetPasswordRequest => {
  const body = {
    email: 'any_email@mail.com'
  }

  return { body }
}

const makeFakeChangePasswordRequest = (): ChangePasswordRequest => {
  const body = {
    password: 'any_password',
    passwordConfirmation: 'any_password'
  }

  return { body }
}

const makeFakeWaitingCodeRequest = (): WaitingCodeRequest => {
  const body = {
    email: 'valid_email',
    verificationToken: 'valid_code'
  }

  return { body }
}

const makeFakeAuthorizationRequest = (): AuthMiddlewareRequest => {
  const authorization = 'any_id'

  return { authorization }
}

const makeFakePayload = (): TokenDecoder.Result => {
  const sub = 'valid_id'

  return { sub }
}

const makeFakePetRegistryRequest = (): PetRegistryRequest => {
  const body = {
    guardianId: 'valid_guardian_id',
    specieName: 'valid_specie_id',
    specieAlias: 'any_alias',
    petName: 'any_name',
    gender: 'M'
  }

  return { body }
}

export {
  makeFakeSignUpRequest,
  makeFakeLoginRequest,
  makeFakeForgetPasswordRequest,
  makeFakeChangePasswordRequest,
  makeFakeWaitingCodeRequest,
  makeFakeAuthorizationRequest,
  makeFakePayload,
  makeFakePetRegistryRequest
}
