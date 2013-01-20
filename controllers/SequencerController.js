/*

  @desc   sequencer controller


*/
var controllers          = require("controllers");
var partial              = require("func").partial;
var Track                = require("../models/TrackModel");
var controller           = controllers.controller;
var createInCollection   = controllers.createInCollection;
var removeFromCollection = controllers.removeFromCollection;


exports["click:play"] = partial(controller, function(e, sequencer) {

  sequencer.play();

});


exports["click:stop"] = partial(controller, function(e, sequencer) {

  sequencer.stop();

});


exports["click:create-track"] = partial(controller, partial(createInCollection, Track, "tracks"));


exports["click:delete-track"] = partial(controller, partial(removeFromCollection, "tracks"));
