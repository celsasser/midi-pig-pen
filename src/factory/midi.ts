/**
 * Date: 09/29/19
 * Time: 21:23
 * @license MIT (see project's LICENSE file)
 *
 * Some support for creating some common midi events. You may use them however
 * you like but the reason for creating them is primarily testing
 */

import {
	MidiIoEvent,
	MidiIoEventSubtype,
	MidiIoEventType
} from "midi-file-io";

export function createMidiNoteOnEvent({
	channel = 0,
	deltaTime = 0,
	noteNumber,
	velocity = 0x7f
}: {
	channel?: number,
	deltaTime?: number
	noteNumber: number,
	velocity?: number,
}): MidiIoEvent {
	return {
		channel,
		deltaTime,
		noteNumber,
		subtype: MidiIoEventSubtype.noteOn,
		type: MidiIoEventType.channel,
		velocity
	};
}
