/** PROGRESS SUMMARY OF DUPLICATES **/
export type OrganizeProgressSummary = {
  type: string
  action: string
  mode: string
  scanned: number
  staged: number
  organized: number
  errors: number
}

/** RESULT OF ORGANIZE **/
//===============================================
export type OrganizeResults = {
  type: string
  action: string
  mode: string
  scanned: number
  staged: number
  organized: number
}
//===============================================
