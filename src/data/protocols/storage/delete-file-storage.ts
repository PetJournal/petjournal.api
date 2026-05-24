export interface DeleteFileStorage {
  delete: (fileUrlOrPath: DeleteFileStorage.Params) => Promise<DeleteFileStorage.Result>
}

export namespace DeleteFileStorage {
  export type Params = {
    fileUrlOrPath: string
  }

  export type Result = void
}
