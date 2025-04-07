export interface DeleteTagRepository {
  deleteById: (tagId: DeleteTagRepository.Param) => Promise<DeleteTagRepository.Result>
}

export namespace DeleteTagRepository {
  export type Param = string
  export type Result = boolean | undefined

}
