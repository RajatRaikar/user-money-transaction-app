const UserModel = require("../schema/user.model");

const userLib = {};

userLib.insertManyUser = async (usersData) => {
  try {
    const res = await UserModel.insertMany(usersData);
    return res;
  } catch (e) {
    console.log(e);
  }
};

userLib.find = async (userIds) => {
  try {
    const res = await UserModel.find({
      id: {
        $in: userIds,
      },
    }).select("id name balance connectionId");
    return res;
  } catch (e) {
    console.log(e);
  }
};

userLib.update = async (updateCondition, data) => {
  try {
    const res = await UserModel.updateOne(updateCondition, data);
    return res;
  } catch (e) {
    console.log(e);
  }
};

userLib.updateConnectionId = async (userId, connectionId) => {
  try {
    const res = await UserModel.updateOne(
      {
        id: userId,
      },
      {
        $set: { connectionId: connectionId },
      }
    );
    return res;
  } catch (e) {
    console.log(e);
  }
};

module.exports = userLib;
