interface Guardian {
  firstName: string
  lastName: string
  email: string
  password: string
  phone: string
  accessToken: string | null
  forgetPasswordToken: string | null
}

interface GuardianWithId extends Guardian {
  id: string
}

export {
  type Guardian,
  type GuardianWithId
}
