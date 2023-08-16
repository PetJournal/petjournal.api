export interface LoadSpecieByIdRepository {
  loadById: (id: LoadSpecieByIdRepository.Params) => Promise<LoadSpecieByIdRepository.Result>
}

export namespace LoadSpecieByIdRepository {
  export type Params = string
  export type Result = {
    id: string
    name: string
    otherAlias: string | null
  } | undefined
}
