export interface UpdateAccessTokenRepository {
  update: (email: string, token: string) => Promise<void>
}
