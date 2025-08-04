type Response = {
  description: string
  content?: {
    'application/json': {
      schema: object
      example?: object
    }
  }
}

type Content = {
  tags: string[]
  summary: string
  description: string
  requestBody?: {
    required: boolean
    content: {
      'application/json': {
        schema: string | object
        example?: object
      }
    }
  }
  responses: Record<number, Response>
}

type HttpMethod = 'post' | 'get' | 'put' | 'delete' | 'patch'

type SwaggerDoc<T extends HttpMethod> = {
  [K in T]: Content;
}

export class DocBuilder<T extends HttpMethod> {
  private readonly content: SwaggerDoc<T> = {} as unknown as SwaggerDoc<T>
  private readonly method: T

  private constructor (method: T) {
    this.method = method
    this.content[this.method] = {} as unknown as Content
  }

  static postBuilder (): DocBuilder<'post'> {
    return new DocBuilder('post')
  }

  static getBuilder (): DocBuilder<'get'> {
    return new DocBuilder('get')
  }

  static putBuilder (): DocBuilder<'put'> {
    return new DocBuilder('put')
  }

  static deleteBuilder (): DocBuilder<'delete'> {
    return new DocBuilder('delete')
  }

  static patchBuilder (): DocBuilder<'patch'> {
    return new DocBuilder('patch')
  }

  addTags (tags: string[]): DocBuilder<T> {
    this.content[this.method].tags = tags
    return this
  }

  addSummary (summary: string = ''): DocBuilder<T> {
    this.content[this.method].summary = summary
    return this
  }

  addDescription (description: string = ''): DocBuilder<T> {
    this.content[this.method].description = description
    return this
  }

  addBody (schemaOrRef: string | object, required: boolean = true, example?: object): DocBuilder<T> {
    const schema = typeof schemaOrRef === 'string' ? { $ref: schemaOrRef } : schemaOrRef

    this.content[this.method].requestBody = {
      required,
      content: {
        'application/json': {
          schema,
          example
        }
      }
    }
    return this
  }

  addResponse (statusCode: number, schema: Response): DocBuilder<T> {
    if (!this.content[this.method].responses) {
      this.content[this.method].responses = {}
    }

    this.content[this.method].responses[statusCode] = schema

    return this
  }

  addBadRequestResponse (): DocBuilder<T> {
    this.addResponse(400, {
      description: 'Invalid request',
      content: {
        'application/json': {
          schema: {
            $ref: '#/schemas/error'
          },
          example: {
            error: 'Invalid param: example_param'
          }
        }
      }
    })

    return this
  }

  addConflictResponse (): DocBuilder<T> {
    this.addResponse(409, {
      description: 'Conflict request',
      content: {
        'application/json': {
          schema: {
            $ref: '#/schemas/error'
          },
          example: {
            error: 'Phone or Email already registered'
          }
        }
      }
    })

    return this
  }

  addUnauthorizedResponse (): DocBuilder<T> {
    this.addResponse(401, {
      description: 'Unauthorized',
      content: {
        'application/json': {
          schema: {
            $ref: '#/schemas/error'
          },
          example: {
            error: 'Unauthorized'
          }
        }
      }
    })

    return this
  }

  addServerErrorResponse (): DocBuilder<T> {
    this.addResponse(500, {
      description: 'Internal server error',
      content: {
        'application/json': {
          schema: {
            $ref: '#/schemas/error'
          },
          example: {
            error: 'Internal server error. An unexpected error happened. Please try again in a moment.'
          }
        }
      }
    })

    return this
  }

  build (): SwaggerDoc<T> {
    return this.content
  }
}
