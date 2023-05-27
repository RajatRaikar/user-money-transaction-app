const fs = require("fs");
const userLib = require("./db/library/user.lib");

const importUserData = async () => {
  fs.readFile("./dataSet/users.json", "utf8", async (err, data) => {
    if (err) {
      console.log("ERROR: In reading json file", err);
      return;
    }
    const userJsonData = JSON.parse(data);
    await userLib.insertManyUser(userJsonData);
    console.log("Data imported successfully");
  });
};

importUserData();