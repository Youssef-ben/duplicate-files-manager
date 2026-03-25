/** PROGRESS SUMMARY OF DUPLICATES **/
export type DuplicatesProgressSummary = {
  type: string
  action: string
  scanned: number
  duplicate_groups: number
  duplicate_files: number
  report_path: string
}

/** RESULT OF DUPLICATES **/
//===============================================
export interface DuplicatesFile {
  path: string
  size_bytes: number
  modified: string
  is_flagged: boolean
}

export interface DuplicatesGroup {
  hash: string
  files: DuplicatesFile[]
}

export type DuplicatesResults = {
  scanned: number
  duplicate_groups: number
  duplicate_files: number
  total_bytes: number
  duplicate_total_bytes: number
  groups: DuplicatesGroup[]
}
//===============================================

/** DELETE DUPLICATES **/
//===============================================
export type DeleteDuplicates = {
  count: number
  delete: {
    files: string[]
  }
}
//===============================================
