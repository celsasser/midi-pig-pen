/**
 * Date: 8/25/19
 * Time: 12:19 PM
 * @license MIT (see project's LICENSE file)
 */

import {MidiSequence} from "./sequence";

export interface MidiTrack {
	id: string,
	instrument?: string,
	name?: string,
	sequence: MidiSequence
}
