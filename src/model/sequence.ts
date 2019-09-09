/**
 * Date: 8/25/19
 * Time: 12:19 PM
 * @license MIT (see project's LICENSE file)
 */

import {MidiEvent} from "./event";

/**
 * It's just a pattern. An array of offsets
 */
export type MetaSequence = number[];

export interface MidiSequence {
	duration: number;
	events: MidiEvent[];
}

