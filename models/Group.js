const mongoose = require("mongoose");
const Schema = mongoose.Schema;

// create GroupSchema
const GroupSchema = new Schema({
  user: {
    type: Schema.Types.ObjectId,
    ref: "User"
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

module.exports = Group = mongoose.model("Group", GroupSchema);
