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

export function createNoteEvent({
	channel,
	duration,
	noteNumber,
	offset,
	velocity
}: {
	channel: number,
	duration: number,
	noteNumber: number,
	offset: number,
	velocity: number
}): MidiEvent {
	return {
		channel,
		duration,
		id: createId("event"),
		noteNumber,
		offset,
		subtype: MidiIoEventSubtype.noteOn,
		type: MidiIoEventType.channel,
		velocity
	};
}

export function createTempoEvent({
	beatsPerMinute = 120,
	offset = 0

}): MidiEvent {
	return {
		duration: 0,
		id: createId("event"),
		microsecondsPerBeat: Math.floor((60 * 1000000) / beatsPerMinute),
		offset,
		subtype: MidiIoEventSubtype.timeSignature,
		type: MidiIoEventType.meta
	};
}

export function createTimeSignatureEvent({
	denominator = 4,
	metronome = 24,
	numerator = 4,
	offset = 0,
	thirtyseconds = 8

}): MidiEvent {
	return {
		denominator,
		duration: 0,
		id: createId("event"),
		metronome,
		numerator,
		offset,
		subtype: MidiIoEventSubtype.timeSignature,
		thirtyseconds,
		type: MidiIoEventType.meta
	};
}

export function createEventFromIoEvent({
	event,
	offset = 0,
	duration = 0
}: {
	event: MidiIoEvent,
	offset?: number,
	duration?: number
}): MidiEvent {
	return {
		duration,
		id: createId("event"),
		offset,
		..._.omit(event, "deltaTime")
	};
}

