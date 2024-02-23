export interface LoadSizeByNameRepository {
  loadByName: (name: LoadSizeByNameRepository.Params) => Promise<LoadSizeByNameRepository.Result>
}

export namespace LoadSizeByNameRepository {
  export type Params = string
  export type Result = {
    id: string
    name: string
    specieId: string
  } | undefined
}
