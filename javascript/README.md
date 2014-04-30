MIDI WebSocket for JavaScript
=============================

Requirements
------------

The programs included depends on the very good [EventEmitter](http://github.com/Wolfy87/EventEmitter) library from Oliver Caldwell ([Wolfy87](http://github.com/Wolfy87)), make sure it is loaded before. For example:

```html
<script src="eventemitter.min.js"></script>
<script src="midiwsclient.js"></script>
```

MIDI WebSocket Client
---------------------

A very simple event-driven Midi WebSocket client for JavaScript. Example usage:

```javascript
var midiWsClient = new MidiWsClient('ws://someserver.domain:port/protocol/');
midiWsClient.on('connecting', function (wsUrl) {
    console.log('Connecting ...');
});
midiWsClient.on('connect', function() {
    console.log('Connected.');
});
midiWsClient.on('disconnect', function(event) {
    console.log('Disconnected (' + event.code + ')');
});
midiWsClient.on('error', function(event) {
    console.log('Error (' + event.message + ')');
});
midiWsClient.on('message', function(bytes) {
    console.log('Received MIDI bytes: ' + bytes);
});
midiWsClient.start();

// Also you can send data
midiWsClient.send(new Uint8Array([144, 0, 20]));
```