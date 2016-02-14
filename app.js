var environment = process.env.NODE_ENV || 'development';

var express = require('express');
var bodyParser = require('body-parser');
if( environment === "development" ){
   var env = require('./env.js'); 
}
var logger = require('morgan');
var client = require('twilio')(process.env.TWILIO_ACCOUT_SID, process.env.TWILIO_AUTH_TOKEN);
var twilio = require('twilio');
var app = express();
//app.use(bodyParser.json()); // check which works later
app.use(bodyParser.urlencoded({extended:true})); // check which works later
app.use(logger('dev'));

app.get('/', function(req, res) {
  res.send('Hello World!');
});

app.post('/', function(req, res){
  console.log('In post /');    
  console.log(req.body);
  var resp = new twilio.TwimlResponse();
  resp.message('You said: ' + req.body.Body );
  if( req.body.Body ){
    res.send(resp.toString());      
  }else{
    res.sendStatus(204);
  }
});

client.messages.list(function(err, data) {
    console.log("Logging messages..." );
    data.messages.forEach(function(message) {
        if(message.from === process.env.MY_NUMBER){
            console.log(message.body);
        }
    });
});

var serverPort = process.env.OPENSHIFT_NODEJS_PORT || 8080;
var serverIpAddress = process.env.OPENSHIFT_NODEJS_IP || '127.0.0.1';
app.listen(serverPort, serverIpAddress,function() {
  console.log('Example app listening on port ' + serverPort);
});
