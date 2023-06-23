export interface UpdateGuardianPasswordRepository {
  updatePassword: (userData: UpdateGuardianPasswordRepository.Params) => Promise<UpdateGuardianPasswordRepository.Result>
}

export namespace UpdateGuardianPasswordRepository {
  export interface Params { id: string, password: string }
  export type Result = boolean
}
