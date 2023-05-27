const constant = require("../../global/constant");
const TransactionModel = require("../schema/transaction.model");

const transactionLib = {};

transactionLib.findOne = async (transactionId) => {
  try {
    const res = await TransactionModel.findOne({
      transactionId,
      status: constant.ACTIVE
    }).select("transactionId details amount senderId receiverId");
    return res;
  } catch (e) {
    console.log(e);
  }
};

transactionLib.find = async () => {
  try {
    const res = await TransactionModel.find({ status: constant.ACTIVE }).select("transactionId details amount senderId receiverId");
    return res;
  } catch (e) {
    console.log(e);
  }
};

transactionLib.create = async (data) => {
  try {
    const res = await TransactionModel.create(data);
    return res;
  } catch (e) {
    console.log(e);
  }
};

transactionLib.update = async (transactionId) => {
  try {
    const res = await TransactionModel.updateOne(
      { transactionId: transactionId },
      { status: constant.DELETE }
    );
    return res;
  } catch (e) {
    console.log(e);
  }
};

module.exports = transactionLib;
