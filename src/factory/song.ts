/**
 * Date: 8/25/19
 * Time: 12:06 PM
 * @license MIT (see project's LICENSE file)
 */

import {ColonyError} from "colony-core";
import {
	MidiFileType,
	MidiIoEvent,
	MidiIoEventSubtype,
	MidiIoSong
} from "midi-file-io";
import {createId} from "../factory/id";
import {
	MidiEvent,
	MidiSong,
	MidiTrack
} from "../model";
import {
	createEventFromIoEvent,
	createTempoEvent,
	createTimeSignatureEvent
} from "./event";
import {createTrack} from "./track";


/**
 * Creates a new sequence. Empty by default.
 */
export function createSong({
	beatsPerMinute = 120,
	denominator = 4,
	formatType = MidiFileType.SIMULTANEOUS,
	numerator = 4,
	ticksPerQuarter = 480,
	/**
	 * This is intended for debugging only. Under normal circumstances you should let this guy setup a metadata track
	 */
	tracks
}: {
	beatsPerMinute?: number,
	denominator?: number,
	formatType?: MidiFileType,
	numerator?: number,
	ticksPerQuarter?: number,
	tracks?: MidiTrack[]
} = {}): MidiSong {
	if(tracks === undefined) {
		const track = createTrack();
		track.sequence.events.push(createTimeSignatureEvent({denominator, numerator}));
		track.sequence.events.push(createTempoEvent({beatsPerMinute}));
		tracks = [track];
	}
	return new MidiSong({
		header: {
			formatType,
			ticksPerQuarter
		},
		tracks: tracks
	});
}

/**
 * Translates midi-io-import format to MidiSong
 * @throws {Error}
 */
export function createSongFromIoSong(data: MidiIoSong): MidiSong {
	function _mutateTrack(events: MidiIoEvent[]): MidiTrack {
		/**
		 * Finds matching note on and updates it
		 * @param {MidiEvent} noteOff
		 * @returns {MidiEvent|undefined}
		 */
		function _resolveNoteOn(noteOff: MidiEvent): MidiEvent {
			for(let index = 0; index < noteOnStack.length; index++) {
				if(noteOnStack[index].noteNumber === noteOff.noteNumber) {
					noteOnStack[index].duration = noteOff.offset - noteOnStack[index].offset;
					return noteOnStack.splice(index, 1)[0];
				}
			}
			throw(new ColonyError({
				details: `note=${noteOff.noteNumber} at ${noteOff.offset} could not be resolved`,
				message: "mididata integrity"
			}));
		};

		let noteOnStack: MidiEvent[] = [],
			offset = 0;

		const track: MidiTrack = {
			id: createId("track"),
			instrument: undefined,
			name: undefined,
			sequence: {
				duration: 0,
				events: []
			}
		};

		track.sequence.events = events.reduce((result: MidiEvent[], eventIO: MidiIoEvent) => {
			offset += eventIO.deltaTime;
			let event = createEventFromIoEvent({
				offset,
				event: eventIO
			});
			// note: there are some events we take out of the track 'cause they are difficult to manage
			// as events. We will put them back upon export (where valuable)
			if(event.subtype === MidiIoEventSubtype.noteOff) {
				if((event = _resolveNoteOn(event))) {
					track.sequence.duration = Math.max(track.sequence.duration, event.offset + event.duration);
				}
			} else if(event.subtype === MidiIoEventSubtype.trackName) {
				track.name = event.text;
			} else if(event.subtype === MidiIoEventSubtype.instrumentName) {
				track.instrument = event.text;
			} else if(event.subtype === MidiIoEventSubtype.endOfTrack) {
				// this guy will only be a pain in the butt. We will see how we want to handle him.
			} else {
				if(event.subtype === "noteOn") {
					noteOnStack.push(event);
				}
				result.push(event);
			}
			return result;
		}, []);

		if(noteOnStack.length > 0) {
			throw(new ColonyError({
				details: `${noteOnStack.length} note-ons unresolved`,
				message: "mididata integrity"
			}));
		}
		return track;
	}

	return new MidiSong({
		header: {
			formatType: data.header.formatType,
			ticksPerQuarter: data.header.ticksPerQuarter
		},
		tracks: data.tracks.map(_mutateTrack)
	});
}
