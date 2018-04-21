
const fs = require("fs");
const aliases = require("./alias");
const filePath = `${aliases.root}`;
const path = require("path");
const build = require("./build");
let timeout;
fs.watch(path.resolve("./", filePath),{recursive:true}, function (event, filename) {
  console.log("event is: " + event); //eslint-disable-line
  if (filename) {
    console.log("filename provided: " + filename); //eslint-disable-line
  } else {
    console.log("filename not provided"); //eslint-disable-line
  }
  if(!timeout) {
    timeout = 500;
    setTimeout(() => {
      build();
      timeout = null;
    }, timeout);
  }
});