/**

  @module       models/SequencerModel
  @description  A data

*/
var Base       = require("Base");
var TrackModel = require("./TrackModel");


module.exports = Base.extend({

  //  properties

  /**
    @description  properties
  */
  properties: {

    value: {

      title: {
        type: "string"
      },

      bpm: {
        defaultValue : 120,
        type         : "number"
      },

      steps: {
        defaultValue : 128,
        type         : "number"
      },

      state: {
        defaultValue : "stopped",
        sync         : true,
        type         : "string"
      },

      playing: {
        defaultValue: false,
        type: "boolean",
        on: {
          state: function () {
            this.playing = this.state === this.PLAYING ? true : false;
          }
        }
      }

    }

  },


  /**
    @description  relationships
  */
  hasMany: {

    value: {

      tracks: TrackModel

    }

  },

  EDIT_EVENT: {
    value: "edit-sequencer",
    configurable: false
  },

  PLAYING: {
    value: "playing",
    configurable: false
  },
  STOPPED: {
    value: "stopped",
    configurable: false
  },


  play: {
    value: function () {
      this.state = this.PLAYING;
    }
  },

  stop: {
    value: function () {
      this.state = this.STOPPED;
    }
  }


});
