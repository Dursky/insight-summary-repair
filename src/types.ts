export interface Insight {
  label: string;
  confidence?: number;
}

export interface SummarizeOptions {
  minConfidence?: number;
}

export interface SummarizedInsight {
  label: string;
  confidence: number | null;
}

export interface SummaryResult {
  insights: SummarizedInsight[];
  droppedBlankLabels: number;
  droppedBelowThreshold: number;
  missingConfidenceCount: number;
}
