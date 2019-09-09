/**
 * Date: 8/25/19
 * Time: 12:19 PM
 * @license MIT (see project's LICENSE file)
 */

import {MidiDurationEvent} from "./event";
import {MidiRatio} from "./types";

export type RhythmUnit = number|MidiRatio;

export interface MetaRhythmDuration {
	float: number;
	floor: number;
}

export interface MetaRhythmPattern {
	off?: number;
	on?: number;
}

export interface MetaRhythmSequence {
	duration?: number;
	quartersPerUnit: RhythmUnit;
	patterns: MetaRhythmPattern[];
}

export interface MidiRhythm {
	duration: number;
	events: MidiDurationEvent[];
}

