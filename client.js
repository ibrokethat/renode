/**

  @module   bootstrap the app

*/
require("Object");

var system         = require("system");
var renderer       = require("renderer");
var registry       = require("registry");
var SongModel      = require("./models/SongModel");
var sequencerView  = require("./views/SequencerView.html");
var renderView     = renderer.renderView;
var clean          = renderer.clean;
var song;

var socket = io.connect("http://localhost");
// var socket = io.connect('http://192.168.1.82');
// var socket = io.connect('http://192.168.115.89');

socket.on("connect", function () {

  song = null;

});

socket.on("song/opened", function (data) {

  song = SongModel.spawn(data.song);

  renderView({

    root: document.body,
    view: sequencerView,
    model: song,
    controller: null

  });

  socket.on("sync", function(data) {

    if (registry.has(data.id)) {
      var object = registry.get(data.id);
      object.sync(data);
    }

  });

  system.on("sync", function(data) {

    socket.emit("sync", data);

  });


});


socket.on("disconnect", function () {

  clean(document.body);
  registry.__flush__();
  sequencerModel = null;

});


window.get = registry.get;
