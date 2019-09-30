/**
 * Date: 09/22/19
 * Time: 22:35
 * @license MIT (see project's LICENSE file)
 */

import * as assert from "assert";
import {createTrack} from "../../../src/factory/track";

describe("factory.track", function() {
	describe("createTrack", function() {
		it("it should properly create a track", function() {
			const track = createTrack({
				id: "urn:track:id",
				instrument: "piano",
				name: "track 1"
			});
			assert.deepEqual(track, {
				id: "urn:track:id",
				instrument: "piano",
				name: "track 1",
				sequence: {
					duration: 0,
					events: []
				}
			});
		});
	});
});
