export interface TokenDecoder {
  decode: (token: TokenDecoder.Params) => Promise<TokenDecoder.Result>
}

export namespace TokenDecoder {
  export type Params = string
  export type Result = any | null
}
