/**
 * Date: 8/25/19
 * Time: 10:40 PM
 * @license MIT (see project's LICENSE file)
 */

/**
 * How graphs allow reuse of identical notes
 */
export enum GraphReusePolicy {
	/**
	 * allow reuse of notes which will loop once a note is re-encountered
	 */
	ALLOW = "allow",
	/**
	 * doesn't allow any note to be reused. Once there are no more paths then traversal ends.
	 */
	DISALLOW = "disallow",
	/**
	 * once all paths are exhausted it resets tracking and allows reuse
	 */
	RESET = "reset"
}

export interface IGraph {
	/**
	 * Traverses the graph and builds an array of note values. During each traversal either a note is added or iteration stops.
	 * The note chosen during iteration is determined by the callback function <param>next</param>.
	 * It returns the array of notes generated.
	 * @param maxCount - maximum number of notes to generate
	 * @param next - chooses the next note to include in the returned sequence
	 * @param reusePolicy
	 * @param startNote - note within the graph from which to start
	 */
	traverse: (param: TraverseGraphParam) => number[];
}

export type RankedNoteList = RankedNoteElement[];
export type RankedNoteElement = {
	count: number,
	note: number
};


export type TraverseNoteSelector = (param: TraverseNoteSelectorParam) => number;
export type TraverseNoteSelectorParam = {
	note: number,
	pathsIn: RankedNoteList,
	pathsOut: RankedNoteList
};

export type TraverseGraphParam = {
	maxCount: number,
	next?: TraverseNoteSelector,
	reusePolicy?: GraphReusePolicy,
	startNote: number
};
