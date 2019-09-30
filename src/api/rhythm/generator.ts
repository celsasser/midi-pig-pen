/**
 * Date: 9/7/19
 * Time: 8:40 PM
 * @license MIT (see project's LICENSE file)
 */

import * as _ from "lodash";
import {MidiIoEventSubtype} from "midi-file-io";
import {
	MetaRhythmSequence,
	MidiDurationEvent,
	MidiRhythm,
	MidiSequence
} from "../../model";
import {RhythmCalculator} from "./calculator";

export class RhythmGenerator {
	public readonly calculator: RhythmCalculator;

	/**
	 * All tick calculations within are based on <param>ticksPerQuarter</param>
	 */
	constructor(ticksPerQuarter: number) {
		this.calculator = new RhythmCalculator(ticksPerQuarter);
	}


	/**
	 * Generates a rhythm based on the specified meta-pattern and duration
	 */
	public fromMetaSequence(meta: MetaRhythmSequence): MidiRhythm {
		let offset: number = 0;
		const events: MidiDurationEvent[] = [];
		const ticksPerUnit = this.calculator.getUnitTicks(meta.quartersPerUnit);
		for(const pattern of meta.patterns) {
			const {off, on} = this.calculator.getPatternTicks(pattern, ticksPerUnit);
			if(on.float) {
				events.push({
					duration: on.float,
					offset
				});
			}
			offset += off.float + on.float;
		}
		return {
			duration: (meta.duration !== undefined)
				? meta.duration * ticksPerUnit
				: offset,
			events
		};
	}

	/**
	 * Sucks the rhythm out of a sequence
	 * @param duration
	 * @param offset - offset from which sequence starts. Defaults to first event
	 * @param sequence
	 */
	public fromSequence({
		duration,
		offset,
		sequence
	}: {
		duration?: number,
		offset?: number,
		sequence: MidiSequence
	}): MidiRhythm {
		const start: number = (offset !== undefined)
			? offset
			: _.get(sequence.events, "0.offset", 0);
		let maxOffset = start;
		const events: MidiDurationEvent[] = [];
		(sequence.events || [])
			.filter(event => event.subtype === MidiIoEventSubtype.noteOn)
			.forEach(noteEvent => {
				events.push({
					duration: noteEvent.duration,
					offset: noteEvent.offset - start
				});
				maxOffset = Math.max(maxOffset, noteEvent.offset + noteEvent.duration);
			});
		return {
			duration: (duration !== undefined)
				? duration
				: maxOffset - start,
			events
		};
	}

	/**
	 * Quantize the rhythm.
	 * Note:
	 * @param duration - duration to quantize by
	 * @param includeDuration
	 * @param includeOffset
	 * @param relation - in relation to offset
	 * @param rhythm - we have two choices regarding the returned duration here: retain the original or recompute it.
	 * 	We are opting to recalculate it.  If the caller wants the original duration then they should replace it after the quantize.
	 */
	public quantize({
		duration,
		includeDuration = false,
		includeOffset = true,
		relation = 0,
		rhythm
	}: {
		duration: number,
		includeDuration?: boolean,
		includeOffset?: boolean,
		relation: number,
		rhythm: MidiRhythm
	}): MidiRhythm {
		function _round(value: number): number {
			const divisible = value / duration;
			return duration * Math.round(divisible);
		}

		const initial: MidiRhythm = {
			duration: 0,
			events: []
		};
		return rhythm.events.reduce((result, event) => {
			const newOffset = (includeOffset)
				? _round(event.offset - relation)
				: event.offset - relation;
			const newDuration = (includeDuration)
				? _round(event.offset + event.duration - relation) - newOffset
				: event.duration + (event.offset - newOffset);
			result.duration = Math.max(result.duration, newOffset + newDuration);
			result.events.push({
				duration: newDuration,
				offset: newOffset
			});
			return result;
		}, initial);
	}
}
