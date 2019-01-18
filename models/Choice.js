const mongoose = require("mongoose");
const Schema = mongoose.Schema;

// create ChoiceSchema
const ChoiceSchema = new Schema({
  user: {
    type: Schema.Types.ObjectId,
    ref: "User"
  },
  group: {
    type: Schema.Types.ObjectId,
    ref: "Group"
  },
  title: {
    type: String,
    required: true
  },
  date: {
    type: Date,
    default: Date.now
  }
});

module.exports = Choice = mongoose.model("Choice", ChoiceSchema);
