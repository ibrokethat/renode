var midi    = require("midi");
var registry= require("registry");
var iter    = require("iter");
var func    = require("func");
var forEach = iter.forEach;
var indexOf = iter.indexOf;
var compose = func.compose;
var partial = func.partial;
var bind    = func.bind;
var timer;

var inspect = require("util").inspect;

var midiOut = new midi.output();
midiOut.openVirtualPort("renode");

var midiIn = new midi.input();
midiIn.openVirtualPort("renode");

var time;
var diff;
var duration;
var playNext;
var FRAMES = 1920;

//  based on 1920 frames per bar
function frameDuration (bpm) {

  return parseInt((60000000000 / bpm * 4) / FRAMES, 10);

}

function play(sequencer) {

  playNext = partial(playNotes, sequencer);
  duration = frameDuration(sequencer.bpm);
  time = process.hrtime();
  process.nextTick(nextFrame);

}


function stop (sequencer) {

  playNext = false;

}


function nextFrame () {

  diff = process.hrtime(time);

  if (playNext) {

    if (diff[1] >= duration) {

      time = process.hrtime();
      playNext();

    }

    process.nextTick(nextFrame);

  }

}


function playNotes (sequencer) {

  // var time = process.hrtime();

  forEach(sequencer.tracks.items, function(track) {

    if (registry.has(track.activePatternId)) {

      var pattern = registry.get(track.activePatternId);
      var notes = pattern.steps[pattern.currentStep];

      if (notes) {

        forEach(notes, partial(playNote, track));

      }

      if (pattern.bars * FRAMES === pattern.currentStep) {

        if (track.activePatternId !== track.nextPatternId) {
          track.activePatternId = track.nextPatternId;
          pattern.stopped();
        }

        pattern.currentStep = 0;
      }
      else {
        pattern.currentStep++;
      }

    }
    else {

      if (track.activePatternId !== track.nextPatternId) {
        track.activePatternId = track.nextPatternId;
      }

    }

  });

  // var diff = process.hrtime(time);

  // while (diff[1] < duration) {

  //   diff = process.hrtime(time);

  // }
  // if (playNext) process.nextTick(playNext);

}


function playNote (track, note) {

  midiOut.sendMessage([track.midiOn, note.midiNote, note.velocity]);
  setTimeout(bind(midiOut, midiOut.sendMessage, [track.midiOff, note.midiNote, note.VELOCITY_OFF]), note.duration);

}


function initSequencer (sequencer) {

  sequencer.on("state", function() {

    if (sequencer.playing) {
      play(sequencer);
    }
    else {
      stop(sequencer);
    }

  });


  return sequencer;

}


function initTracks (sequencer) {

  sequencer.tracks.on("add", function (data) {
    initTrack(data.item);
  });
  forEach(sequencer.tracks.items, compose(initPatterns, initTrack));
  return sequencer;

}


function initTrack (track) {

  track.on("activePatternId", playing);

  if (track.patterns.items.length) {
    track.activePatternId = track.nextPatternId = track.patterns.items[0].id;
  }

  return track;

}



function initPatterns (track) {

  forEach(track.patterns.items, compose(mapNotesToSteps, initPattern));

}


function initPattern (pattern) {

  pattern.notes.on("add", function (data) {
    mapNotesToSteps(data.collection);
  });

  pattern.notes.on("update", function (data) {
    mapNotesToSteps(data.collection);
  });

  return pattern;
}



function mapNotesToSteps (pattern) {

  pattern.steps = [];

  forEach(pattern.notes.items, function (note) {

    var start = note.start * 20;

    pattern.steps[start] = pattern.steps[start] || [];
    pattern.steps[start].push(note);

  });

}


function playing (data) {

  if (registry.has(data.value)) {

    var pattern = registry.get(data.value);
    pattern.playing();

  }

}

exports.load = compose(
  initTracks,
  initSequencer
);

