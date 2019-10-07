/**
 * Date: 10/06/19
 * Time: 20:05
 * @license MIT (see project's LICENSE file)
 */


import * as assert from "assert";
import {
	immutable,
	type
} from "colony-core";
import * as _ from "lodash";

export const doesNotThrow = assert.doesNotThrow;
export const ifError = assert.ifError;
export const notDeepEqual = assert.notDeepStrictEqual;
export const notStrictEqual = assert.notStrictEqual;
export const ok = assert.ok;
export const strictEqual = assert.strictEqual;
export const throws = assert.throws;

/**
 * We print out the expected as, in here at least, we frequently want to steal it.
 * @throws {Error}
 */
export function deepEqual(actual: any, expected: any): void {
	if (_.isPlainObject(actual)) {
		actual = immutable.object.scrub(actual);
	}
	if (_.isPlainObject(expected)) {
		expected = immutable.object.scrub(expected);
	}
	assert.deepStrictEqual(actual, expected);
}

/**
 * macro for assert.ok(false, error)
 * @throws {Error}
 */
export function fail(error: Error): void {
	// note: we convert it to a string (if an error) so that the assert library doesn't just throw him
	exports.ok(false, error.toString());
}

/**
 * @throws {Error}
 */
export function falsey(condition: any, message?: string): void {
	return assert.ok(Boolean(condition) === false, message);
}

/**
 * Asserts <param>value</param> is an error
 * @throws {Error}
 */
export function isError(value: any): void {
	assert.strictEqual(type.name(value), "Error");
}

/**
 * Simply asserts false if called
 * @throws {Error}
 */
export function notCalled(message?: string): void {
	throw new Error(
		`assert.notCalled() was called${
			message !== undefined ? `. ${message}` : ""
		}`
	);
}

/**
 * @throws {Error}
 */
export function truthy(condition: any, message?: string): void {
	assert.ok(Boolean(condition), message);
}
