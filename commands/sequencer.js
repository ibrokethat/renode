var midi    = require("midi");
var registry= require("registry");
var iter    = require("iter");
var func    = require("func");
var forEach = iter.forEach;
var compose = func.compose;
var partial = func.partial;
var bind    = func.bind;
var timer;

var inspect = require("util").inspect;

var midiOut = new midi.output();
midiOut.openVirtualPort("renode");

var midiIn = new midi.input();
midiIn.openVirtualPort("renode");



function barDuration (bpm, steps) {

  return (60000 / bpm * 4) / steps;

}


function play(sequencer) {

  timer = setInterval(partial(playNotes, sequencer), barDuration(sequencer.bpm, sequencer.steps));

}


function stop (sequencer) {

  clearTimeout(timer);

}



function playNotes (sequencer) {

  forEach(sequencer.tracks.items, function(track) {

    var pattern = registry.get(track.activePatternId);

    if (pattern) {

      var notes = pattern.steps[pattern.currentStep];

      if (notes) {

        forEach(notes, partial(playNote, track));

      }

      if (pattern.bars * sequencer.steps === pattern.currentStep) {

        if (track.activePatternId !== track.nextPatternId) {
          track.activePatternId = track.nextPatternId
        }

        pattern.currentStep = 0;
      }
      else {
        pattern.currentStep++;
      }

    }
    else {

      if (track.activePatternId !== track.nextPatternId) {
        track.activePatternId = track.nextPatternId
      }

    }


  });

}


function playNote (track, note) {

  midiOut.sendMessage([track.midiOn, note.key, note.velocity]);
  setTimeout(bind(midiOut, midiOut.sendMessage, [track.midiOff, note.key, note.VELOCITY_OFF]), note.duration);
}


function initSequencer (sequencer) {

  sequencer.on("playing", function() {

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

  forEach(sequencer.tracks.items, compose(initPatterns, initTrack));

  return sequencer;

}


function initTrack (track) {

  track.activePatternId = track.nextPatternId = track.patterns.items[0].id;

  return track;

}



function initPatterns (track) {

  forEach(track.patterns.items, mapNotesToSteps);

}



function mapNotesToSteps (pattern) {

  Object.defineProperties(pattern, {
    "steps": {
      value: []
    }
  });

  forEach(pattern.notes.items, function (note) {
    pattern.steps[note.start] = pattern.steps[note.start] || [];
    pattern.steps[note.start].push(note);
  });

}

exports.load = compose(
  initTracks,
  initSequencer
);
