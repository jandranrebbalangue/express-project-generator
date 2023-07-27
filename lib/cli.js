#!/usr/bin/env node
const fse = require("fs-extra");
const { program } = require("commander");
const chalk = require("chalk");
const path = require("path");
const pkg = require("../package.json");

const PROJECT_FOLDER_PATH = "./express-js";
const folder = PROJECT_FOLDER_PATH;
const source = path.join(__dirname, folder);
const { log } = console;

program
  .version(pkg.version)
  .name(`npx ${pkg.name}`)
  .usage(`${chalk.green("package-name")}`)
  .argument("[package-name]")
  .action((name) => {
    const destination = name;
    if (!destination) process.exit(1);
    fse.copy(source, destination, (err) => {
      if (err) return console.error(err);
      log(chalk.green("\n\nYour project is ready!\n\n"));
    });
  })
  .parse(process.argv);
