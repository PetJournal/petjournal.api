import { prisma as db } from './prisma'
import { type LoadTagByIdRepository, type AddTagRepository, type UpdateTagRepository, type LoadTagsRepository } from '@/data/protocols'

export class TagRepository implements AddTagRepository, LoadTagByIdRepository, UpdateTagRepository, LoadTagsRepository {
  async add (params: AddTagRepository.Params): Promise<AddTagRepository.Result> {
    try {
      const tag = await db.tag.create({
        data: {
          name: params.name,
          color: params.color
        },
        select: {
          id: true,
          name: true,
          color: true
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
      },
      select: {
        id: true,
        name: true,
        color: true
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

  async loadAll (): Promise<LoadTagsRepository.Result> {
    const tags = await db.tag.findMany({
      select: {
        id: true,
        name: true,
        color: true
      }
    })
    return tags
  }
}
