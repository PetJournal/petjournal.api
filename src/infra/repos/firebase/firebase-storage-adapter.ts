import { type FileStorage } from '@/data/protocols'
import { type FirebaseApp, initializeApp } from 'firebase/app'
import { getStorage, ref, uploadBytes } from 'firebase/storage'

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

    await uploadBytes(storageRef, file)

    return ''
  }
}
