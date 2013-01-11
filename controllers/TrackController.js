/*
  @desc   track controller
*/
var controllers          = require("controllers");
var partial              = require("func").partial;
var Pattern              = require("../models/PatternModel");
var controller           = controllers.controller;
var createInCollection   = controllers.createInCollection;
var removeFromCollection = controllers.removeFromCollection;
var copyInCollection     = controllers.copyInCollection;



exports["click:activate-pattern"] = partial(controller, function(e, track, pattern) {

  track.nextPatternId = pattern.id;

});


exports["click:deactivate-pattern"] = partial(controller, function(e, track, pattern) {

  track.nextPatternId = -1;

});


exports["click:create-pattern"] = partial(controller, partial(createInCollection, Pattern, "patterns"));


exports["click:delete-pattern"] = partial(controller, partial(removeFromCollection, "patterns"));


exports["click:copy-pattern"] = partial(controller, partial(copyInCollection, "patterns"));
