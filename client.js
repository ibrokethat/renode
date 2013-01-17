/**

  @module   bootstrap the app

*/
require("Object");

var SequencerModel = require("./models/SequencerModel");
var sequencerView  = require("./views/SequencerView.html");
var system         = require("system");
var io, sequencer, server, file, sync;

document.body.innerHTML = sequencerView;


// render({
//   model: sequencer,
//   view:
// })



// socket = io.connect("http://localhost");
// socket = io.connect('http://192.168.1.82');
// socket = io.connect('http://192.168.115.89');
// sync = EventMachine.spawn();

// socket.on("/connection/initialised", function (data) {

//   sequencer = SequencerComponent.spawn(SequencerModel.spawn(data.song));
//   sequencer.render(document.body);
//   sequencer.addEventListeners();


// });

// socket.on("/sync", function(data) {

//   var object = registry.get(data.id);
//   object[data.methodName].sync.apply(object, data.args);

// });

// sync.on("/sync", function(data) {

//   socket.emit("/sync", data);

// });

// service.register("registry", registry);
// service.register("sync", sync);
// service.register("midi", {
//   input: {recieveMessage: function() {}},
//   output: {sendMessage: function() {}}
// });
