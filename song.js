/**

  @module       song
  @description  test beats

*/

// 0
// 16
// 32
// 48
// 64
// 80
// 96
// 112

module.exports = {

  "title" : "Test beats",
  "bpm"   : 120,
  "steps" : 128,

  "tracks": [
    {
      "title"     : "Drum machine",
      "midiOn"    : 144,
      "midiOff"   : 128,
      "program"   : 192,
      "instrument": 14,
      "patterns"  : [
        {
          "bars": 1, // ((1-16) * 8) - 1
          "notes"    : [
            {"start": 0, "key": 36, "velocity": 127, "duration": 1000},
            {"start": 32, "key": 40, "velocity": 127, "duration": 120},
            {"start": 48, "key": 36, "velocity": 127, "duration": 120},
            {"start": 64, "key": 36, "velocity": 127, "duration": 120},
            {"start": 72, "key": 36, "velocity": 127, "duration": 120},
            {"start": 96, "key": 40, "velocity": 127, "duration": 120}
          ]
        },
        {
          "bars": 1,
          "notes"    : [
            {"start": 0, "key": 36, "velocity": 127, "duration": 120},
            {"start": 16, "key": 47, "velocity": 80, "duration": 500},
            {"start": 32, "key": 40, "velocity": 127, "duration": 120},
            {"start": 32, "key": 46, "velocity": 65, "duration": 120},
            {"start": 48, "key": 36, "velocity": 127, "duration": 120},
            {"start": 64, "key": 36, "velocity": 127, "duration": 120},
            {"start": 72, "key": 36, "velocity": 127, "duration": 120},
            {"start": 80, "key": 47, "velocity": 80, "duration": 120},
            {"start": 96, "key": 40, "velocity": 127, "duration": 120},
            {"start": 96, "key": 46, "velocity": 65, "duration": 120},
            {"start": 112, "key": 47, "velocity": 80, "duration": 120}
          ]
        },
        {
          "bars": 1,
          "notes"    : [
            {"start": 0, "key": 36, "velocity": 127, "duration": 120},
            {"start": 0, "key": 46, "velocity": 65, "duration": 120},
            {"start": 16, "key": 46, "velocity": 80, "duration": 120},
            {"start": 32, "key": 40, "velocity": 127, "duration": 120},
            {"start": 32, "key": 46, "velocity": 65, "duration": 120},
            {"start": 48, "key": 36, "velocity": 127, "duration": 120},
            {"start": 48, "key": 46, "velocity": 80, "duration": 120},
            {"start": 64, "key": 36, "velocity": 127, "duration": 120},
            {"start": 64, "key": 46, "velocity": 80, "duration": 120},
            {"start": 72, "key": 36, "velocity": 127, "duration": 120},
            {"start": 80, "key": 46, "velocity": 80, "duration": 120},
            {"start": 96, "key": 40, "velocity": 127, "duration": 120},
            {"start": 96, "key": 46, "velocity": 65, "duration": 120},
            {"start": 112, "key": 46, "velocity": 80, "duration": 120}
          ]
        }
      ]
    },
    {
      "title"   : "Base Line",
      "midiOn"  : 145,
      "midiOff" : 129,

      "patterns": [
        {
          "bars": 1,
          "notes"   : [
            {"start": 0, "key": 36, "velocity": 127, "duration": 100},
            {"start": 12, "key": 56, "velocity": 127, "duration": 100},
            {"start": 32, "key": 56, "velocity": 127, "duration": 100},
            {"start": 64, "key": 36, "velocity": 127, "duration": 100},
            {"start": 96, "key": 66, "velocity": 127, "duration": 100}
          ]
        },
        {
          "bars": 1,
          "notes"   : [
            {"start": 0, "key": 36, "velocity": 127, "duration": 100},
            {"start": 12, "key": 56, "velocity": 127, "duration": 100},
            {"start": 16, "key": 68, "velocity": 127, "duration": 100},
            {"start": 24, "key": 68, "velocity": 127, "duration": 100},
            {"start": 32, "key": 56, "velocity": 127, "duration": 100},
            {"start": 64, "key": 36, "velocity": 127, "duration": 100},
            {"start": 96, "key": 66, "velocity": 127, "duration": 100}
          ]
        }
      ]
    }
  ]
};

/*

  1 bar has 128 steps (0 - 127)
  1 beat has 32 steps

  1   e   an   d   2   e   an   d   3   e   an   d   4   e   an   d

  0   8   16   24  32  40  48   56  64  72  80   88  96  104 112  120

  128              160              192              224

  256              288              320              352

  384              416              448              480


  bpm = 120

  bar duration = 60000 / bpm * 4; (2 second bar)

  2000ms

  step length = 2000/128 ~= 16ms

*/
