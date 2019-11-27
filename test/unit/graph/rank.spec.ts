/**
 * Date: 09/22/19
 * Time: 22:33
 * @license MIT (see project's LICENSE file)
 */

import * as assert from "assert";
import {
	RankedSequenceGraph
} from "../../../src/graph/ranked";

describe("graph.rank", function() {
	describe("constructor", function() {
		it("it should properly create an instance", function() {
			const instance = new RankedSequenceGraph("graph");
			expect(instance.name).toStrictEqual("graph");
		});
	});

	describe("addSequence", function() {

	});

	describe("getAllNotes", function() {

	});

	describe("getSequencesForNote", function() {

	});

	describe("traverse", function() {

	});
});
