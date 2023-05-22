export interface TokenGenerator {
  generate: (payload: TokenGenerator.Params) => Promise<TokenGenerator.Result>
}

export namespace TokenGenerator {
  export type Params = any
  export type Result = string
}
