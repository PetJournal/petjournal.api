import { DocBuilder } from '@/main/docs/utils/doc-builder'

describe('DocBuilder', () => {
  describe('static methods', () => {
    it('Should create a instance for GET', () => {
      const sut = DocBuilder.getBuilder()

      expect(sut).toBeInstanceOf(DocBuilder)
    })
  })
})
