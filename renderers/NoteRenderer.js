/**

  @module       NoteRenderer
  @description  switch the root of the note to be rendered

*/
var midi    = require("../utils/midi");
var partial = require("func").partial;
var FRAMES  = midi.FRAMES;
var bars;

function resize (view, data) {

  view.style.width = data.model.duration;

}

function getRoot (root, model) {

  return root.querySelector('div[data-midi-note="' + model.midiNote + '"]');

}

function move (root, view, data) {

  var note = getRoot(root, data.model);
  note.appendChild(view);
  position(note, view, data.model);

}


function position (note, view, model) {

  view.style.top = note.offsetTop + "px";
  view.style.left = (note.clientWidth/100) * ((model.start/(bars * FRAMES)) * 100) + "px";

}

exports.render = function (data) {

  var root = data.root;
  var view = data.view;

  bars = parseInt(data.root.dataset.bars, 10);

  data.model.removeAllListeners("start");
  data.model.removeAllListeners("midiNote");
  data.model.removeAllListeners("duration");

  data.model.on("start", partial(move, root, view));
  data.model.on("midiNote", partial(move, root, view));
  data.model.on("duration", partial(resize, view));

  data.root = getRoot(root, data.model);
  position(data.root, view, data.model);

  return data;

}
