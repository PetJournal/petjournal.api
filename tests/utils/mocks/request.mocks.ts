import { type Authentication } from '@/domain/use-cases'
import { type HttpRequest } from '@/application/helpers'
import { type TokenDecoder } from '@/data/protocols'
import {
  type LoginRequest,
  type SignUpRequest,
  type ForgetPasswordRequest,
  type ChangePasswordRequest,
  type WaitingCodeRequest
} from '@/tests/utils'

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

const makeFakeChangePasswordRequest = ({ fields = {}, withUserId = true }: Options<ChangePasswordRequest> = {}): ChangePasswordRequest => {
  const body = {
    password: 'any_password',
    passwordConfirmation: 'any_password'
  }

  Object.assign(body, fields)

  const result = { body }

  if (withUserId) {
    Object.assign(result, { userId: 'any_id' })
  }

  return result
}

const makeFakeWaitingCodeRequest = ({ fields = {} }: Options<WaitingCodeRequest> = {}): WaitingCodeRequest => {
  const body = {
    email: 'valid_email',
    forgetPasswordCode: 'valid_code'
  }

  Object.assign(body, fields)

  return { body }
}

const makeFakeAuthorizationRequest = (): HttpRequest => {
  const authorization = 'any_id'

  return { authorization }
}

const makeFakePayload = (): TokenDecoder.Result => {
  const sub = 'valid_id'

  return { sub }
}

const makeFakeAuth = (): Authentication.Params => ({
  email: 'any_email@mail.com',
  sensitiveData: { field: 'any_field', value: 'any_data' }
})

export {
  makeFakeSignUpRequest,
  makeFakeLoginRequest,
  makeFakeForgetPasswordRequest,
  makeFakeChangePasswordRequest,
  makeFakeWaitingCodeRequest,
  makeFakeAuthorizationRequest,
  makeFakeAuth,
  makeFakePayload
}
