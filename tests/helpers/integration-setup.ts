import { FirebaseStorageAdapter } from '@/infra/repos/firebase'
import { MailerooAdapter } from '@/infra/communication'

const testPath = expect.getState().testPath

if (testPath && testPath.endsWith('.test.ts')) {
  jest.spyOn(FirebaseStorageAdapter.prototype, 'save').mockResolvedValue('https://storage.googleapis.com/mock-bucket/images/mock-file.jpg')
  jest.spyOn(FirebaseStorageAdapter.prototype, 'delete').mockResolvedValue(undefined)
  jest.spyOn(MailerooAdapter.prototype, 'send').mockResolvedValue(true)
}
