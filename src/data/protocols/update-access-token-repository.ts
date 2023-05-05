export interface UpdateAccessTokenRepository {
  updateAccessToken: (email: string, token: string) => Promise<void>
}
