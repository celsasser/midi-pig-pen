/**
 * Date: 8/25/19
 * Time: 12:19 PM
 * @license MIT (see project's LICENSE file)
 */

import {MidiDurationEvent} from "./event";
import {MidiRatio} from "./types";

export type RhythmUnit = number|MidiRatio;

/**
 * Includes both the (calculated) float and floor value for a duration
 */
export interface MetaRhythmDuration {
	float: number;
	floor: number;
}

/**
 * Describes a single rhythmic unit. They are ratios that should add up to 1.
 */
export interface MetaRhythmPattern {
	/**
	 * Ratio of time that note is off (resting)
	 */
	off?: number;
	/**
	 * Ratio of time that note is on
	 */
	on?: number;
}

/**
 * Describes a rhythm sequence. See <code>RhythmGenerator</code>
 */
export interface MetaRhythmSequence {
	duration?: number;
	quartersPerUnit: RhythmUnit;
	patterns: MetaRhythmPattern[];
}

/**
 * It is the rhythm component of a sequence.
 */
export interface MidiRhythm {
	duration: number;
	events: MidiDurationEvent[];
}

