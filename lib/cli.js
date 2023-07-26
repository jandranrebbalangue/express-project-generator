#!/usr/bin/env node
const fse = require("fs-extra");
const argv = require("minimist")(process.argv.slice(2));
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
  .arguments("[package-name]")
  .action((name) => {
    let destination = "my-awesome-project";
    if (argv._.length > 0 && name) {
      destination = name;
    }
    fse.copy(source, destination, (err) => {
      if (err) return console.error(err);
    });
    log(chalk.green("\n\nYour project is ready!\n\n"));
  })
  .parse(argv._);
