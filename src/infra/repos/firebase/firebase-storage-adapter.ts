import { type DeleteFileStorage, type FileStorage } from '@/data/protocols'
import * as admin from 'firebase-admin'
import * as mime from 'mime-types'

export class FirebaseStorageAdapter implements FileStorage, DeleteFileStorage {
  private bucket: any

  constructor (
    private readonly projectId: string,
    private readonly storageBucket: string,
    private readonly firebaseServiceAccount: string
  ) {}

  private getBucket (): any {
    if (!this.bucket) {
      if (!admin.apps.length) {
        if (!this.firebaseServiceAccount) {
          throw new Error('Firebase credentials are not configured.')
        }
        const buffer = Buffer.from(this.firebaseServiceAccount, 'base64')
        const firebaseServiceAccountJson = JSON.parse(buffer.toString('utf-8'))
        admin.initializeApp({
          credential: admin.credential.cert(firebaseServiceAccountJson),
          projectId: this.projectId,
          storageBucket: this.storageBucket
        })
      }
      this.bucket = admin.storage().bucket(this.storageBucket)
    }
    return this.bucket
  }

  async save ({ file, fileName }: FileStorage.Params): Promise<FileStorage.Result> {
    const fileRef = this.getBucket().file(fileName)
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
    const fileRef = this.getBucket().file(path)

    try {
      await fileRef.delete()
    } catch (error: any) {
      throw new Error('do not delete file on fileStorage', error)
    }
  }

  private getPathFromUrl (url: string): string | null {
    try {
      const decodedUrl = decodeURIComponent(url)
      if (decodedUrl.includes('storage.googleapis.com')) {
        const parts = decodedUrl.split('storage.googleapis.com/')
        if (parts.length > 1) {
          const pathWithBucket = parts[1].split('?')[0]
          const pathParts = pathWithBucket.split('/')
          pathParts.shift()
          return pathParts.join('/')
        }
      }
      return null
    } catch (error) {
      return null
    }
  }
}
