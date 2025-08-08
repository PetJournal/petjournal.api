import { DocBuilder } from '@/main/docs/utils/doc-builder'

interface SutTypes {
  sut: DocBuilder<'post'>
}

const makeSut = (): SutTypes => {
  const sut = DocBuilder.postBuilder()
  return {
    sut
  }
}

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
    const { sut } = makeSut()

    const result = sut.addTags(['tag1', 'tag2']).build()

    expect(result).toEqual({
      post: {
        tags: ['tag1', 'tag2']
      }
    })
  })

  it('Should build a doc with summary', () => {
    const { sut } = makeSut()

    const result = sut.addSummary('Test Summary').build()

    expect(result).toEqual({
      post: {
        summary: 'Test Summary'
      }
    })
  })

  it('Should build a doc with description', () => {
    const { sut } = makeSut()

    const result = sut.addDescription('Test Description').build()

    expect(result).toEqual({
      post: {
        description: 'Test Description'
      }
    })
  })

  it('Should build a doc with body', () => {
    const { sut } = makeSut()

    const schema = {
      type: 'object' as const,
      properties: {
        name: {
          type: 'string'
        }
      },
      required: ['name']
    }
    const result = sut.addBody(schema, true, { name: 'Example' }).build()

    expect(result).toEqual({
      post: {
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  name: {
                    type: 'string'
                  }
                },
                required: ['name']
              },
              example: { name: 'Example' }
            }
          }
        }
      }
    })
  })

  it('Should build a doc with ref schema body', () => {
    const { sut } = makeSut()

    const result = sut.addBody('#/schemas/Example').build()

    expect(result).toEqual({
      post: {
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: { $ref: '#/schemas/Example' }
            }
          }
        }
      }
    })
  })

  it('Should build a doc with json produces', () => {
    const { sut } = makeSut()

    const result = sut.addJsonProduces().build()

    expect(result).toEqual({
      post: {
        produces: ['application/json']
      }
    })
  })

  it('Should build a doc with xml produces', () => {
    const { sut } = makeSut()

    const result = sut.addXmlProduces().build()

    expect(result).toEqual({
      post: {
        produces: ['application/xml']
      }
    })
  })

  it('Should build a doc with multiple produces', () => {
    const { sut } = makeSut()

    const result = sut.addJsonProduces().addXmlProduces().build()

    expect(result).toEqual({
      post: {
        produces: ['application/json', 'application/xml']
      }
    })
  })

  it('Should build a doc with path parameter', () => {
    const { sut } = makeSut()

    const result = sut.addPathParameter('id', 'ID description', 'string', { required: true, format: 'uuid' }).build()

    expect(result).toEqual({
      post: {
        parameters: [{
          name: 'id',
          in: 'path',
          description: 'ID description',
          required: true,
          schema: {
            type: 'string',
            format: 'uuid'
          }
        }]
      }
    })
  })
})
