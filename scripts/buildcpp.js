#! /usr/bin/env node

const { execSync } = require("child_process");
const { copyFileSync } = require("fs-extra");
const fs = require("fs-extra");
const { cpus } = require("os");
const { resolve, join } = require("path");

const buildFolder = resolve(__dirname, "..", "build");
fs.emptyDirSync(buildFolder);

const execConfig = {
  stdio: "inherit",
  cwd: buildFolder,
};

execSync(`emcmake cmake .. -DCMAKE_BUILD_TYPE=Debug`, execConfig);
execSync(`emmake make -j ${cpus().length}`, execConfig);
copyFileSync(join(buildFolder, "bin/jieba.js"), "index.js");
