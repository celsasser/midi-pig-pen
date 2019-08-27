/**
 * Date: 8/25/19
 * Time: 9:59 PM
 * @license MIT (see project's LICENSE file)
 */

import * as _ from "lodash";
import {MidiIoEventSubtype} from "midi-file-io";
import {
	GraphReusePolicy,
	MidiSequence,
	RankedNoteList,
	TraverseGraphIterator
} from "../model";


/**
 * Each unique note is tracked in its own node.
 */
interface Node {
	/**
	 * 	total number of uses of this note
	 */
	count: number,
	note: number,
	/**
	 * all note pathsOut out of this node. Mapped by note-from
	 */
	pathsIn: NodeReferenceMap,
	/**
	 * all note pathsOut into this node. Mapped by <code>this.note</code>
	 */
	pathsOut: NodeReferenceMap,
	/**
	 * array of all sequences that contain this note and the index at which this note is
	 */
	sequences: SequenceElement[]

}

type NodeMap = {[note: number]: Node};

/**
 * Tracks references in and out of <code>Node</code>
 */
interface NodeReference {
	/**
	 * Total number of references to <code>this.node</code>
	 */
	count: number,
	node: Node
}

type NodeReferenceMap = {[note: number]: NodeReference};
type SequenceElement = {eventIndex: number, sequence: MidiSequence};


/**
 * A bidirectional graph of all of the notes in one or more sequences. For each note we track:
 * - the total number of uses in all sequences
 * - all of the notes that immediately proceed it
 * - all of the notes that immediately follow it
 * - all references to the sequences that include it and the index in the sequence
 */
export class SequenceGraph {
	public readonly name: string;
	private map: NodeMap = {};

	constructor(name: string) {
		this.name = name;
	}

	/**
	 * Adds sequence's path to our graph
	 */
	addSequence(sequence: MidiSequence): void {
		/**
		 * Recursively adds the sequence
		 */
		const _addEventIndex = (index: number, prev?: Node) => {
			if(index < sequence.events.length) {
				const event = sequence.events[index];
				const node: Node = _ensureMappedValue(this.map, event.noteNumber as number, () => ({
						count: 0,
						note: event.noteNumber as number,
						pathsIn: {},
						pathsOut: {},
						sequences: []
					})) as Node;
				node.count++;
				node.sequences.push({
					eventIndex: index,
					sequence
				});
				if(prev) {
					_ensureMappedValue(node.pathsIn, prev.note, () => ({
						count: 0,
						node: prev
					})).count++;
					_ensureMappedValue(prev.pathsOut, node.note, () => ({
						count: 0,
						node: node
					})).count++;
				}
				_addEventIndex(index + 1, node);
			}
		};

		const _ensureMappedValue = (map: NodeMap|NodeReferenceMap, key: number, factory: () => Node|NodeReference): Node|NodeReference => {
			return map.hasOwnProperty(key)
				? map[key]
				: (map[key] = factory());
		};

		// we are only interested in note-on events
		sequence = Object.assign({}, sequence, {
			events: sequence.events
				.filter(event => event.subtype === MidiIoEventSubtype.noteOn)
		});

		_addEventIndex(0);
	}

	/**
	 * All notes in descending popularity order
	 */
	getAllNotes(): RankedNoteList {
		return _.chain(this.map)
			.map(node => ({
				count: node.count,
				note: node.note
			}))
			.sortBy(node => 0 - node.count)
			.value();
	}

	/**
	 * All paths that go into and out of the specified note
	 * @param note - note's node from which we want to build results
	 * @param exclude - optional note numbers to exclude from the results
	 * @return {{pathsIn: RankedNoteList, pathsOut: RankedNoteList}}
	 */
	getNotePaths(note: number, exclude: number[] = []): {
		pathsIn: RankedNoteList,
		pathsOut: RankedNoteList
	} {
		const _build = (path: "pathsIn"|"pathsOut"): RankedNoteList => {
			const pathData = _.get(this.map, `${note}.${path}`);
			if(pathData === undefined) {
				return [];
			} else {
				return _.chain(pathData)
					.reduce((result: RankedNoteList, reference: NodeReference) => {
						if(exclude.indexOf(reference.node.note) < 0) {
							result.push({
								count: reference.count,
								note: reference.node.note
							});
						}
						return result;
					}, [])
					.sortBy(element => 0 - element.count)
					.value();
			}
		};
		return {
			pathsIn: _build("pathsIn"),
			pathsOut: _build("pathsOut")
		};
	}

	/**
	 * Gets all sequences for the specified note
	 * @param note
	 * @param partial - whether you want the entire sequence or from the matched index on
	 */
	getSequencesForNote({
		note,
		partial = false
	}: {
		note: number,
		partial?: boolean
	}): MidiSequence[] {
		const node = this.map[note];
		if(node === undefined) {
			return [];
		} else {
			return _.map(node.sequences, element => {
				if(partial === false) {
					return element.sequence;
				} else {
					const sequence = element.sequence;
					return {
						duration: sequence.duration - (sequence.events[element.eventIndex].offset - sequence.events[0].offset),
						events: sequence.events.slice(element.eventIndex)
					};
				}
			});
		}
	}

	/**
	 * Traverses the graph and builds an array of note values. During each traversal either a note is added or iteration stops.
	 * The note chosen during iteration is determined by the callback function <param>next</param> (which by default returns the most popular next note).
	 * It returns the array of notes generated.
	 */
	traverse({
		maxCount,
		next = ({pathsOut}) => (pathsOut.length > 0) ? pathsOut[0].note : -1,
		reusePolicy = GraphReusePolicy.ALLOW,
		startNote
	}: {
		maxCount: number,
		next?: TraverseGraphIterator,
		reusePolicy?: GraphReusePolicy,
		startNote: number
	}): number[] {
		let exclude: number[] = [];
		const _push = (note: number, index: number): number[] => {
			if(index === maxCount || note < 0) {
				return [];
			} else {
				if(reusePolicy !== GraphReusePolicy.ALLOW) {
					exclude.push(note);
				}
				let nextNote = next(Object.assign({note}, this.getNotePaths(note, exclude)));
				if(nextNote < 0 && reusePolicy === GraphReusePolicy.RESET) {
					exclude = [];
					nextNote = next(Object.assign({note}, this.getNotePaths(note, exclude)));
				}
				return [note].concat(_push(nextNote, index + 1));
			}
		};
		return _push(startNote, 0);
	}
}
