var	express 	= require('express'),
	app 		= express(),
	http 		= require('http'),
	server 		= http.createServer(app),
	io          = require('socket.io').listen(server, {log : false}),
	path 		= require('path'),
	redis       = require('redis'),
	fs 			= require('fs'),
	config  	= require('./config/config')['dev_mode'],
	port 		= 3000;

var RedisStore = require('connect-redis')(express),
    rClient = redis.createClient(),
    sessionStore = new RedisStore({client : rClient});

var cookieParser = express.cookieParser('a215_website');

app.configure(function() {
    app.set('views', config.root + '/app/views');
    app.set('view engine', 'jade');
    app.use(express.bodyParser());
    app.use(express.methodOverride());
    app.use(cookieParser);
    app.use(express.session({store:sessionStore, key:'a215_sessionid', secret:'a215_website'}));
    app.use(express.static(path.resolve('./public')));
    app.use(app.router);
});

io.set('log level', 1)

var SessionSockets = require('session.socket.io'),
    sessionSockets = new SessionSockets(io, sessionStore, cookieParser, 'a215_sessionid');

server.listen(3000);
console.log('Listening to port 3000...');

require('./config/routes')(app, io, sessionSockets);