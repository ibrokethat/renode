/**

  @module       models/PatternModel
  @description  A track containing multiple notes, keyed by time

*/
var Base      = require("Base");
var NoteModel = require("./NoteModel");


module.exports = Base.extend({

  //  properties


  /**
    @description  properties
  */
  properties: {

    value: {

      currentStep: {
        defaultValue : 1,
        type         : "number"
      },

      stepCount: {
        defaultValue : 128,
        type         : "number"
      },

      state: {
        defaultValue : "stopped",
        type         : "string"
      }

    }

  },

  /**
    @description  relationships
  */
  hasMany: {

    value: {
      notes: NoteModel
    }

  },

  EDIT_EVENT: {
    value: "edit/pattern",
    configurable: false
  },

  PENDING: {
    value: "pending",
    configurable: false
  },
  PLAYING: {
    value: "playing",
    configurable: false
  },
  STOPPED: {
    value: "stopped",
    configurable: false
  }

});
