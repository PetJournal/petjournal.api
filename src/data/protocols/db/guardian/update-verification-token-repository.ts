export interface UpdateVerificationTokenRepository {
  updateVerificationToken: (params: UpdateVerificationTokenRepository.Params) => Promise<UpdateVerificationTokenRepository.Result>
}

export namespace UpdateVerificationTokenRepository {
  export type Params = {
    userId: string
    token: string
  }

  export type Result = boolean
}
