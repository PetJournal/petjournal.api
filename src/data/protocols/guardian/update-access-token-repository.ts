export interface UpdateAccessTokenRepository {
  updateAccessToken: (authentication: UpdateAccessTokenRepository.Params) => Promise<UpdateAccessTokenRepository.Result>
}

export namespace UpdateAccessTokenRepository {
  export interface Params { id: string, token: string }
  export type Result = boolean
}
