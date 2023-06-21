export interface SaveTokenRepository {
  saveToken: (userId: string, token: string) => Promise<SaveTokenRepository.Result>
}

export namespace SaveTokenRepository {
  export type Result = boolean
}
