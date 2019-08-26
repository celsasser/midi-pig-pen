/**
 * Date: 8/25/19
 * Time: 1:55 PM
 * @license MIT (see project's LICENSE file)
 */

import {MidiTrack} from "../model";
import {createId} from "./id";

export function createTrack({
	instrument,
	name
}: {
	instrument?: string,
	name?: string
} = {}): MidiTrack {
	return {
		id: createId("track"),
		instrument,
		name,
		sequence: {
			duration: 0,
			events: []
		}
	};
}

