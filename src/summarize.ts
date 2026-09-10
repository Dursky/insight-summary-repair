import type {Insight, SummarizedInsight, SummarizeOptions, SummaryResult} from "./types"
import {normalizeLabel} from "./label"

interface Group {
	displayLabel: string
	confidence: number | null
}

export function summarize(items: Insight[], options: SummarizeOptions = {}): SummaryResult {
	const minConfidence = options.minConfidence ?? 0

	let droppedBlankLabels = 0
	let missingConfidenceCount = 0
	const groups = new Map<string, Group>()

	for (const item of items) {
		const trimmedLabel = item.label.trim()
		if (trimmedLabel === "") {
			droppedBlankLabels += 1
			continue
		}
		if (item.confidence === undefined) {
			missingConfidenceCount += 1
		}

		const key = normalizeLabel(trimmedLabel)
		const existing = groups.get(key)
		if (!existing) {
			groups.set(key, {displayLabel: trimmedLabel, confidence: item.confidence ?? null})
			continue
		}
		if (
			item.confidence !== undefined &&
			(existing.confidence === null || item.confidence > existing.confidence)
		) {
			existing.confidence = item.confidence
		}
	}

	let droppedBelowThreshold = 0
	const insights: SummarizedInsight[] = []

	for (const group of groups.values()) {
		if (group.confidence !== null && group.confidence < minConfidence) {
			droppedBelowThreshold += 1
			continue
		}
		insights.push({label: group.displayLabel, confidence: group.confidence})
	}

	insights.sort((a, b) => a.label.localeCompare(b.label))

	return {
		insights,
		droppedBlankLabels,
		droppedBelowThreshold,
		missingConfidenceCount,
	}
}
