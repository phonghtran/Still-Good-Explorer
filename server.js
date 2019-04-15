// server.js
// https://medium.com/netscape/deploying-a-vue-js-2-x-app-to-heroku-in-5-steps-tutorial-a69845ace489
// https://stackoverflow.com/questions/48277747/refresing-a-vue-app-gives-cannot-get-path
// var express = require('express');
// var path = require('path');
// var serveStatic = require('serve-static');
// app = express();
// app.use(serveStatic(__dirname + "/dist"));
// var port = process.env.PORT || 5000;
// app.listen(port);
// console.log('server started '+ port);


const express = require('express');
const path = require('path');
const history = require('connect-history-api-fallback');

const app = express();

const staticFileMiddleware = express.static(path.join(__dirname + '/dist'));

app.use(staticFileMiddleware);
app.use(history({
  disableDotRule: true,
  verbose: true
}));
app.use(staticFileMiddleware);

app.get('/', function (req, res) {
  res.render(path.join(__dirname + '/dist/index.html'));
});

var server = app.listen(process.env.PORT || 5000, function () {
  var port = server.address().port;
  console.log("App now running on port", port);
});
