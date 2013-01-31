/**

  @module       song
  @description  test beats


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


  midi:     96
  advanced: 1920


  1     e      an     d     2     e     an     d     3     e     an     d     4     e     an     d

  0     6      12     18    24    30    36     42    48    54    60     66    72    78    84     90

  0     120    240    360   480   600   720    840   960   1080  1200   1320  1440  1560  1680   1800 (1920)

*/

module.exports =   {

  "title" : "Test beats",
  "bpm"   : 120,
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
            {"start": 0, "midiNote": 36, "velocity": 127, "duration": 120},
            {"start": 6, "midiNote": 36, "velocity": 127, "duration": 120},
            {"start": 24, "midiNote": 40, "velocity": 127, "duration": 120},
            {"start": 36, "midiNote": 36, "velocity": 127, "duration": 120},
            {"start": 48, "midiNote": 36, "velocity": 127, "duration": 120},
            {"start": 54, "midiNote": 36, "velocity": 127, "duration": 120},
            {"start": 72, "midiNote": 40, "velocity": 127, "duration": 120}
          ]
        },
        {
          "bars": 1,
          "notes"    : [
            {"start": 0, "midiNote": 36, "velocity": 127, "duration": 120},
            {"start": 6, "midiNote": 36, "velocity": 127, "duration": 120},
            {"start": 12, "midiNote": 47, "velocity": 80, "duration": 500},
            {"start": 24, "midiNote": 40, "velocity": 127, "duration": 120},
            {"start": 24, "midiNote": 46, "velocity": 65, "duration": 120},
            {"start": 36, "midiNote": 36, "velocity": 127, "duration": 120},
            {"start": 48, "midiNote": 36, "velocity": 127, "duration": 120},
            {"start": 54, "midiNote": 36, "velocity": 127, "duration": 120},
            {"start": 60, "midiNote": 47, "velocity": 80, "duration": 120},
            {"start": 72, "midiNote": 40, "velocity": 127, "duration": 120},
            {"start": 72, "midiNote": 46, "velocity": 65, "duration": 120},
            {"start": 84, "midiNote": 47, "velocity": 80, "duration": 120}
          ]
        },
        {
          "bars": 1,
          "notes"    : [
            {"start": 0, "midiNote": 36, "velocity": 127, "duration": 120},
            {"start": 0, "midiNote": 46, "velocity": 65, "duration": 120},
            {"start": 12, "midiNote": 46, "velocity": 80, "duration": 120},
            {"start": 24, "midiNote": 40, "velocity": 127, "duration": 120},
            {"start": 24, "midiNote": 46, "velocity": 65, "duration": 120},
            {"start": 36, "midiNote": 36, "velocity": 127, "duration": 120},
            {"start": 36, "midiNote": 46, "velocity": 80, "duration": 120},
            {"start": 48, "midiNote": 36, "velocity": 127, "duration": 120},
            {"start": 48, "midiNote": 46, "velocity": 80, "duration": 120},
            {"start": 54, "midiNote": 36, "velocity": 127, "duration": 120},
            {"start": 60, "midiNote": 46, "velocity": 80, "duration": 120},
            {"start": 72, "midiNote": 40, "velocity": 127, "duration": 120},
            {"start": 72, "midiNote": 46, "velocity": 65, "duration": 120},
            {"start": 84, "midiNote": 46, "velocity": 80, "duration": 120}
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
            // {"start": 0, "midiNote": 36, "velocity": 127, "duration": 100},
            // {"start": 12, "midiNote": 56, "velocity": 127, "duration": 100},
            // {"start": 24, "midiNote": 56, "velocity": 127, "duration": 100},
            // {"start": 64, "midiNote": 36, "velocity": 127, "duration": 100},
            // {"start": 96, "midiNote": 66, "velocity": 127, "duration": 100}
          ]
        },
        {
          "bars": 1,
          "notes"   : [
            // {"start": 0, "midiNote": 36, "velocity": 127, "duration": 100},
            // {"start": 12, "midiNote": 56, "velocity": 127, "duration": 100},
            // {"start": 16, "midiNote": 68, "velocity": 127, "duration": 100},
            // {"start": 24, "midiNote": 68, "velocity": 127, "duration": 100},
            // {"start": 24, "midiNote": 56, "velocity": 127, "duration": 100},
            // {"start": 64, "midiNote": 36, "velocity": 127, "duration": 100},
            // {"start": 96, "midiNote": 66, "velocity": 127, "duration": 100}
          ]
        }
      ]
    }
  ]
}
