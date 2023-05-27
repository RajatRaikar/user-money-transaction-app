const mongoose = require("../mongoConnection");

const userSchema = new mongoose.Schema({
  id: {
    type: String,
    required: true,
    unique: true,
  },
  name: {
    type: String,
    required: true,
  },
  balance: {
    type: Number,
    required: true,
  },
  connectionId: {
    type: String,
    required: false,
    default: ""
  },
  status: {
    type: Number,
    required: true,
    default: 1,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const User = mongoose.model("user", userSchema);

module.exports = User;
