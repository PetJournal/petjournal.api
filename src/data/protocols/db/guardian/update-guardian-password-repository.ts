export interface UpdateGuardianPasswordRepository {
  updatePassword: (params: UpdateGuardianPasswordRepository.Params) => Promise<UpdateGuardianPasswordRepository.Result>
}

export namespace UpdateGuardianPasswordRepository {
  export type Params = {
    userId: string
    password: string
  }

  export type Result = boolean
}
