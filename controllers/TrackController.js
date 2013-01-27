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


exports["click:activate"] = partial(controller, function(e, track, pattern) {

  if (track.locked) return;

  if (track.activePatternId === pattern.id) {

      track.nextPatternId = "-1";
  }
  else {

    track.nextPatternId = pattern.id;
    pattern.pending();

  }

});

exports["dblclick:activate"] = partial(controller, function(e, track, pattern) {

  if (track.locked) return;

  pattern.edit = true;
  track.locked = true;

});


exports["click:create-pattern"] = partial(controller, partial(createInCollection, Pattern, "patterns", false));


exports["click:delete-pattern"] = partial(controller, partial(removeFromCollection, "patterns"));


exports["click:copy-pattern"] = partial(controller, partial(copyInCollection, "patterns"));
