/*

@desc   pattern editor controller


*/
var controllers          = require("controllers");
var partial              = require("func").partial;
var iter                 = require("iter");
var Note                 = require("../models/NoteModel");
var registry             = require("registry");
var midi                 = require("../utils/midi");
var controller           = controllers.controller;
var createInCollection   = controllers.createInCollection;
var removeFromCollection = controllers.removeFromCollection;
var forEach              = iter.forEach;
var indexOf              = iter.indexOf;
var FRAMES               = midi.FRAMES;

var bars;
var notes = [];
var nodes = []
var modifiers = [];
var currentNote = false;
var dragTarget = false;
var currentTarget = false;
var mouseMovementX;

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

  note.start = Math.round(((bars * FRAMES)/100) * ((nodes[i].offsetLeft/nodes[i].parentNode.clientWidth) * 100));
  note.midiNote = currentNote + modifiers[i].midiNote;

}


function move (node, i) {

  node.style.top = currentTarget.offsetTop + modifiers[i].top + "px";
  node.style.left = (node.offsetLeft + movementX) + "px";

}

function moveAll () {

  forEach(nodes, move);

}


function noteData (target) {

  return parseInt(target.dataset.midiNote, 10);

}

function initNoteData (e) {

  return {
    start: Math.round(((bars * FRAMES)/100) * ((e.clientX/e.target.clientWidth) * 100)),
    midiNote: noteData(e.delegateTarget || e.target)
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

    bars = pattern.bars;
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

    bars = pattern.bars;

    forEach(nodes, function (node, i) {

      modifiers[i] = {
        top:  (node.offsetTop - dragTarget.offsetTop),
        // left: (node.offsetLeft - dragTarget.offsetLeft),
        // start: (node.offsetLeft - note.start),
        midiNote: (notes[i].midiNote - note.midiNote)
      };
    });

  }


});


exports["mouseover"] = function (e) {

  if (!dragTarget) return;
  if (!e.target.dataset.midiNote) return;

  currentTarget = e.target;

};


exports["mousemove"] = function (e) {

  if (!dragTarget) return;
  movementX = e.webkitMovementX;
  window.requestAnimationFrame(moveAll);

};


exports["mouseup"] = function (e) {

  if (!dragTarget) return;

  dragTarget = false;

  currentNote = noteData(currentTarget);

  forEach(notes, update);

  currentNote = false;
  currentTarget = false;

}
