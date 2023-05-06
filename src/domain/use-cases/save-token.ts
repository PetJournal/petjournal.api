export interface SaveToken {
  save: (tokenData: SaveToken.Params) => Promise<SaveToken.Result>
}

export namespace SaveToken {
  export interface Params {
    token: string
    accountId: number
  }

  export type Result = boolean
}
