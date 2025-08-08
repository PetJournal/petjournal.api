import { DocBuilder } from '@/main/docs/utils/doc-builder'

describe('DocBuilder', () => {
  describe('static methods', () => {
    it('Should create a instance for GET', () => {
      const sut = DocBuilder.getBuilder()

      expect(sut).toBeInstanceOf(DocBuilder)
    })

    it('Should create a instance for POST', () => {
      const sut = DocBuilder.postBuilder()

      expect(sut).toBeInstanceOf(DocBuilder)
    })

    it('Should create a instance for PUT', () => {
      const sut = DocBuilder.putBuilder()

      expect(sut).toBeInstanceOf(DocBuilder)
    })

    it('Should create a instance for DELETE', () => {
      const sut = DocBuilder.deleteBuilder()

      expect(sut).toBeInstanceOf(DocBuilder)
    })

    it('Should create a instance for PATCH', () => {
      const sut = DocBuilder.patchBuilder()

      expect(sut).toBeInstanceOf(DocBuilder)
    })
  })

  it('Should build a doc with tags', () => {
    const sut = DocBuilder.postBuilder()
      .addTags(['tag1', 'tag2'])
      .build()

    expect(sut).toEqual({
      post: {
        tags: ['tag1', 'tag2']
      }
    })
  })
})
