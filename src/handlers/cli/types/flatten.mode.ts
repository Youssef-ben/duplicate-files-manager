/** PROGRESS SUMMARY OF FLATTENING **/
export type FlatteningProgressSummary = {
  type: string;
  action: string;
  scanned: number;
  staged: number;
  report_path: string;
};

/** RESULT OF FLATTENING **/
//===============================================
export type FlatteningResults = {
  root: string;
  results: string;
  total_scanned: number;
  total_staged: number;
  total_bytes: number;
};
//===============================================
