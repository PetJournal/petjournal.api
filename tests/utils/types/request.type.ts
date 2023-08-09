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
  }
}

interface ForgetPasswordRequest {
  body: {
    email: string
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
    verificationToken: string
  }
}

interface PetRegistryRequest {
  userId?: string
  body: {
    guardianId: string
    specieId: string
    otherAlias: string | undefined
  }
}

export {
  type AuthMiddlewareRequest,
  type LoginRequest,
  type SignUpRequest,
  type ForgetPasswordRequest,
  type ChangePasswordRequest,
  type WaitingCodeRequest,
  type PetRegistryRequest
}
