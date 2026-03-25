export type GlobalApi = {
  openFolder: () => Promise<string | null>
  /** Opens a file with the OS default application (e.g. VLC for video the in-app player cannot decode). */
  openFilePath: (filePath: string) => Promise<void>
  getPathForFile: (file: File) => string
  writeJsonFile: <T>(name: string, data: T) => Promise<string>
  readJsonFile: <T>(name: string, filePath?: string) => Promise<T>
}
