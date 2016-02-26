var express = require('express');
var app = express();

var bodyparser = require('body-parser');
app.use( bodyparser.urlencoded({ extended: true }) );

var hbs = require ('hbs');
app.set('view engine', 'html');
app.engine('html', hbs.__express);

app.use('/static', express.static('public'));

var SnowShoe = require('snowshoe');
var key = process.env.APP_KEY,
    secret = process.env.APP_SECRET;
if (!key && !secret) { throw new Error("No app key/secret provided") }
var client = new SnowShoe.client(key, secret);

app.get ('/', function(request, response) {
  response.render ('index', {});
});

app.post ('/', function(request, response) {
  var data = {data: request.body.data}

  client.post(data, function(error, data) {
    if (error) {
      var statusCode = error.statusCode,
          errorJson = JSON.parse(error.data);
      response.status(statusCode).send(errorJson)
    } else {
      response.send(data)
    }
  })
});

var port = process.env.PORT || 5000;
app.listen(port, function(){
  return console.log("listening on port", port);
});
