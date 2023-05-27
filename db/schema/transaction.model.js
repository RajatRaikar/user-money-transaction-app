const mongoose = require("../mongoConnection");
const constant = require("../../global/constant");

const transactionSchema = new mongoose.Schema({
    transactionId: {
    type: String,
    required: true,
    unique: true,
  },
  details: {
    type: String,
    required: true,
  },
  amount: {
    type: Number,
    required: true,
  },
  senderId: {
    type: String,
    required: true,
  },
  receiverId: {
    type: String,
    required: true,
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

const Transaction = mongoose.model("transaction", transactionSchema);

module.exports = Transaction;
