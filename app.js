const express = require('express');
const http = require('http');
const app = express();
const path = require('path');
const router = express.Router();
const morgan = require('morgan');

app.use(morgan('tiny'));
router.get('/front/*', function(req, res) {
  res.sendFile(path.join(__dirname, 'public', req.params[0]));
});
//router.get('*', express.static(__dirname + '/public/index.html'));
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