export interface FileStorage {
  save: (data: FileStorage.Params) => Promise<FileStorage.Result>
}

export namespace FileStorage {
  export type Params = {
    file: Buffer
    fileName: string
  }

  export type Result = string | null
}
