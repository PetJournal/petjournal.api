interface Guardian {
  id: string
  firstName: string
  lastName: string
  email: string
  password: string
  phone: string
  accessToken: string | null
  verificationToken: string
  verificationTokenCreatedAt: Date
}

export {
  type Guardian
}
