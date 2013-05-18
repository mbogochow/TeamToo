/*
 * database.js: Configuration for CouchDB and cradle for this application. 
 *
 * (C) 2010 Charlie Robbins
 * MIT LICENSE
 *
 */
 
var cradle = require('cradle');
 
var setup = exports.setup = function (options, callback) {
  // Set connection configuration
  cradle.setup({
    host: options.host || '127.0.0.1',
    port: 5984,
    options: options.options
  });
  
  // Connect to cradle
  var conn = new (cradle.Connection)({ auth: options.auth }),
      db = conn.database(options.database || 'team-too');
      
  if (options.setup) {
    initViews(db, callback);
  }
  else {
    callback(null, db); 
  }
};

var initViews = exports.initViews = function (db, callback) {
  var designs = [
    {
      '_id': 'Data',
      attributes: {
        title: {
          map: function (doc) { if (doc.resource === 'Data') emit(doc.title, doc) }
        },
        uploader: {
          map: function (doc) { if (doc.resource === 'Data') { emit(doc.uploader, doc); } }
        },
        tags: {
          map: function (doc) { if (doc.resource === 'Data') { emit(doc.tags, doc); } }
        },
        url: {
          map: function (doc) { if (doc.resource === 'Data') emit(doc.url, doc) }
        }
      }
    }
  ];
  
  db.save(designs, function (err) {
    if (err) return callback(err);
    callback(null, db);    
  });
};

var setupAdd = exports.setupAdd = function (options, data, callback) {
  // Set connection configuration
  cradle.setup({
    host: options.host || '127.0.0.1',
    port: 5984,
    options: options.options
  });
  
  // Connect to cradle
  var conn = new (cradle.Connection)({ auth: options.auth }),
      db = conn.database(options.database || 'team-too');
      
  if (options.setup) {
    addEntry(db, data, callback);
  }
  else {
    callback(null, db); 
  }
};

var addEntry = exports.addEntry = function (db, data, callback) {
  var designs = [
    {
      '_id': data.name,
      attributes: {
        title: data.name,
        uploader: data.uploader,
        tags: data.tags,
        url: data.url
      }
    }
  ];
  
  db.save(designs, function (err) {
    if (err) return callback(err);
    callback(null, db);    
  });
};