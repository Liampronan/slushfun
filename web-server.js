
var express = require("express"),
    app = express();

var path = require('path');

app.use(express.static(path.join(__dirname, "/app")));
//app.use("/js", express.static(__dirname + "/app/js"));
app.use("/scripts", express.static(__dirname + "/app/scripts"));
//app.use("/img", express.static(__dirname + "/app/img"));
//app.use("/styles", express.static(__dirname + "/app/styles"));
app.use("/views", express.static(__dirname + "/app/views"));
app.use("/bower_components", express.static(__dirname + "/app/bower_components"));

app.all('/*', function(req, res, next) {
  // Just send the index.html for other files to support HTML5Mode
  res.sendfile('/app/index.html', { root: __dirname });
});

var port = 8000;
app.listen(process.env.PORT || port, function() {
  console.log("Listening on port:",  process.env.PORT || port);
});

//
//app.all('*', function(req, res, next) {
//  res.header("Access-Control-Allow-Origin", "*");
//  res.header("Access-Control-Allow-Headers", "X-Requested-With");
//  next();
//});

//app.get('/', function(req, res, next) {
//  // Handle the get for this route
//});

//app.post('/', function(req, res, next) {
//  // Handle the post for this route
//});

//var server = restify.createServer({
//    name: 'MyApp'
//  });
//
//server.use(express.static(__dirname+"/public"));
///* serves main page */
//server.use( restify.CORS( {headers: ['x-foo']}) );
//server.use( restify.fullResponse() );
//server.listen(8000);
//
//server.get('/', function indexHTML(req, res, next) {
//  fs.readFile(__dirname + '/index.html', function (err, data) {
//    if (err) {
//      next(err);
//      return;
//    }
//    res.setHeader('Content-Type', 'text/html');
//    res.writeHead(200);
//    res.end(data);
//    next();
//  });
//});
//server.get('/', send);
//var app = socketio.listen(server);


//server.CORS.ALLOW_HEADERS.push( 'Access-Control-Allow-Origin' );
//server.use(restify.CORS({ headers: [ 'Access-Control-Allow-Origin' ], origins: ['*'] }));
//server.use(restify.fullResponse());
//
//
//app.all('*', function(req, res, next) {
//  res.header("Access-Control-Allow-Origin", "http://localhost:8000");
//  res.header("Access-Control-Allow-Headers", "X-Requested-With");
//  next();
//});
//
//
//app.get("/", function(req, res) {
//  res.header("Access-Control-Allow-Origin", "http://localhost:8000");
//  res.sendfile('index.htm')
//});
//
//app.post("/user/add", function(req, res) {
//  /* some server side logic */
//  res.header("Access-Control-Allow-Origin", "*");
//  res.sendfile( __dirname + req.params[0]);
//});
//
///* serves all the static files */
//app.get(/^(.+)$/, function(req, res){
////  console.log('static file request : ' + req.params);
////  res.header("Access-Control-Allow-Origin", "*");
////  res.sendfile( __dirname + req.params[0]);
//  console.log(__dirname);
//});

////var cors = require('cors');
////var corsOptions = {
////  origin: 'http://localhost:8000',
////  methods: ['GET, PUT, POST, DELETE, OPTIONS'],
////  allowedHeaders: ['Content-Type', 'Authorization']
////};
////app.use(cors("corsOptions"));
//
//
