var socket = require('socket.io');
const querystring = require('querystring');
var fs = require('fs');
var https = require('https');
var express = require('express');
var app = express();

var rawdata = fs.readFileSync('./config.json');
var ENV_CONFIG = JSON.parse(rawdata);

server = app.listen(ENV_CONFIG.NODESERVER,ENV_CONFIG.HOST, function(){
    console.log('server is running on port ',ENV_CONFIG.NODESERVER)
});
io = socket(server);
// #region Sever logic user authentication
io.on('connection', (socket) => {
    socket.on('SEND_MESSAGE', function(data,fn){
    var postData = querystring.stringify({
        'cid' : data.cid,
         'cage':  data.cage,
         'instruction_type':data.cit
     });

    var options = {
         hostname: ENV_CONFIG.HOST,
         port: ENV_CONFIG.PYSERVER,
         path: '/',
         method: 'POST',
         rejectUnauthorized:false,
         ca: [ fs.readFileSync('../config/settings/cert.pem')],
         headers: {
              'Content-Type': 'application/x-www-form-urlencoded',
              'Content-Length': postData.length
            }
       };


  var req = https.request(options, (res) => {

     res.on('data',(d) => {

                  fn(d.toString());

    });
  });

  req.on('error', (e) => {
    console.error(e);
  });

  req.write(postData);
  req.end()

});
});
// #endregion

// #region Server Details Slot Chart

io.on('connection', (socket) => {
    socket.on('SLOT_SEND_MESSAGE', function(data){


  var SlotData = querystring.stringify({
      'cid' : data.cid,
      'cage' : data.cage,
       'instruction_type':data.cit
   });

var options = {
     hostname: ENV_CONFIG.HOST,
     port: ENV_CONFIG.PYSERVER,
     path: '/',
     method: 'POST',
     rejectUnauthorized:false,
     ca: [ fs.readFileSync('../config/settings/cert.pem')],
     headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
          'Content-Length': SlotData.length
        }
   };


  var req = https.request(options, (res) => {

     res.on('data',(d) => {

                var dj = (d.toString())
                var djd = dj.split('$')
                var djdj = []
                for (var i = 0; i < djd.length;i++)
                {
                    djdj.push(djd[i])
                }


                io.emit('SLOT_RECEIVE_MESSAGE', d.toString());

    });
  });

  req.on('error', (e) => {
    console.error(e);
  });

  req.write(SlotData);
  req.end()

});
});
// #endregion


// #region Receive My Details
io.on('connection', (socket) => {
    socket.on('MYDETAILS_SEND_MESSAGE', function(data,fn1){


  var ECData1 = querystring.stringify({
      'cid' : data.cid,
      'cage' : data.cage,
       'instruction_type':data.cit
   });

var options = {
     hostname: ENV_CONFIG.HOST,
     port: ENV_CONFIG.PYSERVER,
     path: '/',
     method: 'POST',
     rejectUnauthorized:false,
     ca: [ fs.readFileSync('../config/settings/cert.pem')],
     headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
          'Content-Length': ECData1.length
        }
   };


var req = https.request(options, (res) => {

     res.on('data',(d) => {

                 fn1(d.toString());
              });
  });

  req.on('error', (e) => {
    console.error(e);
  });

  req.write(ECData1);
  req.end()

});
});

// #endregion
