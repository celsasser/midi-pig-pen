/**
 * Date: 9/4/19
 * Time: 9:36 PM
 * @license MIT (see project's LICENSE file)
 */

import * as _ from "lodash";
import {
	GraphReusePolicy,
	IGraph,
	TraverseGraphParam,
	TraverseNoteSelectorParam
} from "../model";


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
		reusePolicy = GraphReusePolicy.ALLOW,
		startNote
	}: Omit<TraverseGraphParam, "next">): number[] {
		function next({pathsIn}: TraverseNoteSelectorParam): number {
			return (pathsIn.length > 0)
				? pathsIn[pathsIn.length - 1].note
				: -1;
		}

		return this._graph.traverse({maxCount, next, reusePolicy, startNote});
	}

	/**
	 * Traverses the graph forwards and builds an array of the least popular note-to transitions. During each traversal either a note is added or iteration stops.
	 */
	public leastPopularForward({
		maxCount,
		reusePolicy = GraphReusePolicy.ALLOW,
		startNote
	}: Omit<TraverseGraphParam, "next">): number[] {
		function next({pathsOut}: TraverseNoteSelectorParam): number {
			return (pathsOut.length > 0)
				? pathsOut[pathsOut.length - 1].note
				: -1;
		}

		return this._graph.traverse({maxCount, next, reusePolicy, startNote});
	}

	/**
	 * Traverses the graph backwards and builds an array of the most popular note-to transitions. During each traversal either a note is added or iteration stops.
	 * @param {number} maxCount
	 * @param {GraphReusePolicy} reusePolicy
	 * @param {number} startNote
	 * @returns {Array<number>}
	 */
	public mostPopularBackward({
		maxCount,
		reusePolicy = GraphReusePolicy.ALLOW,
		startNote
	}: Omit<TraverseGraphParam, "next">): number[] {
		function next({pathsIn}: TraverseNoteSelectorParam): number {
			return (pathsIn.length > 0)
				? pathsIn[0].note
				: -1;
		}

		return this._graph.traverse({maxCount, next, reusePolicy, startNote});
	}

	/**
	 * Traverses the graph forwards and builds an array of the most popular note-to transitions. During each traversal either a note is added or iteration stops.
	 * @param {number} maxCount
	 * @param {GraphReusePolicy} reusePolicy
	 * @param {number} startNote
	 * @returns {Array<number>}
	 */
	public mostPopularForward({
		maxCount,
		reusePolicy = GraphReusePolicy.ALLOW,
		startNote
	}: Omit<TraverseGraphParam, "next">): number[] {
		function next({pathsOut}: TraverseNoteSelectorParam): number {
			return (pathsOut.length > 0)
				? pathsOut[0].note
				: -1;
		}

		return this._graph.traverse({maxCount, next, reusePolicy, startNote});
	}

	/**
	 * Traverses the graph backwards and builds an array of the least popular note-to transitions. During each traversal either a note is added or iteration stops.
	 * @param {number} maxCount
	 * @param {GraphReusePolicy} reusePolicy
	 * @param {number} startNote
	 * @returns {Array<number>}
	 */
	public randomBackward({
		maxCount,
		reusePolicy = GraphReusePolicy.ALLOW,
		startNote
	}: Omit<TraverseGraphParam, "next">): number[] {
		function next({pathsIn}: TraverseNoteSelectorParam): number {
			return (pathsIn.length > 0)
				? pathsIn[_.random(pathsIn.length - 1)].note
				: -1;
		}

		return this._graph.traverse({maxCount, next, reusePolicy, startNote});
	}

	/**
	 * Traverses the graph forwards and builds an array of the least popular note-to transitions. During each traversal either a note is added or iteration stops.
	 * @param {number} maxCount
	 * @param {GraphReusePolicy} reusePolicy
	 * @param {number} startNote
	 * @returns {Array<number>}
	 */
	public randomForward({
		maxCount,
		reusePolicy = GraphReusePolicy.ALLOW,
		startNote
	}: Omit<TraverseGraphParam, "next">): number[] {
		function next({pathsOut}: TraverseNoteSelectorParam): number {
			return (pathsOut.length > 0)
				? pathsOut[_.random(pathsOut.length - 1)].note
				: -1;
		}

		return this._graph.traverse({maxCount, next, reusePolicy, startNote});
	}
}
