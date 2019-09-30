/**
 * Date: 8/25/19
 * Time: 1:55 PM
 * @license MIT (see project's LICENSE file)
 */

import {MidiTrack} from "../model";
import {createId} from "./id";

export function createTrack({
	id = createId("track"),
	instrument,
	name
}: {
	id?: string,
	instrument?: string,
	name?: string
} = {}): MidiTrack {
	return {
		id,
		instrument,
		name,
		sequence: {
			duration: 0,
			events: []
		}
	};
}

