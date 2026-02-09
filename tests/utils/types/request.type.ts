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
  file?: Buffer
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
    specieName: string
    petName: string
    gender: string
    breedName: string
    size: string
    castrated: boolean
    dateOfBirth: Date
  }
  file?: Buffer
}

interface UpdatePetRequest {
  userId?: string
  body: {
    specieName: string
    petName: string
    gender: string
    breedName: string
    size: string
    castrated: boolean
    dateOfBirth: Date
  }
  params: {
    petId: string
  }
  file?: Buffer
}

interface DeletePetRequest {
  userId: string
  params: {
    petId: string
  }
}

interface EmailConfirmationRequest {
  params: {
    userId: string
  }
}

interface AddTagRequest {
  body: {
    name: string
    color: string
  }
}

interface AddSchedulerRequest {
  body: {
    tagId: string
    title: string
    description: string
    note: string
    startAt: Date
    endAt: Date
    daysOfWeek: number[] | undefined
    daysOfMonth: number[] | undefined
    daily: boolean | undefined
    pets: string[]
  }
  userId: string
}

export {
  type AuthMiddlewareRequest,
  type LoginRequest,
  type SignUpRequest,
  type ForgetPasswordRequest,
  type ChangePasswordRequest,
  type WaitingCodeRequest,
  type PetRegistryRequest,
  type UpdatePetRequest,
  type DeletePetRequest,
  type EmailConfirmationRequest,
  type AddTagRequest,
  type AddSchedulerRequest
}
