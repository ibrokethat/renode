/**

  @module   bootstrap the app

*/
require("Object");

var system         = require("system");
var renderer       = require("renderer");
var registry       = require("registry");
var SequencerModel = require("./models/SequencerModel");
var sequencerView  = require("./views/SequencerView.html");
var renderView     = renderer.renderView;

var socket = io.connect("http://localhost");
// var socket = io.connect('http://192.168.1.82');
// var socket = io.connect('http://192.168.115.89');

socket.on("song/opened", function (data) {

  renderView({

    root: document.body,
    view: sequencerView,
    model: SequencerModel.spawn(data.song),
    controller: null

  });

  socket.on("sync", function(data) {

    if (data.hasOwnProperty("id")) {

      var object = registry.get(data.id);
      object.sync(data);

    }

  });

  system.on("sync", function(data) {

    socket.emit("sync", data);

  });


});
