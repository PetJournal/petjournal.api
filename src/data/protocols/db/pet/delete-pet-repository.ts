export interface DeletePetByIdRepository {
  deleteById: (petId: DeletePetByIdRepository.Params) => Promise<DeletePetByIdRepository.Result>
}

export namespace DeletePetByIdRepository {
  export type Params = string

  export type Result = boolean | undefined
}
