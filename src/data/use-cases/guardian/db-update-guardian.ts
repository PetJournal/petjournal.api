import { NotAcceptableError } from '@/application/errors'
import { type DeleteFileStorage, type FileStorage, type LoadGuardianByIdRepository, type UpdateGuardianRepository } from '@/data/protocols'
import { type UpdateGuardian } from '@/domain/use-cases'

export class DbUpdateGuardian implements UpdateGuardian {
  private readonly guardianRepository: LoadGuardianByIdRepository & UpdateGuardianRepository
  private readonly fileStorage: FileStorage & DeleteFileStorage

  constructor ({ guardianRepository, fileStorage }: UpdateGuardian.Dependencies) {
    this.guardianRepository = guardianRepository
    this.fileStorage = fileStorage
  }

  async update (guardianData: UpdateGuardian.Params): Promise<UpdateGuardian.Result> {
    const guardian = await this.guardianRepository.loadById(guardianData.guardianId)
    if (!guardian) {
      return {
        isSuccess: false,
        error: new NotAcceptableError('userId')
      }
    }

    let finalImage: string = ''
    if (guardianData.image) {
      const currentImage = guardian.image
      const updatedImage = await this.fileStorage.save({ file: guardianData.image, fileName: `images/guardian-${guardian?.id}-${Math.trunc(Date.now() / 1000)}` })
      if (!updatedImage) {
        return {
          isSuccess: false,
          error: new NotAcceptableError('update image failed')
        }
      }
      if (currentImage) {
        await this.fileStorage.delete({ fileUrlOrPath: currentImage })
      }
      finalImage = updatedImage
    }
    if (!guardianData.image) {
      finalImage = guardian.image
    }

    const guardianUpdateResult = await this.guardianRepository.update({
      guardianId: guardian.id,
      firstName: guardianData.firstName ? guardianData.firstName : guardian.firstName,
      lastName: guardianData.lastName ? guardianData.lastName : guardian.lastName,
      phone: guardianData.phone ? guardianData.phone : guardian.phone,
      image: finalImage
    })

    return {
      isSuccess: true,
      data: guardianUpdateResult
    }
  }
}
