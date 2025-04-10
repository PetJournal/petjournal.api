import { prisma as db } from './prisma'
import { type LoadTagByIdRepository, type AddTagRepository, type UpdateTagRepository } from '@/data/protocols'

export class TagRepository implements AddTagRepository, LoadTagByIdRepository, UpdateTagRepository {
  async add (params: AddTagRepository.Params): Promise<AddTagRepository.Result> {
    try {
      const tag = await db.tag.create({
        data: {
          name: params.name,
          color: params.color
        }
      })
      return tag
    } catch (error) {
      return undefined
    }
  }

  async loadById (tagId: LoadTagByIdRepository.Param): Promise<LoadTagByIdRepository.Result> {
    const tag = await db.tag.findFirst({
      where: {
        id: tagId
      }
    })
    return tag
  }

  async update (params: UpdateTagRepository.Params): Promise<UpdateTagRepository.Result> {
    const { name, id } = params
    const tag = await db.tag.update({
      data: {
        name
      },
      where: {
        id
      },
      select: {
        id: true,
        name: true,
        color: true
      }
    })
    return tag
  }
}
