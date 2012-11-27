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

      playing: {
        defaultValue : false,
        type         : "boolean",
        sync         : true
      },

      steps: {
        defaultValue : 128,
        type         : "number"
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
    value: "edit/sequencer",
    configurable: false
  }

});
