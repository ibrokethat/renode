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

//var time;
// var playing = false;
  //process.nextTick(partial(playNotes, sequencer));
  //playing = true;
  //playing = false;
  // time = process.hrtime();
  // time = process.hrtime(time);
  // [ 1, 552 ]
  // console.log('benchmark took %d nanoseconds', time[0] * 1e9 + time[1]);
  // if (playing) process.nextTick(partial(playNotes, sequencer));

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

    if (registry.has(track.activePatternId)) {

      var pattern = registry.get(track.activePatternId);
      var notes = pattern.steps[pattern.currentStep];

      if (notes) {

        forEach(notes, partial(playNote, track));

      }

      if (pattern.bars * sequencer.steps === pattern.currentStep) {

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
  track.patterns.on("add", function (data) {
    mapNotesToSteps(data.item);
  });

  if (track.patterns.items.length) {
    track.activePatternId = track.nextPatternId = track.patterns.items[0].id;
  }

  return track;

}



function initPatterns (track) {

  forEach(track.patterns.items, mapNotesToSteps);

}


function playing (data) {

  if (registry.has(data.value)) {
    var pattern = registry.get(data.value);
    pattern.playing();

  }

}


function mapNotesToSteps (pattern) {

  pattern.steps = [];

  forEach(pattern.notes.items, function (note) {
    pattern.steps[note.start] = pattern.steps[note.start] || [];
    pattern.steps[note.start].push(note);
  });

}

exports.load = compose(
  initTracks,
  initSequencer
);
