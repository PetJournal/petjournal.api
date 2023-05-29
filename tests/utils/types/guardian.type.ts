interface Guardian {
  firstName: string
  lastName: string
  email: string
  password: string
  phone: string
  accessToken: string | null
  forgetPasswordToken: string | null
}

export {
  type Guardian
}
