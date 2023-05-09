export interface HashComparer {
  compare: (input: HashComparer.Input) => Promise<HashComparer.Output>
}

export namespace HashComparer {
  export interface Input {
    value: string
    hash: string
  }
  export type Output = boolean
}
