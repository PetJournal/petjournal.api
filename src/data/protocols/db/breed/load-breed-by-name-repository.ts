export interface LoadBreedByNameRepository {
  loadByName: (name: LoadBreedByNameRepository.Params) => Promise<LoadBreedByNameRepository.Result>
}

export namespace LoadBreedByNameRepository {
  export type Params = string
  export type Result = {
    id: string
    name: string
  } | undefined
}
