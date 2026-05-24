export interface DeleteTagRepository {
  deleteById: (tagId: DeleteTagRepository.Param) => Promise<DeleteTagRepository.Result>
}

export namespace DeleteTagRepository {
  export type Param = {
    tagId: string
    guardianId: string
  }
  export type Result = boolean

}
