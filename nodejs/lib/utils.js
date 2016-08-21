/* jshint node:true, esversion:6 */
'use strict';

/*!
 * Common functions for the MIDI WebSocket bridging client/server.
 * Hugo Hromic - http://github.com/hhromic
 *
 * Copyright 2016 Hugo Hromic
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

// show all current ports for a given MIDI input/output instance
exports.showPorts = (midi, description) => {
  console.log('%s:', description);
  const numDevices = midi.getPortCount();
  for (var idx=0; idx<numDevices; idx++)
    console.log('[%d] %s', idx, midi.getPortName(idx));
  console.log();
};

// parse a string into a list of MIDI devices indexes
exports.parseMidiDevicesIndexes = string => {
  if (string === undefined || string === null)
    return [];

  var midiDevicesIndexes = [];
  string.split(',').forEach(function (item) {
    const ports = item.split(':');
    ports[0] = parseInt(ports[0]);
    ports[1] = parseInt(ports[1]);
    midiDevicesIndexes.push({
      input: isNaN(ports[0]) ? undefined : ports[0],
      output: isNaN(ports[1]) ? undefined : ports[1],
    });
  });
  return midiDevicesIndexes;
};
