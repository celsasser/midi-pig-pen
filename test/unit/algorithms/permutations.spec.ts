/**
 * Date: 11/26/19
 * Time: 10:03 PM
 * @license MIT (see project's LICENSE file)
 */

import {permutations} from "../../../src/algorithms";

describe("algorithms.permutations", function() {
	describe("permutations", function() {
		it("should properly create all permutations of [1,2,3]", function() {
			const input = [1, 2, 3];
			const result = permutations(input);
			expect(result).toEqual(require("./expectations/permutations.json"));
		});
	});
});
