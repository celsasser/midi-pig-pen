/**
 * Date: 8/25/19
 * Time: 12:19 PM
 * @license MIT (see project's LICENSE file)
 */

import {MidiDurationEvent} from "./event";
import {MidiRatio} from "./types";

export interface MidiMetaRhythm {
	duration?: number,
	quartersPerUnit: number|MidiRatio,
	pattern: {
		off?: number,
		on?: number,
	}[]
}

export interface MidiRhythm {
	duration: number,
	events: MidiDurationEvent[]
}

