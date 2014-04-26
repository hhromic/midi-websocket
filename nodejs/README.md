MIDI WebSocket for Node.JS
==========================

Two example programs are included for MIDI WebSocket for NodeJS.

Module Requirements
-------------------

The programs included require the following modules to be installed:

```shell
npm install midi
npm install websocket
```

Bridge Server
-------------

A MIDI streaming WebSocket bridge server.

*Usage:*
```shell
node bridge_server.js [wsPort] [midiDevices] [sendersPrefix]
```

* ```wsPort``` is the local port to use for incoming WebSocket connections.

* ```midiDevices``` is a comma separated list of input/output MIDI port index pairs defining local MIDI devices. If a device only has either an input or output, leave the counterpart index blank. For example, "0:0" defines a MIDI device with input port 0 and output port 0, "1:" defines a MIDI device with only input port 1 and ":2" defines a MIDI device with only output port 2. Finally, you can use an empty string for no local MIDI ports bridging.

* ```sendersPrefix``` is an IP address prefix to match WebSocket clients when they try to send MIDI data. Matching decides if allowed or not.

*Example:*
```shell
node bridge_server.js 2020 0:,1:1,:2 192.168.1.
```

This example starts the bridge server using WebSocket port 2020, three MIDI devices (only input port 0, input/output ports 1 and only output port 2) and allow WebSocket clients with IP addresses starting with "192.168.1." to send MIDI data.

Bridge Client
-------------

A MIDI streaming WebSocket bridge client.

*Usage:*
```shell
node bridge_client.js [wsServerUrl] [midiDevices]
```

* ```wsServerUrl``` is the WebSocket server URL (ws://server:port) to connect the client to.

* ```midiDevices``` is a comma separated list of input/output MIDI port index pairs defining local MIDI devices. If a device only has either an input or output, leave the counterpart index blank. For example, "0:0" defines a MIDI device with input port 0 and output port 0, "1:" defines a MIDI device with only input port 1 and ":2" defines a MIDI device with only output port 2. Finally, you can use an empty string for no local MIDI ports bridging.

*Example:*
```shell
node bridge_client.js ws://192.168.33.1:2020 0:,1:1,:2
```

This example starts the bridge client and connects to the WebSocket server in 192.168.33.1 port 2020. Three MIDI devices (only input port 0, input/output ports 1 and only output port 2) are bridged.
