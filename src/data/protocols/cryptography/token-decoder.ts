export interface TokenDecoder {
  decode: (token: TokenDecoder.Input) => Promise<TokenDecoder.Output>
}

export namespace TokenDecoder {
  export type Input = string
  export type Output = any | null
}
