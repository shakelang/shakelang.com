// jshint esversion: 9

const fs = require("fs-extra");
const { basename } = require("path");
const download_browser_scripts = require("./build-src/download_browser_scripts");

module.exports = function (grunt) {
  require("load-grunt-tasks")(grunt);

  // Project configuration.
  grunt.initConfig({
    pkg: grunt.file.readJSON("package.json"),
  });

  grunt.task.registerTask(
    "browser-scripts",
    "Task that downloads the production versions of shake for the code playground.",
    function () {
      const done = this.async();
      (async () => {
        await fs.mkdirs("scripts");
        const scripts = await download_browser_scripts("scripts/shake/");
        await fs.writeFile(
          "scripts/shake-versions.json",
          JSON.stringify(
            scripts.map((e) => ({
              commit: e.commit,
              file: basename(e.target).replace(/\\/g, "/"),
            })),
            null,
            2
          )
        );
        done();
      })();
    }
  );
};
