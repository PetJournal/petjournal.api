export interface FileStorage {
  save: (file: Buffer) => Promise<string>
}
