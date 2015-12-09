#!/usr/bin/env node

/**
 * Module dependencies.
 */

var fs = require('fs');
var path = require('path')
var program = require('commander');
var glob = require("glob");

program
  .version('0.0.1')
  .option('-p, --path [path]', 'Add the path []', '')
  .parse(process.argv);

console.log('%s', program.path);
glob(program.path+"/**",{},function(err,paths){
  console.log(paths);
  var streams = [];
  for(var i=0;i<paths.length;i++){
    var oldPath = paths[i];
    newPath = oldPath.toLowerCase();
    fs.renameSync(oldPath,newPath);
  }
  //step load files
  //step calc sha256
  //step rename files
});
