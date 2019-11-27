/**
 * Date: 09/22/19
 * Time: 22:34
 * @license MIT (see project's LICENSE file)
 */

import * as assert from "assert";
import * as _ from "lodash";
import {
	createEventFromIoEvent,
	createNoteEvent,
	createTempoEvent,
	createTimeSignatureEvent
} from "../../../src/factory";
import {createMidiNoteOnEvent} from "../../../src/factory/midi";

describe("factory.event", function() {
	describe("createEventFromIoEvent", function() {
		it("it should properly create with defaults", function() {
			const event = createEventFromIoEvent({
				event: createMidiNoteOnEvent({
					noteNumber: 32
				})
			});
			expect(_.omit(event, "id")).toEqual({
				channel: 0,
				duration: 0,
				noteNumber: 32,
				offset: 0,
				subtype: "noteOn",
				type: "channel",
				velocity: 0x7f
			});
			expect(event.id).toMatch(/^urn:event:[^:]+$/);
		});

		it("it should properly create with explicit params", function() {
			const event = createEventFromIoEvent({
				duration: 880,
				event: createMidiNoteOnEvent({
					noteNumber: 32
				}),
				id: "urn:event:id",
				offset: 440
			});
			expect(_.omit(event, "id")).toEqual({
				channel: 0,
				duration: 880,
				noteNumber: 32,
				offset: 440,
				subtype: "noteOn",
				type: "channel",
				velocity: 0x7f
			});
			expect(event.id).toMatch(/^urn:event:\w+$/);
		});
	});

	describe("createNoteEvent", function() {
		it("it should properly create event", function() {
			const event = createNoteEvent({
				channel: 0,
				duration: 440,
				id: "urn:event:id",
				noteNumber: 32,
				offset: 440,
				velocity: 0x7f
			});
			expect(event).toEqual({
				channel: 0,
				duration: 440,
				id: "urn:event:id",
				noteNumber: 32,
				offset: 440,
				subtype: "noteOn",
				type: "channel",
				velocity: 127
			});
		});
	});

	describe("createTempoEvent", function() {
		it("it should properly create event", function() {
			const event = createTempoEvent({
				id: "urn:event:id"
			});
			expect(event).toEqual({
				duration: 0,
				id: "urn:event:id",
				microsecondsPerBeat: 500000,
				offset: 0,
				subtype: "timeSignature",
				type: "meta"
			});
		});
	});

	describe("createTimeSignatureEvent", function() {
		it("it should properly create event", function() {
			const event = createTimeSignatureEvent({
				id: "urn:event:id"
			});
			expect(event).toEqual({
				denominator: 4,
				duration: 0,
				id: "urn:event:id",
				metronome: 24,
				numerator: 4,
				offset: 0,
				subtype: "timeSignature",
				thirtyseconds: 8,
				type: "meta"
			});
		});
	});
});
