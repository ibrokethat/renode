#!/usr/bin/env node

/**

  @module   bootstrap the app

*/
require("Object");

//  start our server
// var http           = require("http");
// var nodeStatic     = require("node-static");
// var socket         = require("socket.io");
// var midi           = require("lib/midi");
// var registry       = require("lib/registry");
// var service        = require("lib/service");
// var EventMachine   = require("lib/EventMachine");
var SequencerModel = require("./models/SequencerModel");
var sequencerCommands = require("./commands/sequencer");
var song           = require("./song");
var system         = require("system");
var io, sequencer, server, file, sync;

var path = require("path");

console.log(path.resolve(".", "./models/SequencerModel"));


//  set up the file server
// file = new(nodeStatic.Server)("htdocs", {
//   cache: 0,
//   headers: {
//     "X-App":"renode"
//   }
// });

// server = http.createServer(function (request, response) {

//   request.on("end", function () {
//     //
//     // Serve files!
//     //
//     file.serve(request, response, function (err, res) {
//       if (err) { // An error as occured
//         console.error("> Error serving " + request.url + " - " + err.message);
//         response.writeHead(err.status, err.headers);
//         response.end();
//       }
//       else { // The file was served successfully
//         console.log("> " + request.url + " - " + res.message);
//       }
//     });
//   });
// });

// server.listen(8080);

// console.log("> node-static is listening on http://127.0.0.1:8080");

//  set up the socket
// sync = EventMachine.spawn();

// io = socket.listen(server);

// io.sockets.on("connection", function (socket) {

//   socket.emit("/connection/initialised", {
//     song: song
//   });

//   socket.on("/sync", function(data) {

//     var object = registry.get(data.id);
//     object[data.methodName].sync.apply(object, data.args);

//     socket.broadcast.emit("/sync", data);

//   });

//   sync.on("/sync", function(data) {

//     socket.broadcast.emit("/sync", data);

//   });


// });

// service.register("registry", registry);
// service.register("sync", sync);
// service.register("midi", midi);

//  eventually

// socket.on("open/song", function (data.song) {

//   couch.db.get(data.song, function (song) {

//     socket.emit("song/opened", {
//       song: song
//     })

//   });

// });

sequencer = SequencerModel.spawn(song);

sequencerCommands.load(sequencer);

setTimeout(function () {

  sequencer.playing = true;

}, 200);


setTimeout(function () {

  sequencer.tracks.items[0].nextPatternId = sequencer.tracks.items[0].patterns.items[1].id;

}, 7500);

// var inspect = require("util").inspect;
// // console.log(inspect(sequencer, true, null, true));

// sequencer.on("locked", function() {
//   console.log(sequencer.locked);
// });

// system.on("sync", function(data) {
//   console.log(inspect(data, true, null, true));
// });

// setTimeout(function () {
//   sequencer.edit = true;
// }, 1000);


// setTimeout(function () {
//   sequencer.edit = false;
// }, 2000);
