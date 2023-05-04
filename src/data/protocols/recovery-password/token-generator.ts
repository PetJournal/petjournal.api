export interface TokenGenerator {
  generate: (userId: number) => Promise<string>
}
