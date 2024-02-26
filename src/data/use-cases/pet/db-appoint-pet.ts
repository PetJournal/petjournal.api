import { NotAcceptableError } from '@/application/errors'
import { type LoadSizeByNameRepository, type LoadBreedByNameRepository, type LoadSpecieByNameRepository } from '@/data/protocols'
import { type Breed } from '@/domain/models/breed'
import { type Size } from '@/domain/models/size'
import { type Specie } from '@/domain/models/specie'
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
    const breedResult = await this.getBreed(params.breedName, specieResult.specie.name)
    if (breedResult.error) {
      return {
        isSuccess: false,
        error: breedResult.error
      }
    }
    const sizeResult = await this.getSize(params.size, specieResult.specie.name)
    if (sizeResult.error) {
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
        breed: breedResult.data?.breed as Breed & { id: string },
        breedAlias: breedResult.data?.breedAlias as string,
        size: sizeResult.data?.size as Size & { id: string },
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

  private async getBreed (breedName: string, specieName: string): Promise<BreedResult> {
    if (this.isCatOrDog(specieName)) {
      const breed = await this.breedRepository.loadByName(breedName)
      if (!breed) {
        const otherBreed = await this.breedRepository.loadByName(`Outra raça ${specieName}`)
        return {
          data: {
            breed: otherBreed as Breed & { id: string },
            breedAlias: breedName,
            specieId: otherBreed?.specieId as string
          }
        }
      }
      if (breed.name === `Outra raça ${specieName}`) {
        return {
          data: {
            breed,
            breedAlias: `Outra raça ${specieName}`,
            specieId: breed.specieId
          }
        }
      }
      const specieResult = await this.getSpecie(specieName)
      if (specieResult.specie.id !== breed.specieId) {
        return {
          error: new NotAcceptableError('breed')
        }
      }
      return {
        data: {
          breed,
          breedAlias: '',
          specieId: breed.specieId
        }
      }
    }
    if (specieName === 'Outros') {
      const otherBreed = await this.breedRepository.loadByName('Sem raça')
      return {
        data: {
          breed: otherBreed as Breed & { id: string },
          breedAlias: '',
          specieId: otherBreed?.specieId as string
        }
      }
    }
    const withoutBreed = await this.breedRepository.loadByName(`Sem raça ${specieName}`)
    return {
      data: {
        breed: withoutBreed as Breed & { id: string },
        breedAlias: '',
        specieId: withoutBreed?.specieId as string
      }
    }
  }

  private isCatOrDog (specieName: string): boolean {
    if (specieName === 'Cachorro' || specieName === 'Gato') {
      return true
    }
    return false
  }

  private async getSize (sizeName: string, specieName: string): Promise<SizeResult> {
    if (this.isCatOrDog(specieName)) {
      const size = await this.sizeRepository.loadByName(sizeName)
      const specieResult = await this.getSpecie(specieName)
      if (specieResult.specie.id !== size?.specieId) {
        return {
          error: new NotAcceptableError('size')
        }
      }
      return {
        data: {
          size: size as Size & { id: string },
          specieId: size?.specieId
        }
      }
    }
    if (specieName === 'Outros') {
      const otherSize = await this.sizeRepository.loadByName('Sem porte')
      return {
        data: {
          size: otherSize as Size & { id: string },
          specieId: otherSize?.specieId as string
        }
      }
    }
    const withoutSize = await this.sizeRepository.loadByName(`Sem porte ${specieName}`)
    return {
      data: {
        size: withoutSize as Size & { id: string },
        specieId: withoutSize?.specieId as string
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

type BreedResult = {
  error?: Error
  data?: {
    breed: Breed & { id: string }
    breedAlias: string | undefined
    specieId: string
  }
}

type SizeResult = {
  error?: Error
  data?: {
    size: Size & { id: string }
    specieId: string
  }
}
