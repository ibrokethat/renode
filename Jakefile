var build                    = require("build");
var buildPackageDependencies = build.buildPackageDependencies;
var copyFile                 = build.copyFile;
var buildModule              = build.buildModule;


namespace("dev", function() {

  task("build", [], function() {

    jake.rmRf("htdocs/node_modules");
    jake.rmRf("htdocs/controllers");
    jake.rmRf("htdocs/models");
    jake.rmRf("htdocs/views");
    copyFile("index.dev.html");
    copyFile("index.html");
    copyFile("require.js");
    copyFile("worker.js");
    buildPackageDependencies("package.json");
    buildModule("client.js");

  });


  task("symlink", {async: true}, function () {

    var deps = "async build Base Collection controllers func is iter Object pipe registry seq system uuid";
    var cmds = [

      "cd node_modules && rm -r " + deps,
      "cd node_modules && npm link " + deps

    ];

    jake.exec(cmds, function () {
      console.log('Dev sym links created.');
      complete();
    }, {printStdout: true});

  });

});

