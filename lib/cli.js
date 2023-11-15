#!/usr/bin/env node
const fse = require("fs-extra");
const { program } = require("commander");
const chalk = require("chalk");
const path = require("path");
const pkg = require("../package.json");

const PROJECT_FOLDER_PATH = "./express-ts";
const folder = PROJECT_FOLDER_PATH;
const source = path.join(__dirname, folder);
const { log } = console;

program
  .version(pkg.version)
  .name(`npx ${pkg.name}`)
  .usage(`${chalk.green("package-name")}`)
  .argument("[package-name]")
  .action(async (name) => {
    const destination = name;
    if (!destination) process.exit(1);
    await fse.copy(source, destination);
    await fse.rename(`${destination}/gitignore`, `${destination}/.gitignore`);
    const pkgObj = await fse.readJson(`${destination}/package.json`);
    pkgObj.name = name;
    await fse.writeJson(`${destination}/package.json`, pkgObj);
    log(chalk.green("\n\nYour project is ready!\n\n"));
    log(chalk.white(`cd ${name}\n`));
    log(chalk.white("yarn install\n"));
    log(chalk.white("yarn dev\n"));
  })
  .parse(process.argv);
