var midi      = require("midi");
var registry  = require("registry");
var iter      = require("iter");
var func      = require("func");
var midiUtils = require("../utils/midi");
var forEach   = iter.forEach;
var indexOf   = iter.indexOf;
var compose   = func.compose;
var partial   = func.partial;
var bind      = func.bind;

var song;
var time;
var diff;
var duration;
var playing = false;
var tickCount;
var patterns = {};
var cache = {};
var FRAMES_PER_BAR = midiUtils.FRAMES;

var midiOut = new midi.output();
var midiIn = new midi.input();

midiOut.openVirtualPort("renode");
midiIn.openVirtualPort("renode");


/*
  @description  determines howl long a frame should last in nano seconds
  @param        {number} bpm
  @return       {number}
*/
function frameDuration (bpm) {

  return parseInt((60000000000 / bpm * 4) / FRAMES_PER_BAR, 10);

}



/*
  @description  start playing the song
*/
function play() {

  playing = true;
  duration = frameDuration(song.bpm);
  time = process.hrtime();
  tickCount = 0;
  process.nextTick(nextTick);

}



/*
  @description  stops playing the song
*/
function stop () {

  playing = false;

}



/*
  @description  function executes on every process tick whilst song is playing
                it measures the time elapsed between frames and call playNotes
                at the correct moment in time
*/
function nextTick () {

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

    process.nextTick(nextTick);

  }

}


/*
  @description  fires all midi note events for the current frame
*/
function playNotes () {

  forEach(song.tracks.items, function(track) {

    if (registry.has(track.activePatternId)) {

      var pattern = registry.get(track.activePatternId);
      var notes = patterns[pattern.id][pattern.currentStep];

      if (notes) {

        forEach(notes, partial(playNote, track));

      }

      if (pattern.bars * FRAMES_PER_BAR === pattern.currentStep) {

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



/*
  @description  fires a single midi note
  @param        {TrackObject} track
  @param        {string} noteId
*/
function playNote (track, noteId) {

  var note = registry.get(noteId);

  midiOut.sendMessage([track.midiOn, note.midiNote, note.velocity]);
  setTimeout(bind(midiOut, midiOut.sendMessage, [track.midiOff, note.midiNote, note.VELOCITY_OFF]), note.duration);

}



/*
  @description  sets up the listeners on the song model
  @param        {SongModel} songModel
  @return       songModel
*/
function initSequencer (songModel) {

  song = songModel;

  song.on("state", function() {

    if (song.playing) {
      play();
    }
    else {
      stop();
    }

  });

  // return song;

}


function initTracks () {

  song.tracks.on("add", function (data) {
    initTrack(data.item);
  });

  forEach(song.tracks.items, compose(initPatterns, initTrack));

  // return song;

}


function initTrack (track) {

  track.on("activePatternId", patternPlaying);

  if (track.patterns.items.length) {
    track.activePatternId = track.nextPatternId = track.patterns.items[0].id;
  }

  return track;

}



function initPatterns (track) {

  track.patterns.on("add", function (data) {
    initPattern(data.item);
  });

  forEach(track.patterns.items, compose(initNotes, initPattern));

}


function initPattern (pattern) {

  var id = pattern.id;

  patterns[id] = {};
  cache[id] = {};

  pattern.notes.on("add", function (data) {
    loadNote(pattern, data.item);
  });

  pattern.notes.on("remove", function (data) {
    removeNote(pattern, data.item);
  });

  return pattern;
}



function initNotes (pattern) {

  forEach(pattern.notes.items, partial(loadNote, pattern));

}


function loadNote (pattern, note) {

  insertNote(pattern, note);

  note.on("start", function (data) {
    updateNote(pattern, data.model);
  });

}


function updateNote (pattern, note) {

  var start = cache[pattern.id][note.id];
  var notes = patterns[pattern.id][start];

  notes.splice(indexOf(notes, note.id), 1);

  insertNote(pattern, note);

}

function removeNote (pattern, note) {

  var start = cache[pattern.id][note.id];
  var notes = patterns[pattern.id][start];

  notes.splice(indexOf(notes, note.id), 1);

  delete cache[pattern.id][note.id];

}



function insertNote (pattern, note) {

  var start = note.start;

  cache[pattern.id][note.id] = start;

  patterns[pattern.id][start] = patterns[pattern.id][start] || [];
  patterns[pattern.id][start].push(note.id);

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

