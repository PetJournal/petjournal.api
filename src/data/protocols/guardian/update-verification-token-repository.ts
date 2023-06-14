export interface UpdateVerificationTokenRepository {
  updateVerificationToken: (credentials: UpdateVerificationTokenRepository.Params) => Promise<UpdateVerificationTokenRepository.Result>
}

export namespace UpdateVerificationTokenRepository {
  export interface Params { userId: string, token: string }
  export type Result = boolean
}
