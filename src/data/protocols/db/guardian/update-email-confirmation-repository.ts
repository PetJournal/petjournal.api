export interface UpdateEmailConfirmationRepository {
  updateEmailConfirmation: (userId: UpdateEmailConfirmationRepository.Params) => Promise<UpdateEmailConfirmationRepository.Result>
}

export namespace UpdateEmailConfirmationRepository {
  export type Params = string

  export type Result = boolean
}
