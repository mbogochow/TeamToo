/**
 * Module dependencies.
 */

var express = require('express')
  , http = require('http')
  , path = require('path')
  , database = require('./lib/database')
  , fs = require('fs')
  , handlebars = require('handlebars');

var store = require("./routes/store");
var app = express();

// all environments
app.set('port', process.env.PORT || 3000);
app.set('views', __dirname + '/views');
app.set('view engine', 'jade');
app.use(express.favicon());
app.use(express.logger('dev'));
app.use(express.bodyParser({uploadDir: './public/files'}));
app.use(express.methodOverride());
app.use(express.cookieParser('your secret here'));
app.use(express.session());
app.use(app.router);
app.use(require('stylus').middleware(__dirname + '/public'));
app.use(express.static(path.join(__dirname, 'public')));

// development only
if ('development' == app.get('env')) {
  app.use(express.errorHandler());
}

var options = {
  port:      app.get('port'),
  setup:     false, 
  basicAuth: null
}

database.setup(options, function (err, db) {
  if (err) {
    //return callback(err);
  }
  else {
    app.set('db', db);
  }
});

//simple function for loading a file and sending to a client
//for use in app.<VERB> callbacks when requesting a static page
function sendFile(filename, res) {
  fs.readFile('public/' + filename, function(err, data) {
    if (err) return res.send('Could not open ' + filename + '...');
    res.setHeader('Content-Type', 'text/html');
    res.send(data);
  });
}

//show index
app.get('/', function(req,res) {
  sendFile('index.html', res);
});

//respond to submitted username
app.post('/', function(req,res) {
  console.log(req.body.username);
  req.session.username = req.body.username;
  res.redirect('/list');
});

//show 'about us' page
app.get('/aboutus', function(req,res) {
  sendFile('aboutus.html', res);
});

//show 'contact us' page
app.get('/contactus', function(req,res) {
  sendFile('contactus.html', res);
});

// show upload form
app.get('/upload', function(req, res){
  if (req.session.username === undefined ||
      req.session.username === '')
    return res.redirect('/');
  sendFile('upload.html', res);
  //app.set('name', req.session.username);
});

//session logout
app.get('/logout', function(req, res) {
    // delete the session variable
    delete req.session.username;
    // redirect user to homepage
    res.redirect('/');
});

app.post('/files', function(req, res) {
//console.dir(req);
  var serverPath = '/files/' + req.files.userFile.name;
 //console.log(process.cwd() + '/public');
  require('fs').rename(
    req.files.userFile.path,
    process.cwd() + '/public' + serverPath,
    function(error) {
      if(error) {
        res.send({
          error: 'Something bad happened  in app.js app.post fs.rename'
        });
        return;
      }
   
      res.send({
        path: serverPath
      });
    }
  );
  
  var data = {
    name:       req.files.userFile.name,
    uploader:   req.session.username,
    tags:       (req.body.tags).split(','),
    url:        'files/' + req.files.userFile.name
  }
 
  database.addEntry(app.get('db'), data, function (err, db) {
    if (err) {
      res.send({error: 'Could not add entry in db'});
      return;
    }
    //app.set('db', db);
    // Migh need to periodically check database in case it was changed manually
  });
});

app.get('/list', function(req, res) {
  if (req.session.username === undefined ||
      req.session.username === '')
    return res.redirect('/');
    
  database.listAll(app.get('db'), function (err, arr) {
    if (err) res.send({error: 'Failed to get list from db'});
   
    var context = {
      files: arr
    }

    fs.readFile('public/list.html', 'utf8', function(err, data) {
      if (err) res.send('something got messed up...');
      var template = handlebars.compile(data);
      res.setHeader('Content-Type', 'text/html');
      res.send(template(context));
    });
  });
});

app.get('/upload2', function(req,res) {
  if (req.session.username === undefined ||
      req.session.username === '')
    return res.redirect('/');
  sendFile('upload2.html', res);
});

app.post('/upload2', function(req,res) {
  console.dir(req.files.file._writeStream.path);
  //console.dir(req.body.tags.split(/[\W,]+/));
  //console.dir(req.session.username);
  res.redirect('/list');
});

http.createServer(app).listen(app.get('port'), function(){
  console.log('Express server listening on port ' + app.get('port'));
});
