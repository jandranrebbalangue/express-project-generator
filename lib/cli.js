#!/usr/bin/env node
const ncp = require("ncp").ncp;
const argv = require("minimist")(process.argv.slice(2));
const path = require("path");

const PROJECT_FOLDER_PATH = "./express-js";
const folder = PROJECT_FOLDER_PATH;
const source = path.join(__dirname, folder);
let destination = "express-project";

if (argv._) {
  destination = argv._[0];
}

ncp(source, destination, (err) => {
  if (err) {
    console.error(err);
  }
  console.log("Project setup complete!");
});
