import { type DeleteFileStorage, type FileStorage } from '@/data/protocols'
import * as admin from 'firebase-admin'
import * as mime from 'mime-types'

export class FirebaseStorageAdapter implements FileStorage, DeleteFileStorage {
  private readonly bucket: any

  constructor (projectId: string, storageBucket: string, firebaseServiceAccount: string) {
    if (!admin.apps.length) {
      const buffer = Buffer.from(firebaseServiceAccount, 'base64')
      const firebaseServiceAccountJson = JSON.parse(buffer.toString('utf-8'))
      admin.initializeApp({
        credential: admin.credential.cert(firebaseServiceAccountJson),
        projectId,
        storageBucket
      })
    }
    this.bucket = admin.storage().bucket(storageBucket)
  }

  async save ({ file, fileName }: FileStorage.Params): Promise<FileStorage.Result> {
    const fileRef = this.bucket.file(fileName)
    const mimeType = mime.lookup(fileName) || 'application/octet-stream'
    await fileRef.save(file, {
      metadata: {
        contentType: mimeType
      }
    })

    const [url] = await fileRef.getSignedUrl({
      action: 'read',
      expires: '03-09-2500'
    })

    return url
  }

  async delete ({ fileUrlOrPath }: DeleteFileStorage.Params): Promise<DeleteFileStorage.Result> {
    const path = this.getPathFromUrl(fileUrlOrPath) ?? fileUrlOrPath
    const fileRef = this.bucket.file(path)

    try {
      await fileRef.delete()
    } catch (error: any) {
      throw new Error('do not delete file on fileStorage', error)
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
