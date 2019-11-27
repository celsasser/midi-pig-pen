/**
 * Date: 09/22/19
 * Time: 22:21
 * @license MIT (see project's LICENSE file)
 */

import * as assert from "assert";
import {
	SequenceGraph
} from "../../../src/graph/sequence";

describe("graph.sequence", function() {
	describe("constructor", function() {
		it("it should properly create an instance", function() {
			const instance = new SequenceGraph("graph");
			expect(instance.name).toStrictEqual("graph");
		});
	});

	describe("addSequence", function() {

	});

	describe("getAllNotes", function() {

	});

	describe("getInsertSequence", function() {

	});

	describe("traverse", function() {

	});
});
