import { type FileStorage } from '@/data/protocols'
import { type FirebaseApp, initializeApp } from 'firebase/app'
import { getStorage, ref } from 'firebase/storage'

export class FirebaseStorageAdapter implements FileStorage {
  private readonly app: FirebaseApp

  constructor (projectId: string, storageBucket: string) {
    this.app = initializeApp({
      projectId,
      storageBucket
    })
  }

  async save (file: Buffer, fileName: string): Promise<string> {
    const storage = getStorage(this.app)
    ref(storage, fileName)

    return ''
  }
}
