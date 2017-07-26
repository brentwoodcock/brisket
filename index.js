var express = require('express');  
var request = require('request');

var apiServerHost = 'https://developers.zomato.com';
var allowedHeaders = [
  'X-Zomato-API-Key',
  'Access-Control-Allow-Headers',
  'content-type'
];

var app = express();  
app.use('/', function(req, res) {  
  res.append('Access-Control-Allow-Origin', '*');
  res.append('Access-Control-Allow-Headers', allowedHeaders.join(', '));
  if (req.method === 'OPTIONS') {
    res.status(200).send();
  }
  else {
    var url = apiServerHost + req.url;
    req.pipe(request(url)).pipe(res);
  }
});

app.listen(process.env.PORT || 3000);
