import { type DeleteFileStorage, type FileStorage } from '@/data/protocols'
import { type FirebaseApp, initializeApp } from 'firebase/app'
import { deleteObject, getDownloadURL, getMetadata, getStorage, ref, uploadBytes } from 'firebase/storage'

export class FirebaseStorageAdapter implements FileStorage, DeleteFileStorage {
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

  async delete ({ fileUrlOrPath }: DeleteFileStorage.Params): Promise<DeleteFileStorage.Result> {
    const storage = getStorage(this.app)
    const path = this.getPathFromUrl(fileUrlOrPath) ?? fileUrlOrPath
    const storageRef = ref(storage, path)

    try {
      await deleteObject(storageRef)
    } catch (error: any) {
      throw new Error('do not delete file on fileStorage')
    }
  }

  private getPathFromUrl (url: string): string | null {
    const baseUrl = 'firebasestorage.googleapis.com'
    if (!url.includes(baseUrl)) return null

    try {
      const parts = url.split('/o/')
      if (parts.length < 2) return null

      const pathAndParams = parts[1]
      const path = pathAndParams.split('?')[0]
      return decodeURIComponent(path)
    } catch (error) {
      return null
    }
  }
}
