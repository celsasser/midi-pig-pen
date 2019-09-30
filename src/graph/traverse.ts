/**
 * Date: 9/4/19
 * Time: 9:36 PM
 * @license MIT (see project's LICENSE file)
 */

import * as _ from "lodash";
import {
	IGraph,
	RankedNoteElement,
	TraverseAttributes,
	TraverseNoteGraph
} from "../model";

export type TraverseFunctionParam = {
	attributes?: TraverseAttributes,
	/**
	 * maximum number of notes to generate
	 */
	maxCount: number,
	/**
	 * note within the graph from which to start.
	 */
	startNote?: number
};


/**
 * Traverses graphs and builds note value arrays
 */
export class TraverseGraph {
	private _graph: IGraph;

	constructor(graph: IGraph) {
		this._graph = graph;
	}

	/**
	 * Traverses the graph backwards and builds an array of the least popular note-to transitions. During each traversal either a note is added or iteration stops.
	 */
	public leastPopularBackward({
		maxCount,
		attributes = 0,
		startNote = this._getDefaultStartNote()
	}: TraverseFunctionParam): number[] {
		function next({pathsIn}: TraverseNoteGraph): RankedNoteElement | undefined {
			return (pathsIn.length > 0)
				? pathsIn[pathsIn.length - 1]
				: undefined;
		}

		return this._graph.traverse({attributes, maxCount, next, startNote});
	}

	/**
	 * Traverses the graph forwards and builds an array of the least popular note-to transitions. During each traversal either a note is added or iteration stops.
	 */
	public leastPopularForward({
		maxCount,
		attributes = 0,
		startNote = this._getDefaultStartNote()
	}: TraverseFunctionParam): number[] {
		function next({pathsOut}: TraverseNoteGraph): RankedNoteElement | undefined {
			return (pathsOut.length > 0)
				? pathsOut[pathsOut.length - 1]
				: undefined;
		}

		return this._graph.traverse({attributes, maxCount, next, startNote});
	}

	/**
	 * Traverses the graph backwards and builds an array of the most popular note-to transitions. During each traversal either a note is added or iteration stops.
	 */
	public mostPopularBackward({
		maxCount,
		attributes = 0,
		startNote = this._getDefaultStartNote()
	}: TraverseFunctionParam): number[] {
		function next({pathsIn}: TraverseNoteGraph): RankedNoteElement | undefined {
			return (pathsIn.length > 0)
				? pathsIn[0]
				: undefined;
		}

		return this._graph.traverse({attributes, maxCount, next, startNote});
	}

	/**
	 * Traverses the graph forwards and builds an array of the most popular note-to transitions. During each traversal either a note is added or iteration stops.
	 */
	public mostPopularForward({
		maxCount,
		attributes = 0,
		startNote = this._getDefaultStartNote()
	}: TraverseFunctionParam): number[] {
		function next({pathsOut}: TraverseNoteGraph): RankedNoteElement | undefined {
			return (pathsOut.length > 0)
				? pathsOut[0]
				: undefined;
		}

		return this._graph.traverse({attributes, maxCount, next, startNote});
	}

	/**
	 * Traverses the graph backwards and builds an array of the least popular note-to transitions. During each traversal either a note is added or iteration stops.
	 */
	public randomBackward({
		maxCount,
		attributes = 0,
		startNote = this._getDefaultStartNote()
	}: TraverseFunctionParam): number[] {
		function next({pathsIn}: TraverseNoteGraph): RankedNoteElement| undefined {
			return (pathsIn.length > 0)
				? pathsIn[_.random(pathsIn.length - 1)]
				: undefined;
		}

		return this._graph.traverse({attributes, maxCount, next, startNote});
	}

	/**
	 * Traverses the graph forwards and builds an array of the least popular note-to transitions. During each traversal either a note is added or iteration stops.
	 */
	public randomForward({
		maxCount,
		attributes = 0,
		startNote = this._getDefaultStartNote()
	}: TraverseFunctionParam): number[] {
		function next({pathsOut}: TraverseNoteGraph): RankedNoteElement| undefined {
			return (pathsOut.length > 0)
				? pathsOut[_.random(pathsOut.length - 1)]
				: undefined;
		}

		return this._graph.traverse({attributes, maxCount, next, startNote});
	}

	private _getDefaultStartNote(): number {
		const insertSequence = this._graph.getInsertSequence();
		return (insertSequence.length > 0)
			? insertSequence[0]
			: -1;
	}
}
