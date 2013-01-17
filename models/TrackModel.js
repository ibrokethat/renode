/**

  @module       models/TrackModel
  @description  A track containing multiple patterns, of which only one can play
                at any one time

*/
var Base         = require("Base");
var PatternModel = require("./PatternModel");


module.exports = Base.extend({

  //  properties

  /**
    @description  properties
  */
  properties: {

    value: {

      title: {
        type        : "string",
        defaultValue: "New Track"
      },

      midiOn: {
        type: "number"
      },

      midiOff: {
        type: "number"
      },

      activePatternId: {
        defaultValue: "-1",
        type        : "string",
        sync        : true
      },

      nextPatternId: {
        defaultValue: "-1",
        type        : "string",
        sync        : true
      }

    }

  },


  /**
    @description  relationships
  */
  hasMany: {

    value: {
      patterns: PatternModel
    }
  },


  EDIT_EVENT: {
    value: "edit-track",
    configurable: false
  }

});
