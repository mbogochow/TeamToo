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
app.use(express.bodyParser());
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

//simple function for loading a file and sending to a client
//for use in app.<VERB> callbacks
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

// show upload form
app.get('/upload', function(req, res){
  sendFile('upload.html', res);
});

//session logout
app.get('/logout', function(req, res) {
    // delete the session variable
    delete req.session.username;
    // redirect user to homepage
    res.redirect('/');
});

app.post('/item/post', function(req, res) {
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
  
  var options = {
    port:      app.get('port'),
    setup:     true, 
    basicAuth: null
  }
  
  var data = {
    name:       req.files.userFile.name,
    uploader:   app.get('name'),
    tags:       'a',
    url:        'http://'
  }
  
  database.setupAdd(options, data, function (err, db) {
    if (err) {
      //return callback(err);
    }
  });
});

app.get('/list', function(req, res) {
  var context = {
    title: "Listing stuff, wooo!",
    files: [
      {
        title: "Dear Clarissa",
        url: "files/clarissa.txt",
        tags: [
          "bitches ain't shit",
          "Sowles, you sly dog",
          "lorem",
          "ipsum"
        ]
      },
      {
        title: "Brighton Boys",
        url: "files/inthetrenches.txt",
        tags: [
          "pew pew",
          "oh snap my leg's gone",
          "a third tag"
        ]
      }
    ]
  };
  fs.readFile('public/list.html', 'utf8', function(err, data) {
    if (err) res.send('something got messed up...');
    var template = handlebars.compile(data);
    res.setHeader('Content-Type', 'text/html');
    res.send(template(context));
  });
});

http.createServer(app).listen(app.get('port'), function(){
  console.log('Express server listening on port ' + app.get('port'));
});
