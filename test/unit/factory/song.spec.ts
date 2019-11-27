/**
 * Date: 09/22/19
 * Time: 22:35
 * @license MIT (see project's LICENSE file)
 */

import * as assert from "assert";
import {immutable} from "colony-core";
import {
	MidiFileType,
	parseMidiFile
} from "midi-file-io";
import {
	createSong,
	createSongFromIoSong
} from "../../../src/factory";

/**
 * Recursively removes all properties in <param>properties</param>
 */
function scrubSong(object: {[key: string]: any}): {[key: string]: any} {
	return immutable.object.scrub(object, {
		recursive: true,
		removables: [
			undefined,
			(value: any, key: string) => key === "id"
		]
	});
}

describe("factory.song", function() {
	describe("createSong", function() {
		it("it should properly create a song instance with defaults", function() {
			const song = createSong();
			const scrubbed = scrubSong(song);
			expect(scrubbed).toEqual(require("./output/createSongWithDefaults"));
		});

		it("it should create instance in accordance with params", function() {
			const song = createSong({
				beatsPerMinute: 80,
				denominator: 8,
				formatType: MidiFileType.INDEPENDENT,
				numerator: 3,
				ticksPerQuarter: 120
			});
			const scrubbed = scrubSong(song);
			expect(scrubbed).toEqual(require("./output/createSong"));
		});
	});

	describe("createSongFromIoSong", function() {
		it("it should properly convert our test midi file", function() {
			const parsed = parseMidiFile("test/unit/factory/input/createSongFromIoSong.mid");
			const song = createSongFromIoSong(parsed);
			const scrubbed = scrubSong(song);
			expect(scrubbed).toEqual(require("./output/createSongFromIoSong.json"));
		});
	});
});
