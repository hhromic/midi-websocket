/**
 * Common functions for the MIDI WebSocket client/server.
 *
 * Hugo Hromic - http://github.com/hhromic
 * MIT license
 */

// Show all current ports for a given MIDI input/output instance
exports.showPorts = function (midi, description) {
    console.log('%s:', description);
    var numDevices = midi.getPortCount();
    for (var i=0; i<numDevices; i++)
        console.log('[%d] %s', i, midi.getPortName(i));
    console.log();
}

// Parse a string into a list of MIDI devices indexes
exports.parseMidiDevicesIndexes = function (string) {
    var midiDevicesIndexes = [];
    string.split(',').forEach(function (item) {
        var ports = item.split(':');
        ports[0] = parseInt(ports[0]);
        ports[1] = parseInt(ports[1]);
        midiDevicesIndexes.push({
            input: isNaN(ports[0]) ? undefined : ports[0],
            output: isNaN(ports[1]) ? undefined : ports[1],
        });
    });
    return midiDevicesIndexes;
}

// Show an error message an terminate the program
exports.error = function (message) {
    console.log('error: %s', message);
    process.exit(-1);
}
