import { FirebaseStorageAdapter } from '@/infra/repos/firebase'
import firebaseStorage from 'firebase/storage'

jest.mock('firebase/app', () => ({
  initializeApp: jest.fn().mockReturnValue({ fakeApp: true })
}))

jest.mock('firebase/storage', () => ({
  getStorage: jest.fn()
}))

interface SutTypes {
  sut: FirebaseStorageAdapter
}

const makeSut = (): SutTypes => {
  const projectId = 'any_project_id'
  const storageBucket = 'any_storage_bucket'
  const sut = new FirebaseStorageAdapter(projectId, storageBucket)
  return { sut }
}

describe('FirebaseStorageAdapter', () => {
  const file = Buffer.from('any_file')
  const fileName = 'any_file_name'

  it('Should call getStorage with correct value', async () => {
    const { sut } = makeSut()
    const getStorageSpy = jest.spyOn(firebaseStorage, 'getStorage')

    await sut.save(file, fileName)

    expect(getStorageSpy).toHaveBeenCalledWith({ fakeApp: true })
  })
})
