#!/usr/bin/env node

/**
 * Module dependencies.
 */

var crypto = require('crypto');
var fs = require('fs');
var path = require('path')
var program = require('commander');
var glob = require("glob");

var algo = 'sha256';

program
  .version('0.0.1')
  .option('-p, --path [path]', 'Add the path []', '')
  .parse(process.argv);

console.log('%s', program.path);
glob(program.path+"/*.*",{},function(err,paths){
  console.log(paths);
  var streams = [];
  var shasums = [];
  for(var i=0;i<paths.length;i++){
    shasums[i] = crypto.createHash(algo);
    streams[i] = fs.ReadStream(paths[i]);
    streams[i].on("data",function(d){shasums[this.i].update(d);}.bind({"i":i}));
    streams[i].on('end', function() {
      var d = shasums[this.i].digest('hex');
      console.log(d);
      var oldPath = paths[this.i];
      var ext = path.extname(oldPath).toLowerCase();
      console.log(ext);
      var newPath = path.join(path.dirname(oldPath),d+ext);
      console.log(newPath);
      fs.renameSync(oldPath,newPath);
      streams[this.i].close();
    }.bind({"i":i}));
  }
  //step load files
  //step calc sha256
  //step rename files
});
