export interface SaveTokenRepository {
  saveToken: (params: SaveTokenRepository.Params) => Promise<SaveTokenRepository.Result>
}

export namespace SaveTokenRepository {
  export type Params = {
    userId: string
    token: string
  }

  export type Result = boolean
}
