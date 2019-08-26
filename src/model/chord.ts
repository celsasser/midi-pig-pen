/**
 * Date: 8/25/19
 * Time: 12:19 PM
 * @license MIT (see project's LICENSE file)
 */

import {MidiEvent} from "./event";
import {MidiTrack} from "./track";

export type MidiChord = {
	event: MidiEvent,
	track: MidiTrack
}[];

