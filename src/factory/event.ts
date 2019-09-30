/**
 * Date: 8/25/19
 * Time: 1:39 PM
 * @license MIT (see project's LICENSE file)
 */

import * as _ from "lodash";
import {
	MidiIoEvent,
	MidiIoEventSubtype,
	MidiIoEventType
} from "midi-file-io";
import {MidiEvent} from "../model";
import {createId} from "./id";

export function createEventFromIoEvent({
	duration = 0,
	event,
	id = createId("event"),
	offset = 0
}: {
	duration?: number
	event: MidiIoEvent,
	id?: string,
	offset?: number,
}): MidiEvent {
	return {
		duration,
		id,
		offset,
		..._.omit(event, "deltaTime")
	};
}

export function createNoteEvent({
	channel,
	duration,
	id = createId("event"),
	noteNumber,
	offset,
	velocity
}: {
	channel: number,
	duration: number,
	id?: string,
	noteNumber: number,
	offset: number,
	velocity: number
}): MidiEvent {
	return {
		channel,
		duration,
		id,
		noteNumber,
		offset,
		subtype: MidiIoEventSubtype.noteOn,
		type: MidiIoEventType.channel,
		velocity
	};
}

export function createTempoEvent({
	beatsPerMinute = 120,
	id = createId("event"),
	offset = 0
}): MidiEvent {
	return {
		duration: 0,
		id,
		microsecondsPerBeat: Math.floor((60 * 1000000) / beatsPerMinute),
		offset,
		subtype: MidiIoEventSubtype.timeSignature,
		type: MidiIoEventType.meta
	};
}

export function createTimeSignatureEvent({
	denominator = 4,
	id = createId("event"),
	metronome = 24,
	numerator = 4,
	offset = 0,
	thirtyseconds = 8
}): MidiEvent {
	return {
		denominator,
		duration: 0,
		id,
		metronome,
		numerator,
		offset,
		subtype: MidiIoEventSubtype.timeSignature,
		thirtyseconds,
		type: MidiIoEventType.meta
	};
}
