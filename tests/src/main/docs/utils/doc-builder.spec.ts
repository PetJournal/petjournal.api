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
  })
})
