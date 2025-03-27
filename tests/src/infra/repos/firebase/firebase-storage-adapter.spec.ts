import { FirebaseStorageAdapter } from '@/infra/repos/firebase'
import firebase from 'firebase/storage'

jest.mock('firebase/app', () => ({
  initializeApp: jest.fn().mockReturnValue({ fakeApp: true })
}))

jest.mock('firebase/storage', () => ({
  getStorage: jest.fn().mockReturnValue({ fakeStorage: true }),
  ref: jest.fn().mockReturnValue({ fakeRef: true }),
  uploadBytes: jest.fn(),
  getDownloadURL: jest.fn()
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
  const params = { file, fileName }

  it('Should call getStorage with correct value', async () => {
    const { sut } = makeSut()
    const getStorageSpy = jest.spyOn(firebase, 'getStorage')

    await sut.save(params)

    expect(getStorageSpy).toHaveBeenCalledWith({ fakeApp: true })
  })

  it('Should call ref with correct value', async () => {
    const { sut } = makeSut()
    const refSpy = jest.spyOn(firebase, 'ref')

    await sut.save(params)

    expect(refSpy).toHaveBeenCalledWith({ fakeStorage: true }, fileName)
  })

  it('Should call uploadBytes with correct values', async () => {
    const { sut } = makeSut()
    const uploadBytesSpy = jest.spyOn(firebase, 'uploadBytes')

    await sut.save(params)

    expect(uploadBytesSpy).toHaveBeenCalledWith({ fakeRef: true }, file)
  })

  it('Should call getDownloadURL with correct value', async () => {
    const { sut } = makeSut()
    const getDownloadURLSpy = jest.spyOn(firebase, 'getDownloadURL')

    await sut.save(params)

    expect(getDownloadURLSpy).toHaveBeenCalledWith({ fakeRef: true })
  })

  it('Should return a url on success', async () => {
    const { sut } = makeSut()
    jest.spyOn(firebase, 'getDownloadURL').mockResolvedValueOnce('any_url')

    const result = await sut.save(params)

    expect(result).toBe('any_url')
  })
})
