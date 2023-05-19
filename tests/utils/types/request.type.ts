import { type Guardian } from './guardian.type'

interface LoginRequest {
  email: string
  password: string
}

interface SignUpRequest extends Guardian {
  passwordConfirmation: string
}

export {
  type SignUpRequest,
  type LoginRequest
}
