import { type Guardian } from './guardian.type'

interface LoginRequest {
  email: string
  password: string
}

interface WaitingCodeRequest {
  email: string
  verificationToken: string
}

interface SignUpRequest extends Guardian {
  passwordConfirmation: string
  isPrivacyPolicyAccepted: boolean
}

export {
  type SignUpRequest,
  type LoginRequest,
  type WaitingCodeRequest
}
