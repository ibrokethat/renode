/**

  @module       Note
  @description  switch the root of the note to be rendered

*/
var partial = require("func").partial;

function resize (view, data) {

  view.style.width = data.model.duration;

}

function move (root, view, data) {

  var model = data.model;
  var step = root.querySelector('div[data-midi-note="' + model.midiNote + '"]>div[data-step="' + model.start + '"]');

  view.style.top = step.offsetTop + "px";
  view.style.left = step.offsetLeft + "px";

}

exports.render = function (data) {

  var root = data.root;
  var view = data.view;

  data.model.removeAllListeners("start");
  data.model.removeAllListeners("midiNote");
  data.model.removeAllListeners("duration");

  data.model.on("start", partial(move, root, view));
  data.model.on("midiNote", partial(move, root, view));
  data.model.on("duration", partial(resize, view));

  move(root, view, data);

  return data;

}
