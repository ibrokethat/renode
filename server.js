#!/usr/bin/env node

/**

  @module   bootstrap the app

*/
require("Object");

//  start our server
var http              = require("http");
var events            = require("events");
var nodeStatic        = require("node-static");
var socket            = require("socket.io");
var SequencerModel    = require("./models/SequencerModel");
var sequencerCommands = require("./commands/sequencer");
var song              = require("./song");
var system            = require("system");
var registry          = require("registry");

//  set up the file server
var file = new nodeStatic.Server("htdocs", {
  cache: 0,
  headers: {
    "X-App":"renode"
  }
});

var server = http.createServer(function (request, response) {

  request.on("end", function () {
    //
    // Serve files!
    //
    file.serve(request, response, function (err, res) {
      if (err) { // An error as occured
        console.error("> Error serving " + request.url + " - " + err.message);
        response.writeHead(err.status, err.headers);
        response.end();
      }
      else { // The file was served successfully
        console.log("> " + request.url + " - " + res.message);
      }
    });
  });
});

server.listen(8080);

console.info("> renode ui: http://127.0.0.1:8080");

sequencer = SequencerModel.spawn(song);

sequencerCommands.load(sequencer);


//  set up the socket
io = socket.listen(server);

io.sockets.on("connection", function (socket) {

  socket.emit("song/opened", {
    song: song
  });

  socket.on("sync", function(data) {

    var object = registry.get(data.id);
    if (object) object.sync(data);

    socket.broadcast.emit("sync", data);

  });

  system.on("sync", function(data) {

    socket.broadcast.emit("sync", data);

  });


});

//  eventually

// socket.on("open/song", function (data.song) {

//   couch.db.get(data.song, function (song) {

//     socket.emit("song/opened", {
//       song: song
//     })

//   });

// });

