export interface SaveTokenRepository {
  saveToken: (userId: number, token: string) => Promise<SaveTokenRepository.Result>
}

namespace SaveTokenRepository {
  export type Result = boolean
}
