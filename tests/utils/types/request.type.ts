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
    forgetPasswordToken: string | null
  }
}

interface ChangePasswordRequest {
  userId?: string
  body: {
    password: string
    passwordConfirmation: string
  }
}

interface AuthMiddlewareRequest {
  authorization: string
}

export {
  type SignUpRequest,
  type LoginRequest,
  type ChangePasswordRequest,
  type AuthMiddlewareRequest
}
