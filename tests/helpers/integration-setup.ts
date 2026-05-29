/* eslint-disable @typescript-eslint/no-var-requires */
const testPath = expect.getState().testPath

if (testPath && testPath.endsWith('.test.ts')) {
  const { FirebaseStorageAdapter } = require('@/infra/repos/firebase')
  const { MailerooAdapter } = require('@/infra/communication')

  jest.spyOn(FirebaseStorageAdapter.prototype, 'save').mockResolvedValue('https://storage.googleapis.com/mock-bucket/images/mock-file.jpg')
  jest.spyOn(FirebaseStorageAdapter.prototype, 'delete').mockResolvedValue(undefined)
  jest.spyOn(MailerooAdapter.prototype, 'send').mockResolvedValue(true)
}
