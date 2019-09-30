/**
 * Date: 9/16/19
 * Time: 10:41 PM
 * @license MIT (see project's LICENSE file)
 */

import * as _ from "lodash";
import {MidiIoEventSubtype} from "midi-file-io";
import {
	IGraph,
	MidiSequence,
	RankedNoteElement,
	TraverseAttributes,
	TraverseGraphParam,
	TraverseNoteGraph
} from "../model";

/**
 * Each unique note is tracked in its own node.
 */
interface Node {
	note: number;
	nodeIn?: Node;
	nodeOut?: Node;
}

/**
 * A uni-directional graph of notes
 */
export class SequenceGraph implements IGraph {
	public readonly name: string;
	private _sequence: number[] = [];

	constructor(name: string) {
		this.name = name;
	}

	/**
	 * Adds sequence's path to our graph
	 */
	public addSequence(sequence: MidiSequence, {
		firstIndex = 0,
		interval = 1
	}): void {
		// we are only interested in note-on events
		const noteEvents = sequence.events
			.filter(event => event.subtype === MidiIoEventSubtype.noteOn);
		for (let index = firstIndex; index < noteEvents.length; index += interval) {
			this._sequence.push(noteEvents[index].noteNumber as number);
		}
	}

	public getAllNotes(): RankedNoteElement[] {
		const initial: {[key: number]: number} = {};
		return _.chain(this._sequence)
			.reduce((result, note) => {
				if (note in result) {
					result[note]++;
				} else {
					result[note] = 0;
				}
				return result;
			}, initial)
			.map((value, note) => {
				return {
					count: value,
					note: Number(note)
				};
			})
			.sortBy(node => 0 - node.count)
			.value();
	}

	/**
	 * Gets list of notes in insert order
	 */
	public getInsertSequence(): number[] {
		return this._sequence;
	}

	public traverse({
		attributes = 0,
		maxCount,
		next,
		startNote
	}: TraverseGraphParam): number[] {
		const graph = this._buildGraph(Boolean(attributes & TraverseAttributes.Circular));
		const domain = (attributes && TraverseAttributes.DisallowReuse)
			? this.getAllNotes()
			: [];
		let used: Set<number> = new Set<number>();

		const _getNext = (node: Node): Node | undefined => {
			const param: TraverseNoteGraph = {
				note: node.note,
				pathsIn: [],
				pathsOut: []
			};
			if (node.nodeIn) {
				param.pathsIn.push({
					count: 1,
					id: node.nodeIn,
					note: node.nodeIn.note
				});
			}
			if (node.nodeOut) {
				param.pathsOut.push({
					count: 1,
					id: node.nodeOut,
					note: node.nodeOut.note
				});
			}
			const result = next(param);
			return (result)
				? result.id
				: undefined;
		};

		const _push = (node?: Node, result: number[] = []): number[] => {
			if (node === undefined || result.length === maxCount) {
				return result;
			} else {
				if (attributes & TraverseAttributes.DisallowReuse) {
					if (used.size === domain.length) {
						if (attributes & TraverseAttributes.ResetAfterExhaust) {
							used = new Set<number>();
						} else {
							return result;
						}
					}
					if (used.has(node.note) === false) {
						result.push(node.note);
					}
					return _push(_getNext(node), result);
				} else {
					result.push(node.note);
					return _push(_getNext(node), result);
				}
			}
		};
		return _push(graph);
	}

	private _buildGraph(circular: boolean): Node | undefined {
		if (this._sequence.length === 0) {
			return undefined;
		} else {
			const first: Node = {
				note: this._sequence[0]
			};
			first.nodeIn = (circular) ? first : undefined;
			first.nodeOut = (circular) ? first : undefined;
			const _add = (index: number, prev: Node): Node | undefined => {
				if (index < this._sequence.length) {
					const node: Node = {
						nodeIn: prev,
						note: this._sequence[index]
					};
					node.nodeOut = _add(index + 1, node);
					if (circular && node.nodeOut === undefined) {
						node.nodeOut = first;
					}
					return node;
				}
				return undefined;
			};
			return _add(1, first) as Node;
		}
	}
}
