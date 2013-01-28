/*

@desc   pattern editor controller


*/
var controllers          = require("controllers");
var partial              = require("func").partial;
var iter                 = require("iter");
var Note                 = require("../models/NoteModel");
var registry             = require("registry");
var controller           = controllers.controller;
var createInCollection   = controllers.createInCollection;
var removeFromCollection = controllers.removeFromCollection;
var forEach              = iter.forEach;
var indexOf              = iter.indexOf;


var notes = [];
var nodes = []
var modifiers = [];
var currentNote = false;
var dragTarget = false;
var currentTarget = false;


function selectNote (note, node) {

  note.edit = true;
  notes.push(note);
  nodes.push(node);

}

function deselectNote (note) {

  var index = indexOf(notes, note);

  if (index > -1) {

    notes.splice(index, 1);
    nodes.splice(index, 1);
    note.edit = false;

  }

}

function resetSelection () {

  forEach(notes, function (note, i) {
    note.edit = false;
  });

  notes = [];
  nodes = [];

}


function update (note, i) {

  note.start = currentNote.start + modifiers[i].start;
  note.midiNote = currentNote.midiNote + modifiers[i].midiNote;

}


function initNoteData (e) {

  var target = e.delegateTarget || e.target;

  return {
    start: parseInt(target.dataset.step, 10),
    midiNote: parseInt(target.parentNode.dataset.midiNote, 10)
  }

}


document.addEventListener("keypress", function (e) {

  var editor = document.querySelector('[data-controller="PatternEditorController"]');

  if (editor && e.ctrlKey && e.shiftKey) {

    if (e.keyCode === 1) {

      notes = [];
      nodes = [];
      var pattern = registry.get(editor.dataset.id);
      forEach(pattern.notes.items, function (note) {
        selectNote(note, document.querySelector('[data-id="' + note.id + '"]'));
      });
    }
    else if (e.keyCode === 9) {
      resetSelection();
    }
  }

}, false);


exports["click"] = partial(controller, function (e, pattern, note) {

  var action = e.target.dataset.action;

  if (action === "create-note") {

    createInCollection(Note, "notes", initNoteData, e, pattern);

  }
  else if (action === "select") {

    if (e.ctrlKey || e.shiftKey) return;

    e.stopPropagation();

    dragTarget = false;

    if (e.altKey) {
      deselectNote(note);
      removeFromCollection("notes", e, pattern, note);
    }
    else if (note.edit) {
      deselectNote(note);
    }
    else {
      selectNote(note, e.target);
    }

  }

});


exports["mousedown:select"] = partial(controller, function (e, pattern, note) {

  if (e.ctrlKey || e.shiftKey) {

    dragTarget = e.delegateTarget;
    modifiers = [];

    if (!note.edit) {

      resetSelection();
      selectNote(note, dragTarget);

    }


    forEach(nodes, function (node, i) {

      modifiers[i] = {
        start: (notes[i].start - note.start),
        midiNote: (notes[i].midiNote - note.midiNote)
      };

    });

  }


});


exports["mouseover"] = function (e) {

  if (!dragTarget) return;
  if (!e.target.dataset.step) return;
  if (currentTarget === e.target) return;

  currentTarget = e.target;

  currentNote = initNoteData(e);

  forEach(notes, update);

};

exports["mouseup"] = function (e) {

  if (!dragTarget) return;

  forEach(notes, update);

  currentNote = false;
  currentTarget = false;
  dragTarget = false;

}
