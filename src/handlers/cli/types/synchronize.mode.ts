/** PROGRESS SUMMARY OF COMPARE **/
export interface SynchronizeCompareSummary {
  source_scanned: number
  target_scanned: number
  matching_files: number
  missing_in_target: number
  missing_in_source: number
  report_path: string
}

/** RESULT OF COMPARE **/
//===============================================
export interface SynchronizeFile {
  path: string
  hash: string
  is_flagged: boolean
}

export interface SynchronizeCompareResults {
  source_scanned: number
  target_scanned: number
  matching_files: number
  missing_in_target: SynchronizeFile[]
  missing_in_source: SynchronizeFile[]
}
//===============================================
