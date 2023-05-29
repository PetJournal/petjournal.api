import { type HttpRequest } from '@/application/helpers/http'
import { type TokenDecoder } from '@/data/protocols'
import { type ChangePasswordRequest, type LoginRequest, type SignUpRequest } from '@/tests/utils'

interface Options<T extends { body: any }> {
  withUserId?: boolean
  fields?: Partial<T['body']>
}

const makeFakeLoginRequest = ({ fields = {} }: Options<LoginRequest> = {}): LoginRequest => {
  const body = {
    email: 'any_email@mail.com',
    password: 'any_password'
  }

  Object.assign(body, fields)

  return { body }
}

const makeFakeSignUpRequest = ({ fields = {} }: Options<SignUpRequest> = {}): SignUpRequest => {
  const body = {
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

  Object.assign(body, fields)

  return { body }
}

const makeFakeChangePasswordRequest = ({ fields = {}, withUserId = true }: Options<ChangePasswordRequest> = {}): ChangePasswordRequest => {
  const body = {
    password: 'any_password',
    passwordConfirmation: 'any_password'
  }

  const result = { body }

  if (withUserId) {
    Object.assign(result, { userId: 'any_id' })
  }

  Object.assign(body, fields)

  return result
}

const makeFakeAuthorization = ({ data }: { data: string }): HttpRequest => {
  const authorization = data

  return { authorization }
}

const makeFakePayload = (): TokenDecoder.Result => {
  const sub = 'valid_id'

  return { sub }
}

export {
  makeFakeSignUpRequest,
  makeFakeLoginRequest,
  makeFakeChangePasswordRequest,
  makeFakeAuthorization,
  makeFakePayload
}
