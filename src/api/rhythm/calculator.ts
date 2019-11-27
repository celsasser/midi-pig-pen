/**
 * Date: 9/7/19
 * Time: 8:40 PM
 * @license MIT (see project's LICENSE file)
 */

import {
	MetaRhythmDuration,
	MetaRhythmPattern,
	MetaRhythmSequence,
	RhythmUnit
} from "../../model";

/**
 * Calculates tick values for one or more <code>MetaRhythmSequence</code> descriptions
 */
export class RhythmCalculator {
	public readonly ticksPerQuarter: number;

	/**
	 * All tick calculations within are based on <param>ticksPerQuarter</param>. Often called PPQ.
	 */
	constructor(ticksPerQuarter: number) {
		this.ticksPerQuarter = ticksPerQuarter;
	}

	/**
	 * Calculates the number of ticks per <param>quartersPerUnit</param>
	 * Quarters per unit is basically bottom number in a time-signature - "what note value gets the beat?".
	 * For our purposes it will probably always be 1 to 1
	 */
	public getUnitTicks(quartersPerUnit: RhythmUnit): number {
		return typeof quartersPerUnit === "number"
			? this.ticksPerQuarter * quartersPerUnit
			: (this.ticksPerQuarter * quartersPerUnit.numerator) /
			quartersPerUnit.denominator;
	}

	/**
	 * Returns length of specified rhythm description
	 * see <link>/res/rhythm</link>
	 */
	public getSequenceTicks(
		sequence: MetaRhythmSequence|MetaRhythmSequence[]
	): {
		off: MetaRhythmDuration;
		on: MetaRhythmDuration;
		total: MetaRhythmDuration;
	} {
		let calculated: {
			off: number;
			on: number;
			total: number;
		};
		if(sequence instanceof Array) {
			calculated = sequence.reduce(
				(result, _meta) => {
					const {on, off, total} = this._getSequenceTicks(_meta);
					return {
						off: result.off + off,
						on: result.on + on,
						total: result.total + total
					};
				},
				{
					off: 0,
					on: 0,
					total: 0
				}
			);
		} else {
			calculated = this._getSequenceTicks(sequence);
		}
		return {
			off: {
				float: calculated.off,
				floor: Math.floor(calculated.off)
			},
			on: {
				float: calculated.on,
				floor: Math.floor(calculated.on)
			},
			total: {
				float: calculated.total,
				floor: Math.floor(calculated.total)
			}
		};
	}

	public getPatternTicks(
		pattern: MetaRhythmPattern,
		ticksPerUnit: number
	): {
		off: MetaRhythmDuration;
		on: MetaRhythmDuration;
	} {
		const values = {
			off: 0,
			on: 0
		};
		if(pattern.on !== undefined) {
			values.on += ticksPerUnit * pattern.on;
		}
		if(pattern.off !== undefined) {
			values.off += ticksPerUnit * pattern.off;
		}
		return {
			off: {
				float: values.off,
				floor: Math.floor(values.off)
			},
			on: {
				float: values.on,
				floor: Math.floor(values.on)
			}
		};
	}

	/**
	 * Returns calculated floats
	 * @private
	 */
	private _getSequenceTicks(
		sequence: MetaRhythmSequence
	): {
		off: number;
		on: number;
		total: number;
	} {
		const unitTicks = this.getUnitTicks(sequence.quartersPerUnit);
		const result = {
			off: 0,
			on: 0
		};
		for(const pattern of sequence.patterns) {
			if(pattern.on !== undefined) {
				result.on += unitTicks * pattern.on;
			}
			if(pattern.off !== undefined) {
				result.off += unitTicks * pattern.off;
			}
		}
		return Object.assign(
			{
				total:
					sequence.duration !== undefined
						? sequence.duration * unitTicks
						: result.off + result.on
			},
			result
		);
	}
}
