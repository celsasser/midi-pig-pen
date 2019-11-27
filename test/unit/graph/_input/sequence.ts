/**
 * Date: 9/29/19
 * Time: 1:08 PM
 * @license MIT (see project's LICENSE file)
 */

import {
	createNoteEvent
} from "../../../../src/factory/index";
import {
	MidiSequence
} from "../../../../src/model/index";

export const diatonic: MidiSequence = {
	duration: 440,
	events: [
		createNoteEvent({
			channel: 0,
			duration: 128,
			noteNumber: 32,
			offset: 0,
			velocity: 0x7f
		})
	]
};
