/**
 * MIDI streaming WebSocket bridge client.
 *
 * Hugo Hromic - http://github.com/hhromic
 * MIT license
 */

// Required modules
var websocket = require('websocket');
var midi = require('midi');
var utils = require('./utils.js');

// Show program usage
function showUsage () {
    console.log('Usage: [wsServerUrl] [midiDevices]');
    console.log();
    console.log('wsServerUrl is the WebSocket server URL to connect the client to.');
    console.log();
    console.log('midiDevices is a comma separated list of input/output MIDI port');
    console.log('index pairs defining local MIDI devices. If a device only has');
    console.log('either an input or output, leave the counterpart index blank.');
    console.log('For example, "0:0" defines a MIDI device with input port 0 and');
    console.log('output port 0, "1:" defines a MIDI device with only input port 1');
    console.log('and ":2" defines a MIDI device with only output port 2.');
    console.log();
    console.log('Example usage:');
    console.log('> node bridge_client.js ws://192.168.33.1:2020 0:,1:1,:2');
    console.log();
    console.log('This example starts the bridge client and connects to the WebSocket');
    console.log('server in 192.168.33.1 port 2020. Three MIDI devices (only input');
    console.log('port 0, input/output ports 1 and only output port 2) are bridged.');
    console.log();
}

// Program arguments
var args = process.argv.splice(2);
if (args.length < 2) {
    showUsage();
    utils.showPorts(new midi.input(), 'Current MIDI input port indexes');
    utils.showPorts(new midi.output(), 'Current MIDI output port indexes');
    process.exit(0);
}
var wsUrl = args[0];
var midiDevicesIndexes = utils.parseMidiDevicesIndexes(args[1]);

// List of MIDI devices for bridging
var midiDevices = [];

// Setup WebSocket client
var WebSocketClient = websocket.client;
var wsClient = new WebSocketClient();
wsClient.on('connectFailed', function (error) {
    utils.error('connection failed (' + error.toString() + ').');
});
wsClient.on('connect', function (connection) {
    connection.on('error', function (error) {
        utils.error('connection error (' + error.toString() + ').');
    });
    connection.on('close', function () {
        console.log('WebSocket connection closed.');
        process.exit(0);
    });
    midiDevicesIndexes.forEach(function (indexes) {
        var midiDevice = {input: undefined, output: undefined};
        if (indexes.input !== undefined) {
            var input = new midi.input();
            input.ignoreTypes(true, true, true);
            input.on('message', function (deltaTime, message) {
                midiDevices.forEach(function (device) {
                    if (device !== midiDevice && device.output !== undefined)
                        device.output.sendMessage(message);
                });
                if (connection.connected)
                    connection.sendBytes(new Buffer(message));
            });
            input.openPort(indexes.input);
            console.log('Using MIDI input: %s', input.getPortName(indexes.input));
            midiDevice.input = input;
        }
        if (indexes.output !== undefined) {
            output = new midi.output();
            output.openPort(indexes.output);
            console.log('Using MIDI output: %s', output.getPortName(indexes.output));
            midiDevice.output = output;
        }
        midiDevices.push(midiDevice);
    });
    connection.on('message', function (message) {
        if (message.type === 'binary') {
            var midiMessage = Array.prototype.slice.call(message.binaryData, 0);
            midiDevices.forEach(function (device) {
                if (device.output !== undefined)
                    device.output.sendMessage(midiMessage);
            });
        }
    });
    console.log('WebSocket client connected to \'%s\'.', wsUrl);
    console.log('Running. Use CTRL+C to stop.');
});
wsClient.connect(wsUrl, null);

// Setup process stop
process.on('SIGINT', function () {
    console.log('\nExiting ...');
    process.exit(0);
});
