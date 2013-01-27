/**

@module       PatternEditorRenderer
@description  renders a pattern editor based upon a set of standard midi data and current pattern

*/
var iter    = require("iter");
var forEach = iter.forEach;
var imap    = iter.imap;
var range   = iter.range;

var notes = ["C", "Db", "D", "Eb", "E", "F", "Gb", "G", "Ab", "A", "Bb", "B"];

var noteGenerator = (function () {

  var i = 0;
  var octave = -1;

  return function (midiNote) {

    if (!notes[i]) {
      i = 0;
      octave++;
    }

    return {
      note: notes[i++],
      octave: octave,
      midiNote: midiNote
    };
  }

}());

var midiNotes = imap(range(0, 127), noteGenerator);

exports.render = function (data) {

  var fragment = document.createDocumentFragment();
  var note;

  forEach(midiNotes, function (midiNote) {

    if (note) {
      note = note.cloneNode(true);
    }
    else {

      note = document.createElement("div");
      forEach(range(0, data.model.bars * 127), function (i) {

        var step = document.createElement("div");
        step.dataset.step = i;
        step.dataset.action = "create-note";
        note.appendChild(step);

      });
    }

    note.dataset.midiNote = midiNote.midiNote;
    note.dataset.note = midiNote.note;
    note.className = /b$/.test(midiNote.note) ? "semi" : "whole";

    fragment.appendChild(note)

  });

  data.view.appendChild(fragment);

  return data;

};

