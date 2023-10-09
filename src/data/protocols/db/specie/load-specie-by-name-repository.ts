export interface LoadSpecieByNameRepository {
  loadByName: (name: LoadSpecieByNameRepository.Params) => Promise<LoadSpecieByNameRepository.Result>
}

export namespace LoadSpecieByNameRepository {
  export type Params = string
  export type Result = {
    id: string
    name: string
  } | undefined
}