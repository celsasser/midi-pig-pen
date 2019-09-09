/**
 * Date: 9/7/19
 * Time: 8:40 PM
 * @license MIT (see project's LICENSE file)
 */

import * as _ from "lodash";
import {
	MetaRhythmSequence,
	MidiRhythm
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
	 * @param {MetaRhythmSequence} meta
	 * @returns {MidiRhythm}
	 */
	generateRhythm(meta: MetaRhythmSequence): MidiRhythm {
		const ticksPerUnit = this.calculator.getUnitTicks(meta.quartersPerUnit);
		const computed = meta.patterns.reduce((result, node) => {
			const {off, on, total} = this.calculator.getSequenceTicks()
			if(node.on) {
				result.events.push({
					duration: Math.round(node.on * ticksPerUnit),
					offset: result.offset
				});
			}
			result.offset = Math.round(_.get(node, "on", 0) * ticksPerUnit + _.get(node, "off", 0) * ticksPerUnit);
			return result;
		}, {events: [], offset: 0});
		return {
			duration: (meta.duration !== undefined)
				? meta.duration * ticksPerUnit
				: computed.offset,
			events: computed.events
		};
	}

	/**
	 * Sucks the rhythm out of a sequence
	 * @param {number|undefined} duration
	 * @param {number|undefined} offset - offset from which sequence starts. Defaults to first event
	 * @param {MidiSequence} sequence
	 * @returns {MidiRhythm}
	 */
	sequenceToRhythm({
		duration = undefined,
		offset = undefined,
		sequence
	}): MidiRhythm {
		offset = (offset !== undefined)
			? offset
			: _.get(sequence.events, "0.offset", 0);
		const computed = _.chain(sequence.events)
			.filter({subtype: "noteOn"})
			.reduce((result, event) => {
				result.events.push({
					duration: event.duration,
					offset: event.offset - offset
				});
				result.maxOffset = Math.max(result.maxOffset, event.offset + event.duration - offset);
				return result;
			}, {events: [], maxOffset: 0})
			.value();
		return {
			duration: (duration !== undefined)
				? duration
				: computed.maxOffset,
			events: computed.events
		};
	}

	/**
	 * Quantize the rhythm.
	 * Note:
	 * @param {number} duration - duration to quantize by
	 * @param {boolean} includeDuration
	 * @param {boolean} includeOffset
	 * @param {number} relation - in relation to offset
	 * @param {MidiRhythm} rhythm - we have two choices regarding the returned duration here: retain the original or recompute it.
	 * 	We are opting to recalculate it.  If the caller wants the original duration then they should replace it after the quantize.
	 */
	quantize({
		duration,
		includeDuration = false,
		includeOffset = true,
		relation = 0,
		rhythm
	}) {
		function _round(value) {
			const divisible = value / duration;
			return duration * Math.round(divisible);
		}

		return rhythm.events.reduce((result, event) => {
			const newOffset = includeOffset
				? _round(event.offset - relation)
				: event.offset - relation;
			const newDuration = includeDuration
				? _round(event.offset + event.duration - relation) - newOffset
				: event.duration + (event.offset - newOffset);
			result.duration = Math.max(result.duration, newOffset + newDuration);
			result.events.push({
				duration: newDuration,
				offset: newOffset
			});
			return result;
		}, {
			duration: 0,
			events: []
		});
	}
}
