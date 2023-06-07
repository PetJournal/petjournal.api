export interface UpdateVerificationTokenRepository {
  updateVerificationToken: (userId: string, token: string) => Promise<UpdateVerificationTokenRepository.Result>
}

export namespace UpdateVerificationTokenRepository {
  export type Result = boolean
}
