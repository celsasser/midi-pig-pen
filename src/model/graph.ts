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

export type RankedNoteElement = {count:number, note:number};
export type RankedNoteList = RankedNoteElement[];

export type TraverseGraphIterator = (param: {note:number, pathsIn:RankedNoteList, pathsOut:RankedNoteList}) => number;
