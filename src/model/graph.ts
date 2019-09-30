/**
 * Date: 8/25/19
 * Time: 10:40 PM
 * @license MIT (see project's LICENSE file)
 */

export enum TraverseAttributes {
	Circular = 0x1 << 1,
	/**
	 * doesn't allow any note to be reused. Once there are no more paths then traversal ends.
	 */
	DisallowReuse = 0x1 << 2,
	/**
	 * once all paths are exhausted it resets tracking and allows reuse
	 */
	ResetAfterExhaust = 0x1 << 3
}

export interface IGraph {
	/**
	 * All notes in descending popularity order
	 */
	getAllNotes(): RankedNoteList;

	/**
	 * Gets list of notes in insert order
	 */
	getInsertSequence(): number[];

	/**
	 * Traverses the graph and builds an array of note values. During each traversal either a note is added or iteration stops.
	 * The note chosen during iteration is determined by the callback function <param>next</param>.
	 * It returns the array of notes generated.
	 */
	traverse(param: TraverseGraphParam): number[];
}

export interface RankedNoteElement {
	count: number;
	/**
	 * The idea here is to be able to optionally hold identifying info about this guy.
	 */
	id?: any;
	note: number;
}
export type RankedNoteList = RankedNoteElement[];


export type TraverseNoteGraph = {
	note: number,
	pathsIn: RankedNoteList,
	pathsOut: RankedNoteList
};
export type TraverseNoteSelector = (graph: TraverseNoteGraph) => RankedNoteElement|undefined;

export type TraverseGraphParam = {
	attributes?: TraverseAttributes,
	/**
	 * maximum number of notes to generate
	 */
	maxCount: number,
	/**
	 * chooses the next note to include in the returned sequence
	 */
	next: TraverseNoteSelector,
	/**
	 * note within the graph from which to start.
	 */
	startNote: number
};
