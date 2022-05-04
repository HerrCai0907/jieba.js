#! /usr/bin/env node

const { execSync } = require("child_process");
const fs = require("fs-extra");

fs.emptyDirSync("build");
execSync("cd build && emcmake cmake .. && emmake make -j4", { stdio: "inherit" });
