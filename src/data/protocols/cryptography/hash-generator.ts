export interface HashGenerator {
  encrypt: (input: HashGenerator.Params) => Promise<HashGenerator.Result>
}

export namespace HashGenerator {
  export interface Params { value: string }
  export type Result = string
}
