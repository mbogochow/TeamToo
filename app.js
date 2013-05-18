/**
 * Module dependencies.
 */

var express = require('express')
  , http = require('http')
  , path = require('path')
  , database = require('./database');

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

// app.get('/', routes.index);
// app.get('/users', user.list);


app.get("/", store.home, function(req, res) {
                  res.send("Get request being sent");
             });
// list of items
app.get("/items", store.items);
// show an individual item
app.get("/item/:id", function(req, res){
  res.send('<form method="post" id="uploadForm" enctype="multipart/form-data" action="post">'
    //+ '<p>Title: <input type="text" name="title" /></p>'
    + '<p>Upload File: <input type="file" id="userInput" name="userFile" /></p>'
    //+ '<p><input type="submit" value="Upload" /></p>'
    + '</form>'
    + '<span id="status" />'
    + '<script src="//ajax.googleapis.com/ajax/libs/jquery/1.7.1/jquery.min.js"></script>'
    + '<script src="/javascripts/jquery.form.js"></script>'
    + '<script src="/javascripts/upload.js"></script>'
    );
    
    app.set('name', req.session.username);
});

// show general pages
app.get("/page", store.page);

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
    process.cwd() + '/public' + 
    //'C:/Users/mbogochow/Documents/School/Hackademy/Hackathon/fileUpload/public' + 
    serverPath,
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

app.post("/", store.home_post_handler);
/*
exports.createServer = function (port, database) {
  var resource = new entry.Entry(database),
      router = service.createRouter(resource),
      server;

  server = union.createServer({
    before: [
      function (req, res) {
        //
        // Dispatch the request to the router
        //
        winston.info('Incoming Request: ' + req.url);
        router.dispatch(req, res, function (err) {
          winston.info('Request errored: ' + req.url);
          if (err) {
            res.writeHead(404);
            res.end();
          }
        });
      }
    ]
  });
  
  if (port) {
    server.listen(port);
  }
  
  return server;
};*/

http.createServer(app).listen(app.get('port'), function(){
  console.log('Express server listening on port ' + app.get('port'));
/*
  var options = {
    port:      app.get('port'),
    setup:     true, 
    basicAuth: null
  }
  
  database.setup(options, function (err, db) {
    if (err) {
      //return callback(err);
    }
  });*/
});
