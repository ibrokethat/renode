/*

  @module       utils/midi
  @description: midi utils

*/
var iter    = require("iter");
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


var channelGenerator = (function () {

  var on = 144;
  var off = 128;

  return function () {

    return {
      on: on++,
      off: off++
    };
  }

}());


exports.FRAMES = 1920;
exports.channels = imap(range(0, 15), channelGenerator);
exports.midiNotes = imap(range(0, 127), noteGenerator);
