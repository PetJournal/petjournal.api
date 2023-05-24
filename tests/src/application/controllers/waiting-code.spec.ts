import { WaitingCodeController } from '@/application/controllers/waiting-code'
import { MissingParamError } from '@/application/errors'
import { badRequest } from '@/application/helpers/http'

describe('WaitingCode Controller', () => {
  describe('validations tests', () => {
    it('should return bad request if no email is provided', async () => {
      const sut = new WaitingCodeController()
      const httpRequest = {
        body: {}
      }

      const httpResponse = await sut.handle(httpRequest)

      expect(httpResponse).toEqual(badRequest(new MissingParamError('email')))
    })

    it('should return bad request if no forgetPasswordCode is provided', async () => {
      const sut = new WaitingCodeController()
      const httpRequest = {
        body: {
          email: 'valid_email'
        }
      }

      const httpResponse = await sut.handle(httpRequest)

      expect(httpResponse).toEqual(badRequest(new MissingParamError('forgetPasswordCode')))
    })
  })
})
