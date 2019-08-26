/**
 * Date: 8/25/19
 * Time: 12:19 PM
 * @license MIT (see project's LICENSE file)
 */

import {MidiIoHeader} from "midi-file-io";

export interface MidiHeader extends Omit<MidiIoHeader, "trackCount"> {

}
