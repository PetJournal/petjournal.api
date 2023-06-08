interface AuthMiddlewareRequest {
  authorization: string
}

interface LoginRequest {
  body: {
    email: string
    password: string
  }
}

interface SignUpRequest {
  body: {
    firstName: string
    lastName: string
    email: string
    password: string
    passwordConfirmation: string
    phone: string
    accessToken: string | null
    isPrivacyPolicyAccepted: boolean
    verificationToken: string
    verificationTokenCreatedAt: Date
  }
}

interface ChangePasswordRequest {
  userId?: string
  body: {
    password: string
    passwordConfirmation: string
  }
}

interface WaitingCodeRequest {
  body: {
    email: string
    forgetPasswordCode: string
  }
}

export {
  type AuthMiddlewareRequest,
  type LoginRequest,
  type SignUpRequest,
  type ChangePasswordRequest,
  type WaitingCodeRequest
}
