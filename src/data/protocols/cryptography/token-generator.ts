export interface TokenGenerator {
  generate: (email: string) => Promise<string>
}
