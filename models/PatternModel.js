/**

  @module       models/PatternModel
  @description  A track containing multiple notes, keyed by time

*/
var Base      = require("Base");
var NoteModel = require("./NoteModel");


module.exports = Base.extend({

  /**
    @description  properties
  */
  properties: {

    value: {

      currentStep: {
        defaultValue : 0,
        type         : "number"
      },

      bars: {
        defaultValue : 1,
        type         : "number"
      },

      state: {
        defaultValue : "stopped",
        sync         : true,
        type         : "string"
      },

      steps: {
        defaultValue: [],
        type: "array"
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
    value: "edit-pattern",
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
  },

  pending: {
    value: function () {
      this.state = this.PENDING;
    }
  },

  playing: {
    value: function () {
      this.state = this.PLAYING;
    }
  },

  stopped: {
    value: function () {
      this.state = this.STOPPED;
    }
  }


});



