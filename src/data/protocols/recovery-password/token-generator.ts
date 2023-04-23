export interface TokenGenerator {
  generate: (tokenSize: number) => Promise<string>
}
