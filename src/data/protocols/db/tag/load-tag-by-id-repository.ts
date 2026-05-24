export interface LoadTagByIdRepository {
  loadById: (params: LoadTagByIdRepository.Param) => Promise<LoadTagByIdRepository.Result>
}

export namespace LoadTagByIdRepository {
  export type Param = {
    tagId: string
    guardianId: string
  }

  export type Result = {
    id: string
    guardianId: string
    name: string
    color: string
  } | null
}
