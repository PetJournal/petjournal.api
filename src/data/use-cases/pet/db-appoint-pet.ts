import { NotAcceptableError } from '@/application/errors'
import { type LoadSizeByNameRepository, type LoadBreedByNameRepository, type LoadSpecieByNameRepository } from '@/data/protocols'
import { type Breed } from '@/domain/models/breed'
import { type Size } from '@/domain/models/size'
import { type Specie } from '@/domain/models/specie'
import { type ResultResponse } from '@/domain/types/result'
import { type AppointPet } from '@/domain/use-cases'

export class DbAppointPet implements AppointPet {
  private readonly specieRepository: LoadSpecieByNameRepository
  private readonly breedRepository: LoadBreedByNameRepository
  private readonly sizeRepository: LoadSizeByNameRepository

  constructor ({
    specieRepository,
    breedRepository,
    sizeRepository
  }: AppointPet.Dependencies) {
    this.specieRepository = specieRepository
    this.breedRepository = breedRepository
    this.sizeRepository = sizeRepository
  }

  async appoint (params: AppointPet.Params): Promise<AppointPet.Result> {
    const specieResult = await this.getSpecie(params.specieName)
    const breedResult = await this.getBreed(params.breedName, specieResult)
    if (!breedResult.isSuccess) {
      return {
        isSuccess: false,
        error: breedResult.error
      }
    }
    const sizeResult = await this.getSize(params.size, specieResult)
    if (!sizeResult.isSuccess) {
      return {
        isSuccess: false,
        error: sizeResult.error
      }
    }
    const castrated = this.setCastrated(specieResult.specie.name, params.castrated)
    return {
      isSuccess: true,
      data: {
        specie: specieResult.specie,
        specieAlias: specieResult.specieAlias,
        breed: breedResult.data.breed,
        breedAlias: breedResult.data.breedAlias,
        size: sizeResult.data.size,
        castrated
      }
    }
  }

  private async getSpecie (specieName: string): Promise<SpecieResult> {
    const specie = await this.specieRepository.loadByName(specieName)
    if (!specie) {
      const otherSpecie = await this.specieRepository.loadByName('Outros')
      return {
        ...otherSpecie,
        specie: otherSpecie as Specie & { id: string },
        specieAlias: specieName
      }
    }
    if (specie.name === 'Outros') {
      return {
        specie,
        specieAlias: 'Outros'
      }
    }
    return {
      specie,
      specieAlias: undefined
    }
  }

  private async getBreed (breedName: string, specieResult: SpecieResult): Promise<BreedResult> {
    const breed = await this.breedRepository.loadByName(breedName)

    if (!breed) {
      const defaultBreedName = this.isCatOrDog(specieResult.specie.name)
        ? `Outra raça ${specieResult.specie.name}`
        : specieResult.specie.name === 'Outros'
          ? 'Sem raça'
          : `Sem raça ${specieResult.specie.name}`

      const defaultBreed = await this.breedRepository.loadByName(defaultBreedName)
      return {
        isSuccess: true,
        data: {
          breed: defaultBreed as Breed & { id: string },
          breedAlias: breedName,
          specieId: defaultBreed?.specieId as string
        }
      }
    }

    if (breed.specieId !== specieResult.specie.id) {
      return { isSuccess: false, error: new NotAcceptableError('breed') }
    }
    const isOtherBreed = breed.name.startsWith('Outra raça')

    return {
      isSuccess: true,
      data: {
        breed: breed as Breed & { id: string },
        breedAlias: isOtherBreed ? breed.name : '',
        specieId: breed.specieId
      }
    }
  }

  private isCatOrDog (specieName: string): boolean {
    if (specieName === 'Cachorro' || specieName === 'Gato') {
      return true
    }
    return false
  }

  private async getSize (sizeName: string, specieResult: SpecieResult): Promise<SizeResult> {
    const size = await this.sizeRepository.loadByName(sizeName)

    if (!size) {
      return { isSuccess: false, error: new NotAcceptableError('size') }
    }

    if (size.specieId !== specieResult.specie.id) {
      return { isSuccess: false, error: new NotAcceptableError('size') }
    }

    return {
      isSuccess: true,
      data: {
        size: size as Size & { id: string },
        specieId: size.specieId
      }
    }
  }

  private setCastrated (specieName: string, castrated: boolean): boolean {
    if (this.isCatOrDog(specieName) && castrated) {
      return true
    }
    return false
  }
}

type SpecieResult = {
  specie: Specie & { id: string }
  specieAlias: string | undefined
}
type BreedResult = ResultResponse<{
  breed: Breed & { id: string }
  breedAlias: string
  specieId: string
}>

type SizeResult = ResultResponse<{
  size: Size & { id: string }
  specieId: string
}>
