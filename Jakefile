var build                    = require("build");
var buildPackageDependencies = build.buildPackageDependencies;
var copyFile                 = build.copyFile;
var buildModule              = build.buildModule;


namespace("build", function() {

  desc("Build dependencies");
  task("deps", [], function() {

    jake.rmRf("htdocs/node_modules");
    buildPackageDependencies("package.json");

  });


  desc("Build dev");
  task("dev", [], function() {

    jake.rmRf("htdocs/controllers");
    jake.rmRf("htdocs/models");
    jake.rmRf("htdocs/views");
    copyFile("index.dev.html");
    copyFile("index.html");
    copyFile("require.js");
    copyFile("worker.js");
    buildModule("client.js");

  });


});
