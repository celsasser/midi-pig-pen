/**
 * Date: 8/25/19
 * Time: 12:19 PM
 * @license MIT (see project's LICENSE file)
 */

import {MidiIoEvent} from "midi-file-io";

/**
 * An required subset of MidiEvent
 */
export interface MidiDurationEvent {
	duration: number;
	offset: number;
}

/**
 * Any and all MIDI track events
 */
export interface MidiEvent extends Omit<MidiIoEvent, "deltaTime"> {
	id: string;
	duration: number;
	offset: number;
}

