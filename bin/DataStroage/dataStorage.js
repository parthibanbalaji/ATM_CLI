/**
 * This file acts a interface between the APP and storage file
 */

const { storageFileName } = require("../const");
const fs = require("fs");
const path = require("path");

class DataStorage {
  fileName;
  data;
  filePath;
  constructor(fileName) {
    this.fileName = fileName;
    this.filePath = path.join(__dirname, this.fileName);
    this.createFile();
  }

  createFile() {
    try {
      fs.accessSync(this.filePath);
      this.data = this.readFileData();
    } catch (err) {
      fs.writeFileSync(this.filePath, "[]");
      this.data = [];
    }
  }

  readFileData() {
    let data = fs.readFileSync(this.filePath, {
      encoding: "utf8",
    });
    data = JSON.parse(data);
    return data;
  }

  updateFile() {
    fs.writeFileSync(this.filePath, JSON.stringify(this.data, null, 2));
  }

  getUser(userName) {
    let data = this.data;
    let user;
    if (data?.length > 0) {
      user = data.find((ele) => {
        return ele.userName == userName;
      });
      if (user == undefined) {
        user = this.createUser(userName);
      }
    } else {
      user = this.createUser(userName);
    }

    return user;
  }

  findUserandIndex(user) {
    let data = this.data;
    let index = data.findIndex((ele) => {
      return ele.userName == user.userName;
    });
    return [index, data[index]];
  }

  updateData(users) {
    let data = this.data;
    for (let user of users) {
      let index = data.findIndex((ele) => {
        return ele.userName == user.userName;
      });
      data[index] = user;
    }
    this.data = data;
    this.updateFile();
  }

  createUser(userName) {
    let user = {
      userName: userName,
      balance: 0,
      owed_from: [],
      owed_to: [],
    };
    this.data.push(user);
    this.updateFile();
    return user;
  }
}

const dataStorage = new DataStorage(storageFileName);

module.exports = dataStorage;
