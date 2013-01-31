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

var song;
var time;
var diff;
var duration;
var playing = false;
var FRAMES = 1920;
var tickCount;

function frameDuration (bpm) {

  return parseInt((60000000000 / bpm * 4) / FRAMES, 10);

}

function play() {

  playing = true;
  duration = frameDuration(song.bpm);
  time = process.hrtime();
  tickCount = 0;
  process.nextTick(nextFrame);

}


function stop () {

  playing = false;

}


function nextFrame () {

  diff = process.hrtime(time);

  if (playing) {

    if (diff[1] >= duration) {

      time = process.hrtime();
      playNotes();
      console.log(tickCount);
      tickCount = 0;

    }
    else {
      tickCount++;
    }

    process.nextTick(nextFrame);

  }

}


function playNotes () {

  forEach(song.tracks.items, function(track) {

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

}


function playNote (track, note) {

  midiOut.sendMessage([track.midiOn, note.midiNote, note.velocity]);
  setTimeout(bind(midiOut, midiOut.sendMessage, [track.midiOff, note.midiNote, note.VELOCITY_OFF]), note.duration);

}


function initSequencer (s) {

  song = s;

  song.on("state", function() {

    if (song.playing) {
      play();
    }
    else {
      stop();
    }

  });

  return song;

}


function initTracks () {

  song.tracks.on("add", function (data) {
    initTrack(data.item);
  });
  forEach(song.tracks.items, compose(initPatterns, initTrack));

  return song;

}


function initTrack (track) {

  track.on("activePatternId", patternPlaying);

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

    var start = note.start;

    pattern.steps[start] = pattern.steps[start] || [];
    pattern.steps[start].push(note);

  });

}


function patternPlaying (data) {

  if (registry.has(data.value)) {

    var pattern = registry.get(data.value);
    pattern.playing();

  }

}

exports.load = compose(
  initTracks,
  initSequencer
);

