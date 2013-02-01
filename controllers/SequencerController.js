/*

  @desc   sequencer controller


*/
var controllers          = require("controllers");
var partial              = require("func").partial;
var Track                = require("../models/TrackModel");
var controller           = controllers.controller;
var createInCollection   = controllers.createInCollection;
var removeFromCollection = controllers.removeFromCollection;


exports["click:play"] = partial(controller, function(e, song) {

  song.play();

});


exports["click:stop"] = partial(controller, function(e, song) {

  song.stop();

});


exports["click:create-track"] = partial(controller, partial(createInCollection, Track, "tracks", false));


exports["click:delete-track"] = partial(controller, partial(removeFromCollection, "tracks"));
