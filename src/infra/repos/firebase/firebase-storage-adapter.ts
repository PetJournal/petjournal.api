import { type FileStorage } from '@/data/protocols'
import { type FirebaseApp, initializeApp } from 'firebase/app'
import { getDownloadURL, getMetadata, getStorage, ref, uploadBytes } from 'firebase/storage'

export class FirebaseStorageAdapter implements FileStorage {
  private readonly app: FirebaseApp

  constructor (projectId: string, storageBucket: string) {
    this.app = initializeApp({
      projectId,
      storageBucket
    })
  }

  async save ({ file, fileName }: FileStorage.Params): Promise<FileStorage.Result> {
    const storage = getStorage(this.app)
    const storageRef = ref(storage, fileName)

    try {
      await getMetadata(storageRef)
    } catch {
      await uploadBytes(storageRef, file)
    }

    const fileUrl = await getDownloadURL(storageRef)
    return fileUrl
  }
}
