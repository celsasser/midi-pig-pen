/**
 * Date: 09/22/19
 * Time: 22:35
 * @license MIT (see project's LICENSE file)
 */

import {createId} from "../../../src/factory";

describe("factor.id", function() {
	describe("createId", function() {
		it("should properly create id of specified type", function() {
			const id = createId("event");
			expect(id).toMatch(/^urn:event:[\w-]+$/);
		});
	});
});
