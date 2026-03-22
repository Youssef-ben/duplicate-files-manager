export type GlobalApi = {
  openFolder: () => Promise<string | null>
  getPathForFile: (file: File) => string
}
