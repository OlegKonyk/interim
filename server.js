const express = require('express');
const http = require('http');
const app = express();
const path = require('path');
const config = require('./config.json');
const router = express.Router();
const morgan = require('morgan');

const fs = require('fs');

function readFiles(dirname, onFileContent, onError) {
  fs.readdir(dirname, function(err, filenames) {
    if (err) {
      onError(err);
      return;
    }
    filenames.forEach(function(filename) {
      fs.readFile(dirname + '/' + filename, 'utf-8', function(err, content) {
        if (err) {
          onError(err);
          return;
        }
        if(filename.indexOf('.json') > -1) {
            onFileContent(filename, content);
        }
      });
    });
  });
}

app.locals.blogData = {
  postData: {},
  config: config
};

readFiles(path.join(__dirname, 'posts'), function(filename, content) {
    try { 
        app.locals.blogData.postData[filename.replace('.json', '')] = JSON.parse(content);
    } catch (err) {
        console.log(filename, err);
    }
}, function(err) {
  throw err;
});


app.use(morgan('tiny'));

router.get('/front/*', function(req, res) {
  res.sendFile(path.join(__dirname, 'public', req.params[0]));
});

router.get('/api/posts/all', function(req, res) {
  res.send(app.locals.blogData);
});

router.get('/api/posts/:name', function(req, res) {
  res.send(app.locals.blogData.postData[req.params.name]);
});

app.use('/', router)
app.use('*', function(req, res){
    res.sendFile(path.join(__dirname, './public/index.html'));
});

var port = process.env.PORT || 3012;

const server = http.createServer(app);

server.listen(port);

server.on('listening', function() {
    console.log('Listening on ' + port);
});