/**
 * MIDI streaming WebSocket bridge server.
 *
 * Hugo Hromic - http://github.com/hhromic
 * MIT license
 */

// Required modules
var http = require('http');
var websocket = require('websocket');
var midi = require('midi');
var utils = require('./utils.js');

// Show program usage
function showUsage () {
    console.log('Usage: [wsPort] [midiDevices] [sendersPrefix]');
    console.log();
    console.log('wsPort is the local port to use for incoming WebSocket connections.');
    console.log();
    console.log('midiDevices is a comma separated list of input/output MIDI port');
    console.log('index pairs defining local MIDI devices. If a device only has');
    console.log('either an input or output, leave the counterpart index blank.');
    console.log('For example, "0:0" defines a MIDI device with input port 0 and');
    console.log('output port 0, "1:" defines a MIDI device with only input port 1');
    console.log('and ":2" defines a MIDI device with only output port 2.');
    console.log('You can use an empty string for no local MIDI ports bridging.');
    console.log();
    console.log('sendersPrefix is an IP address prefix to match WebSocket clients when');
    console.log('they try to send MIDI data. Matching decides if allowed or not.');
    console.log();
    console.log('Example usage:');
    console.log('> node bridge_server.js 2020 0:,1:1,:2 192.168.1.');
    console.log();
    console.log('This example starts the bridge server using WebSocket port 2020,');
    console.log('three MIDI devices (only input port 0, input/output ports 1 and');
    console.log('only output port 2) and allow WebSocket clients with IP addresses');
    console.log('starting with "192.168.1." to send MIDI data.');
    console.log();
}

// Program arguments
var args = process.argv.splice(2);
if (args.length < 3) {
    showUsage();
    utils.showPorts(new midi.input(), 'Current MIDI input port indexes');
    utils.showPorts(new midi.output(), 'Current MIDI output port indexes');
    process.exit(0);
}
var wsPort = parseInt(args[0]) || utils.error('invalid port number given.');
var midiDevicesIndexes = utils.parseMidiDevicesIndexes(args[1]);
var sendersPrefix = args[2];

// List of MIDI devices for bridging
var midiDevices = [];

// Create HTTP and WebSocket servers
var WebSocketServer = websocket.server;
var httpServer = http.createServer(function (request, response) {
    response.writeHead(404);
    response.end();
});
var wsServer = new WebSocketServer({
    httpServer: httpServer, autoAcceptConnections: false
});

// Setup HTTP server
httpServer.on('error', function (data) {
    utils.error('http server error (' + data + ').');
});
httpServer.on('listening', function () {
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
                wsServer.broadcastBytes(new Buffer(message));
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
    console.log('WebSocket server listening on port %d.', wsPort);
    console.log('Using \'%s\' as IP prefix for incoming messages.', sendersPrefix);
    console.log('Running. Use CTRL+C to stop.');
});
httpServer.listen(wsPort);

// Setup WebSocket server
wsServer.on('request', function (request) {
    var connection = request.accept(null, request.origin);
    console.log('%s connected - Protocol version %d',
        connection.remoteAddress, connection.webSocketVersion);

    // 'close' event handler
    connection.on('close', function (reasonCode, description) {
        console.log('%s disconnected.', connection.remoteAddress);
    });

    // 'message' event handler
    connection.on('message', function (message) {
        if (message.type === 'binary' && connection.remoteAddress.indexOf(sendersPrefix) == 0) {
            var midiMessage = Array.prototype.slice.call(message.binaryData, 0);
            midiDevices.forEach(function (device) {
                if (device.output !== undefined)
                    device.output.sendMessage(midiMessage);
            });
            wsServer.connections.forEach(function (client) {
                if (client !== connection)
                    client.sendBytes(message.binaryData);
            });
        }
    });
});

// Setup process stop
process.on('SIGINT', function () {
    console.log('\nExiting ...');
    process.exit(0);
});
