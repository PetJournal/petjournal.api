export interface AuthenticationModel {
  identifier: string
  password: string
}

export interface Authentication {
  auth: (authentication: AuthenticationModel) => Promise<string>
}
