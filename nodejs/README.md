MIDI WebSocket for Node.js
==========================

Module Requirements
-------------------

The programs included require the following modules to be installed:

```shell
npm install midi
npm install websocket
```

Bridge Server
-------------

A MIDI streaming WebSocket bridge server. This program opens one or more local MIDI devices and bridges everything together also with connected WebSocket clients. All data received on each MIDI input or WebSocket client is relayed to all MIDI outputs and connected clients taking care of not echoing data back to the originating device or client.

**Usage:**
```shell
node bridge_server.js [wsPort] [midiDevices] [sendersPrefix]
```

* ```wsPort``` is the local port to use for incoming WebSocket connections.

* ```midiDevices``` is a comma separated list of input/output MIDI port index pairs (separated by a semi-colon ```:```) defining local MIDI devices. If a device only has either an input or output, leave the counterpart index blank. For example ```0:0``` defines a MIDI device with ```input port 0``` and ```output port 0```, ```1:``` defines a MIDI device with only ```input port 1``` and ```:2``` defines a MIDI device with only ```output port 2```. Finally, you can use an empty string for this parameter for no local MIDI ports bridging.

* ```sendersPrefix``` is an IP address prefix to match WebSocket clients when they try to send MIDI data to the server. The matching decides if this is allowed or not.

**Tip:** To see a list of available MIDI ports and their indexes, run the program without arguments.

**Example:**
```shell
node bridge_server.js 2020 0:,1:1,:2 192.168.1.
```

This example starts the bridge server using WebSocket port ```2020```, the following three MIDI devices:

1. with ```input port 0``` only
2. with ```input port 1``` and ```output port 1```
3. with ```output port 2``` only

and also WebSocket clients with IP addresses starting with ```192.168.1.``` will be allowed to send MIDI data to the server.

Bridge Client
-------------

A MIDI streaming WebSocket bridge client. This program opens one or more local MIDI devices and bridges everything together with a WebSocket connection to the server program above. All data received on each MIDI input or the WebSocket connection is relayed to all MIDI outputs and the WebSocket connection taking care of not echoing data back to the originating device or WebSocket connection.

**Usage:**
```shell
node bridge_client.js [wsServerUrl] [midiDevices]
```

* ```wsServerUrl``` is the WebSocket server URL (ws://server:port) to connect the client to.

* ```midiDevices``` is a comma separated list of input/output MIDI port index pairs (separated by a semi-colon ```:```) defining local MIDI devices. If a device only has either an input or output, leave the counterpart index blank. For example ```0:0``` defines a MIDI device with ```input port 0``` and ```output port 0```, ```1:``` defines a MIDI device with only ```input port 1``` and ```:2``` defines a MIDI device with only ```output port 2```. Finally, you can use an empty string for this parameter for no local MIDI ports bridging.

**Tip:** To see a list of available MIDI ports and their indexes, run the program without arguments.

**Example:**
```shell
node bridge_client.js ws://192.168.33.1:2020 0:,1:1,:2
```

This example starts the bridge client and connects to the WebSocket server in ```192.168.33.1``` using port ```2020```. Three local MIDI devices are bridged with the WebSocket connection:

1. with ```input port 0``` only
2. with ```input port 1``` and ```output port 1```
3. with ```output port 2``` only
