import { type HttpRequest } from '@/application/helpers/http'
import { type TokenDecoder } from '@/data/protocols'
import { type LoginRequest, type SignUpRequest } from '@/tests/utils'

const makeFakeAuthorization = ({ data }: { data: string }): HttpRequest => ({
  authorization: data
})

const makeFakeSignUpRequest = (fields: Partial<SignUpRequest> = {}): SignUpRequest => {
  const guardianFake = {
    firstName: 'any_first_name',
    lastName: 'any_last_name',
    email: 'any_email@mail.com',
    password: 'any_password',
    passwordConfirmation: 'any_password',
    phone: 'any_phone',
    accessToken: 'any_token',
    isPrivacyPolicyAccepted: true,
    forgetPasswordToken: null
  }

  return {
    ...guardianFake,
    ...fields
  }
}

const makeFakeLogin = (): LoginRequest => ({
  email: 'any_email@mail.com',
  password: 'any_password'
})

const makeFakeRequest = (): HttpRequest => ({
  body: makeFakeLogin()
})

const makeFakePayload = (): TokenDecoder.Result => ({
  sub: 'valid_id'
})

export {
  makeFakeSignUpRequest,
  makeFakeLogin,
  makeFakeAuthorization,
  makeFakePayload,
  makeFakeRequest
}
