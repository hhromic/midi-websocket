# MIDI WebSocket Bridging Client/Server for Node.js

## Installation

To install, use `npm`:

    npm install -g midi-ws-bridge

The package provides two programs: `midi-ws-server` and `midi-ws-client`.

## Bridge Server

A MIDI streaming WebSocket bridge server. This program opens one or more local MIDI devices and bridges everything together also with connected WebSocket clients. All data received on each MIDI input or WebSocket client is relayed to all MIDI outputs and connected clients taking care of not echoing data back to the originating device or client.

    usage: midi-ws-server [-h] [-v] [-l] [-p PORT] [-d DEVICES] [-P PREFIX]

    MIDI WebSocket Bridging Client/Server for Node.js

    Optional arguments:
      -h, --help            Show this help message and exit.
      -v, --version         Show program's version number and exit.
      -l, --list-midi-devices
                            List available local MIDI devices and exit
      -p PORT, --port PORT  Server port (default: 5000)
      -d DEVICES, --midi-devices DEVICES
                            Local MIDI devices to bridge (default: none)
      -P PREFIX, --clients-prefix PREFIX
                            IP address prefix for accepting clients (default:
                            allow all)

* `-d, --midi-devices` is a comma separated list of input/output MIDI port index pairs (separated by a semi-colon `:`) defining local MIDI devices. Use the `-l, --list-midi-devices` switch to get the current mapping of MIDI devices indexes in your system. If a device only has either an input or output, leave the counterpart index blank. For example `0:0` defines a MIDI device with `input port 0` and `output port 0`, `1:` defines a MIDI device with only `input port 1` and `:2` defines a MIDI device with only `output port 2`. Finally, if you don't specify this argument, no local MIDI ports bridging is done.
* `-P, --clients-prefix` is an IP address prefix to match WebSocket clients when they try to connect to the server. The matching decides if this is allowed or not.

### Example

    midi-ws-server -p 2020 -d 0:,1:1,:2 -P 192.168.1.

This example starts the bridge server using WebSocket port `2020`, the following three MIDI devices:

1. with `input port 0` only
2. with `input port 1` and `output port 1`
3. with `output port 2` only

and also only WebSocket clients with IP addresses starting with `192.168.1.` will be allowed to connect to the server.

## Bridge Client

A MIDI streaming WebSocket bridge client. This program opens one or more local MIDI devices and bridges everything together with a WebSocket connection to the server program above. All data received on each MIDI input or the WebSocket connection is relayed to all MIDI outputs and the WebSocket connection taking care of not echoing data back to the originating device or WebSocket connection.

    usage: midi-ws-client [-h] [-v] [-l] [-u URL] [-d DEVICES]

    MIDI WebSocket Bridging Client/Server for Node.js

    Optional arguments:
      -h, --help            Show this help message and exit.
      -v, --version         Show program's version number and exit.
      -l, --list-midi-devices
                            List available local MIDI devices and exit
      -u URL, --ws-url URL  WebSocket server URL to connect (default:
                            ws://localhost:5000)
      -d DEVICES, --midi-devices DEVICES
                            Local MIDI devices to bridge (default: none)

* `-d, --midi-devices` is a comma separated list of input/output MIDI port index pairs (separated by a semi-colon `:`) defining local MIDI devices. Use the `-l, --list-midi-devices` switch to get the current mapping of MIDI devices indexes in your system. If a device only has either an input or output, leave the counterpart index blank. For example `0:0` defines a MIDI device with `input port 0` and `output port 0`, `1:` defines a MIDI device with only `input port 1` and `:2` defines a MIDI device with only `output port 2`. Finally, if you don't specify this argument, no local MIDI ports bridging is done.

### Example

    midi-ws-client -u ws://192.168.33.1:2020 -d 0:,1:1,:2

This example starts the bridge client and connects to the WebSocket server in `192.168.33.1` using port `2020`. Three local MIDI devices are bridged with the WebSocket connection:

1. with `input port 0` only
2. with `input port 1` and `output port 1`
3. with `output port 2` only

## License

This software is under the **Apache License 2.0**.

    Licensed under the Apache License, Version 2.0 (the "License");
    you may not use this file except in compliance with the License.
    You may obtain a copy of the License at

        http://www.apache.org/licenses/LICENSE-2.0

    Unless required by applicable law or agreed to in writing, software
    distributed under the License is distributed on an "AS IS" BASIS,
    WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
    See the License for the specific language governing permissions and
    limitations under the License.
