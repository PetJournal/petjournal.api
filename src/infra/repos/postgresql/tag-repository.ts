import { type DeleteTagRepository } from '@/data/protocols/db/tag/delete-tag-repository'
import { prisma as db } from './prisma'
import { type LoadTagByIdRepository, type AddTagRepository, type UpdateTagRepository, type LoadTagsRepository } from '@/data/protocols'

export class TagRepository implements AddTagRepository, LoadTagByIdRepository, UpdateTagRepository, LoadTagsRepository, DeleteTagRepository {
  async add (params: AddTagRepository.Params): Promise<AddTagRepository.Result> {
    try {
      const tag = await db.tag.create({
        data: {
          guardianId: params.guardianId,
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
      }
    })
    return tag
  }

  async loadAll (guardianId: LoadTagByIdRepository.Param): Promise<LoadTagsRepository.Result> {
    const tags = await db.tag.findMany({
      where: {
        guardianId
      }
    })
    return tags
  }

  async deleteById (tagId: DeleteTagRepository.Param): Promise<DeleteTagRepository.Result> {
    try {
      await db.tag.delete({ where: { id: tagId } })
      return true
    } catch (error) {
      return false
    }
  }
}
