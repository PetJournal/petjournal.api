export interface Authentication {
  auth: (identifier: string, password: string) => Promise<string>
}
