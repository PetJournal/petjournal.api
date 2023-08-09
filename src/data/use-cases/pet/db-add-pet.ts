import { NotFoundError } from '@/application/errors'
import { type AddPet } from '@/domain/use-cases'

export class DbAddPet implements AddPet {
  async add (petData: AddPet.Params): Promise<AddPet.Result> {
    return {
      isSuccess: false,
      error: new NotFoundError('userId')
    }
  }
}
