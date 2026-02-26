import { FirebaseStorageAdapter } from '@/infra/repos/firebase'

const mockSave = jest.fn().mockResolvedValue(undefined)
const mockGetSignedUrl = jest.fn().mockResolvedValue(['any_url'])
const mockDelete = jest.fn().mockResolvedValue(undefined)

const mockFile = jest.fn().mockReturnValue({
  save: mockSave,
  getSignedUrl: mockGetSignedUrl,
  delete: mockDelete
})

const mockBucket = jest.fn().mockReturnValue({
  file: mockFile
})

jest.mock('firebase-admin', () => ({
  apps: [],
  initializeApp: jest.fn(),
  credential: {
    cert: jest.fn().mockReturnValue('any_cert')
  },
  storage: jest.fn().mockImplementation(() => ({
    bucket: mockBucket
  }))
}))

interface SutTypes {
  sut: FirebaseStorageAdapter
}

const makeSut = (): SutTypes => {
  const projectId = 'any_project_id'
  const storageBucket = 'any_storage_bucket'
  const fakeAccountJson = JSON.stringify({ project_id: 'fake_id' })
  const firebaseServiceAccountBase64 = Buffer.from(fakeAccountJson).toString('base64')
  const sut = new FirebaseStorageAdapter(projectId, storageBucket, firebaseServiceAccountBase64)
  return { sut }
}

describe('FirebaseStorageAdapter', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  describe('Save method', () => {
    const file = Buffer.from('any_file')
    const fileName = 'any_file_name'
    const params = { file, fileName }

    it('Should call bucket.file with correct fileName', async () => {
      const { sut } = makeSut()
      await sut.save(params)
      expect(mockFile).toHaveBeenCalledWith(fileName)
    })

    it('Should call file.save with correct file buffer', async () => {
      const { sut } = makeSut()
      await sut.save(params)
      expect(mockSave).toHaveBeenCalledWith(file, expect.any(Object))
    })

    it('Should call getSignedUrl to generate file link', async () => {
      const { sut } = makeSut()
      await sut.save(params)
      expect(mockGetSignedUrl).toHaveBeenCalledWith(expect.objectContaining({
        action: 'read'
      }))
    })

    it('Should throw if file.save throws', async () => {
      const { sut } = makeSut()
      mockSave.mockRejectedValueOnce(new Error('firebase_error'))

      const promise = sut.save(params)
      await expect(promise).rejects.toThrow(new Error('firebase_error'))
    })
  })
})
