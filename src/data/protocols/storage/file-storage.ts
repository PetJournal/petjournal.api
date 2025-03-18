export interface FileStorage {
  save: (file: Buffer, fileName: string) => Promise<string>
}
