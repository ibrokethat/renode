/**

  @module       app/models/NoteModel
  @description  A note containing midi data

*/
var Base = require("Base");

module.exports = Base.extend({

  //  properties


  properties: {

    value: {

      start: {
        type: "number"
      },

      key: {
        type: "number"
      },

      velocity: {
        type: "number"
      },

      duration: {
        type: "number"
      }

    }

  },

  EDIT_EVENT: {
    value: "edit/note",
    configurable: false
  }


});
