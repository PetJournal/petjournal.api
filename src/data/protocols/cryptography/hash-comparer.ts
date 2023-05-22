export interface HashComparer {
  compare: (input: HashComparer.Params) => Promise<HashComparer.Result>
}

export namespace HashComparer {
  export interface Params {
    value: string
    hash: string
  }
  export type Result = boolean
}
