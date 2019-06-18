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
    socket.on('SEND_MESSAGE', function(data){

      console.log("ee");
  var postData = querystring.stringify({
      'cid' : data.cid,
       'cage':  data.ca,
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

                  console.log(d.toString());
                io.emit('RECEIVE_MESSAGE', d.toString());

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

// #region Server Details for Seller 1

io.on('connection', (socket) => {
    socket.on('EC1_SEND_MESSAGE', function(data){


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
                io.emit('EC1_RECEIVE_MESSAGE', d.toString());
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

// #region Server Details for Seller 2

io.on('connection', (socket) => {
    socket.on('EC2_SEND_MESSAGE', function(data){


  var ECData2 = querystring.stringify({
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
          'Content-Length': ECData2.length
        }
   };


  var req = https.request(options, (res) => {

     res.on('data',(d) => {
                console.log(d);
                var dj = (d.toString())
                var djd = dj.split('$')
                var djdj = []
                for (var i = 0; i < djd.length;i++)
                {
                    djdj.push(djd[i])
                }


                io.emit('EC2_RECEIVE_MESSAGE', d.toString());

    });
  });

  req.on('error', (e) => {
    console.error(e);
  });

  req.write(ECData2);
  req.end()

});
});
// #endregion

// #region Server Details for Seller 3

io.on('connection', (socket) => {
    socket.on('EC3_SEND_MESSAGE', function(data){


  var ECData3 = querystring.stringify({
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
          'Content-Length': ECData3.length
        }
   };


  var req = https.request(options, (res) => {

     res.on('data',(d) => {
                console.log(d);
                var dj = (d.toString())
                var djd = dj.split('$')
                var djdj = []
                for (var i = 0; i < djd.length;i++)
                {
                    djdj.push(djd[i])
                }


                io.emit('EC3_RECEIVE_MESSAGE', d.toString());

    });
  });

  req.on('error', (e) => {
    console.error(e);
  });

  req.write(ECData3);
  req.end()

});
});
// #endregion


// #region Receive new Bid details

// #endregion
