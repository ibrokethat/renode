/**

  @module       song
  @description  test beats


  1 bar has 96 steps (0 - 95)
  1 beat has 24 steps

  sample accurate frames bar:  1920
                         beat: 480


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
            {"start": 120, "midiNote": 36, "velocity": 127, "duration": 120},
            {"start": 480, "midiNote": 40, "velocity": 127, "duration": 120},
            {"start": 720, "midiNote": 36, "velocity": 127, "duration": 120},
            {"start": 960, "midiNote": 36, "velocity": 127, "duration": 120},
            {"start": 1080, "midiNote": 36, "velocity": 127, "duration": 120},
            {"start": 1440, "midiNote": 40, "velocity": 127, "duration": 120}
          ]
        },
        {
          "bars": 1,
          "notes"    : [
            {"start": 0, "midiNote": 36, "velocity": 127, "duration": 120},
            {"start": 120, "midiNote": 36, "velocity": 127, "duration": 120},
            {"start": 240, "midiNote": 47, "velocity": 80, "duration": 500},
            {"start": 480, "midiNote": 40, "velocity": 127, "duration": 120},
            {"start": 480, "midiNote": 46, "velocity": 65, "duration": 120},
            {"start": 720, "midiNote": 36, "velocity": 127, "duration": 120},
            {"start": 960, "midiNote": 36, "velocity": 127, "duration": 120},
            {"start": 1080, "midiNote": 36, "velocity": 127, "duration": 120},
            {"start": 1200, "midiNote": 47, "velocity": 80, "duration": 120},
            {"start": 1440, "midiNote": 40, "velocity": 127, "duration": 120},
            {"start": 1440, "midiNote": 46, "velocity": 65, "duration": 120},
            {"start": 1680, "midiNote": 47, "velocity": 80, "duration": 120}
          ]
        },

        {
          "bars": 1,
          "notes"    : [
            {"start": 0, "midiNote": 36, "velocity": 127, "duration": 120},
            {"start": 0, "midiNote": 46, "velocity": 65, "duration": 120},
            {"start": 240, "midiNote": 46, "velocity": 80, "duration": 120},
            {"start": 480, "midiNote": 40, "velocity": 127, "duration": 120},
            {"start": 480, "midiNote": 46, "velocity": 65, "duration": 120},
            {"start": 720, "midiNote": 36, "velocity": 127, "duration": 120},
            {"start": 720, "midiNote": 46, "velocity": 80, "duration": 120},
            {"start": 960, "midiNote": 36, "velocity": 127, "duration": 120},
            {"start": 960, "midiNote": 46, "velocity": 80, "duration": 120},
            {"start": 1080, "midiNote": 36, "velocity": 127, "duration": 120},
            {"start": 1200, "midiNote": 46, "velocity": 80, "duration": 120},
            {"start": 1440, "midiNote": 40, "velocity": 127, "duration": 120},
            {"start": 1440, "midiNote": 46, "velocity": 65, "duration": 120},
            {"start": 1680, "midiNote": 46, "velocity": 80, "duration": 120}
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
