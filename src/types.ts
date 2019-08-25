/**
 * Date: 8/24/19
 * Time: 8:43 PM
 * @license MIT (see project's LICENSE file)
 */

import {
	MidiIoEvent,
	MidiIoHeader
} from "midi-file-io";

export type MidiChord = {
	event: MidiEvent,
	track: MidiTrack
}[];

/**
 * An abstract subset of MidiEvent
 */
export interface MidiDurationEvent {
	duration: number,
	offset: number
}

/**
 * Any and all MIDI track events
 */
export interface MidiEvent extends MidiIoEvent {
	id: string,
	duration: number,
	offset: number
}

export interface MidiHeader extends MidiIoHeader {

}

/**
 * It's just a pattern. An array of offsets
 */
export type MidiMetaSequence = number[];

export interface MidiRatio {
	denominator: number,
	numerator: number
}

export interface MidiMetaRhythm {
	duration?: number,
	quartersPerUnit: number|MidiRatio,
	pattern: {
		off?: number,
		on?: number,
	}[]
}

export type MidiNumberGenerator = (index: number, note: number) => number;

export type MidiNumberType = number|number[]|MidiNumberGenerator;

export interface MidiRhythm {
	duration: number,
	events: MidiDurationEvent[]
}

export interface MidiSequence {
	duration: number,
	events: MidiEvent[]
}

export interface MidiTrack {
	id: string,
	instrument?: string,
	name?: string,
	sequence: MidiSequence
}
