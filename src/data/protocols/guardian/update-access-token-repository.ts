export interface UpdateAccessTokenRepository {
  updateAccessToken: (authentication: UpdateAccessTokenRepository.Params) => Promise<void>
}

export namespace UpdateAccessTokenRepository {
  export interface Params { id: string, token: string }
}
