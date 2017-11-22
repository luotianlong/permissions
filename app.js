var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var ejs = require('ejs');
var ejsMate = require('ejs-mate');
var connectHistoryApiFallback = require('connect-history-api-fallback');
const resourcePath = 'dist';

var index = require('./routes/index');
var users = require('./routes/users');

var app = express();

// 母版页
app.engine('html', ejsMate);
// app.locals._layoutFile = 'layout.html';
app.set('views', path.join(__dirname,'views'));
app.set('view engine', 'html');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
	extended: false
}));
app.use(cookieParser());
app.use(connectHistoryApiFallback());
// 静态资源
app.use('/dist', express.static(path.join(__dirname,'dist'))); // 建个虚拟路径dist
// app.use(express.static(path.join(__dirname,'dist')));

app.use('/', index);
app.use('/users', users);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
	var err = new Error('Not Found');
	err.status = 404;
	next(err);
});

// error handler
app.use(function(err, req, res, next) {
	// set locals, only providing error in development
	res.locals.message = err.message;
	res.locals.error = req.app.get('env') === 'development' ? err : {};

	// render the error page
	res.status(err.status || 500);
	res.send('error');
});

module.exports = app;