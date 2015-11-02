var __ = require('underscore');
var schemaObject = __.clone(require('./object.js'));

schemaObject.title = "string";
schemaObject.content = 'string';
//schemaObject.visible = 'policy';
//schemaObject.editable = 'policy';
// legal values: active,completed,failed,potential
schemaObject.price = 'number';
schemaObject.images = 'array';
schemaObject.moq = 'number';
// array of key value pairs
schemaObject.kvs = 'array';
schemaObject.display = 'boolean';

//exports.schema=schemaObject;
module.exports = schemaObject;
