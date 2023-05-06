export interface SaveTokenRepository {
  saveToken: (userId: number, token: string) => Promise<SaveTokenRepository.Result>
}

export namespace SaveTokenRepository {
  export type Result = boolean
}
