/*
 * database.js: Configuration for CouchDB and cradle for this application. 
 *
 * Modified from:
 * (C) 2010 Charlie Robbins
 * MIT LICENSE
 *
 */
 
var cradle = require('cradle');

var setup = exports.setup = function (options, callback) {
  // Set connection configuration
  cradle.setup({
    host: options.host || '199.192.240.62',
    port: 5984,
    options: options.options
  });
  
  // Connect to cradle
  var conn = new (cradle.Connection)({ auth: options.auth }),
      db = conn.database(options.database || 'team-too');
      
  callback(null, db);
}

var setupAdd = exports.setupAdd = function (options, data, callback) {
  // Set connection configuration
  cradle.setup({
    host: options.host || '199.192.240.62',
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

var getEntry = exports.getEntry = function (db, id, callback) {
  db.get(id, function (err, doc) {
    if (err) {
      return callback(err);
    }
    
    callback(null, doc);
  });
};

var listAll2 = exports.listAll2 = function (db, callback) {
  var context3 = [];
  db.all(function (err, res2) {
    if (err) {
        console.log('Error: %s', err)
        return;
    }
     // console.log(res2 + '\n');
     // console.log(res2.length + '\n');
      //console.log(res);
    for (var i = 0; i < res2.length; i++)
    {
      getEntry(db, res2[i].id, function (err2, doc) {
        if (err2) {
          res.send({error: 'Couldn\'t get document from db'});
          return;
        }
        //console.log('here\n');
        /*context3.push*/
        if (doc.attributes) {
          var b = (
            {            
              title: doc.attributes.title,
              url: doc.attributes.url,
              tags: doc.attributes.tags
            }
          );
          context3.push(b);
        }
        //console.log(b);
        //console.dir(context3);
      });
    }

    callback(null, context3);
  });
};

var listAll = exports.listAll = function (db, callback) {
/*db.get('_design/entry', function (err, doc) {
  console.dir(doc);
});*/

  db.view('user/byUsername', function (err, res) {
    //console.dir(res);//undefined
    
    callback(null, res);
  });
  
  /*db.view('entry/all', function (err, result) {
    if (err) {
      return callback(err);
    }
    
    callback(null, result);
    //callback(null, result.rows.map(function (row) { return row.value }));
  });*/
};

var updateEntry = exports.updateEntry = function (db, id, entry, callback) {
  db.merge(id, entry, function (err, res) {
    if (err) {
      return callback(err);
    }
    
    callback(null, true);
  });
};

var removeEntry = exports.removeEntry = function (db, id, callback) {
  var self = this;
  getEntry(db, id, function (err, doc) {
    if (err) {
      return callback(err);
    }
    
    db.remove(id, doc._rev, function (err, res) {
      if (err) {
        return callback(err);
      }

      callback(null, true);
    });
  });
};
