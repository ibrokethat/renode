/**

  @module       PatternEditorRenderer
  @description  renders a pattern editor based upon a set of standard midi data and current pattern

*/
var iter      = require("iter");
var midiUtils = require("../utils/midi");
var forEach   = iter.forEach;
var midiNotes = midiUtils.midiNotes;


exports.render = function (data) {

  var fragment = document.createDocumentFragment();
  var note;

  forEach(midiNotes, function (midiNote) {

    note = document.createElement("div");
    note.dataset.action = "create-note";
    note.dataset.midiNote = midiNote.midiNote;
    note.dataset.note = midiNote.note;
    note.className = /b$/.test(midiNote.note) ? "semi" : "whole";

    var div = document.createElement("div");
    div.appendChild(note);
    fragment.appendChild(div)

  });

  data.view.querySelector('div[data-has-many="notes"]').appendChild(fragment);

  return data;

};

