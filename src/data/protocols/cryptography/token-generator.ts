export interface TokenGenerator {
  generate: (payload: TokenGenerator.Input) => Promise<TokenGenerator.Output>
}

export namespace TokenGenerator {
  export type Input = any
  export type Output = string
}
