export interface HashGenerator {
  encrypt: (input: HashGenerator.Input) => Promise<HashGenerator.Output>
}

export namespace HashGenerator {
  export interface Input { value: string }
  export type Output = string
}
