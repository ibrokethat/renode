/**

  @module       models/TrackModel
  @description  A track containing multiple patterns, of which only one can play
                at any one time

*/
var Base         = require("Base");
var PatternModel = require("./PatternModel");
var midiUtils    = require("../utils/midi");
var channels     = midiUtils.channels;
var getChannel   = midiUtils.getChannel;

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
        type: "number",
        sync: true
      },

      midiOff: {
        type: "number",
        sync: true,
        on : {
          midiOn: function (value) {
            var v = getChannel(value).midiOff;
            // this.midiOff = getChannel(value).midiOff;
          }
        }
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
  },


  channels: {
    value: channels,
    configurable: false
  }

});
