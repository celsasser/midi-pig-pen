/**
 * Date: 8/25/19
 * Time: 1:42 PM
 * @license MIT (see project's LICENSE file)
 */

import * as shortid from "shortid";

export function createId(type: "event"|"track"): string {
	return `urn:${type}:${shortid.generate()}`;
}
