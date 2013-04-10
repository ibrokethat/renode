/*

  @module       utils/midi
  @description: midi utils

*/
var iter   = require("iter");
var map    = iter.map;
var range  = iter.range;

var notes = ["C", "Db", "D", "Eb", "E", "F", "Gb", "G", "Ab", "A", "Bb", "B"];

var getNote = (function () {

  var i = 0;
  var octave = -1;

  return function (midiNote) {

    if (midiNote === 0) {
      i = 0;
      octave = -1;
    }
    else if (!notes[i]) {
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


function getChannel (channel) {

  var on = 143;
  var off = 127;

  return {
    channel: channel,
    midiOn : on + channel,
    midiOff: off + channel
  };
}


exports.FRAMES = 1920;
exports.getChannel = getChannel;
exports.getNote = getNote;
exports.channels = map(range(1, 16), getChannel);
exports.midiNotes = map(range(0, 127), getNote);
