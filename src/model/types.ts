/**
 * Date: 8/24/19
 * Time: 8:43 PM
 * @license MIT (see project's LICENSE file)
 */

export type MidiNumberGenerator = (index: number, note: number) => number;

export type MidiNumberType = number|number[]|MidiNumberGenerator;

export interface MidiRatio {
	denominator: number,
	numerator: number
}

