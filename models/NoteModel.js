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
        type: "number",
        sync: "true"
      },

      midiNote: {
        type: "number",
        sync: "true"
      },

      velocity: {
        defaultValue: 127,
        type: "number",
        sync: "true"
      },

      duration: {
        defaultValue: 120,
        type: "number",
        sync: "true"
      }

    }

  },

  EDIT_EVENT: {
    value: "edit-note",
    configurable: false
  }


});
