export type ScanningSummary = {
  type: string
  action: string
  total_files: number
  total_bytes: number
  folder_count: number
  report_path: string
}

/** RESULT OF SCANNING **/
//===============================================
export interface ScanningFolderEntry {
  path: string
  direct_files: number
  recursive_bytes: number
}

export type ScanningResults = {
  root: string
  total_files: number
  total_bytes: number
  folder_count: number
  report_path: string
  folders: ScanningFolderEntry[]
}
//===============================================
