
var express = require('express')
  , http = require('http');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');

//var session = require('client-sessions');
//cidermics
var session = require('express-session');
var debug = require('debug')('cidermics:server');
var passport = require('passport')
, LocalStrategy = require('passport-local').Strategy;
var mysql = require("./routes/model/mysql");
var flash = require('req-flash');

var app = express();

// route add

var routes = require('./routes/index');
//var users = require('./routes/users');
var admin = require('./routes/admin');
var about = require('./routes/about');
//var cmn = require('./routes/cmn');
//var consulting = require('./routes/consulting');
var contents = require('./routes/contents');
//var member = require('./routes/member');
var search = require('./routes/search');
var finance = require('./routes/finance');
var lecture = require('./routes/lecture');
var quiz = require('./routes/quiz');

// all environments
app.set('port', process.env.PORT || 80);
app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');

app.use(cookieParser());
/*
  app.use(session({
  cookieName: 'session',
  secret: 'raonomics_secret',
  //duration: 30 * 60 * 1000,
  duration: 60 * 90 * 1000,
  //activeDuration: 5 * 60 * 1000,
  activeDuration: 25 * 70 * 1000,
}));*/

app.use(logger('dev'));

app.use(express.static(path.join(__dirname, 'public')));
app.use(session({ secret: 'fortt', resave: true, saveUninitialized: true}));

app.use(passport.initialize());
app.use(passport.session());


app.use('/cid_about', express.static(__dirname + '/views/cid_about'));
//app.use('/cid_cmn', express.static(__dirname + '/views/cid_cmn'));
//app.use('/cid_consulting', express.static(__dirname + '/views/cid_consulting'));
app.use('/cid_contents', express.static(__dirname + '/views/cid_contents'));
//app.use('/cid_member', express.static(__dirname + '/views/cid_member'));
app.use('/cid_search', express.static(__dirname + '/views/cid_search'));
app.use('/cid_finance', express.static(__dirname + '/views/cid_finance'));
app.use('/cid_lecture', express.static(__dirname + '/views/cid_lecture'));
app.use('/cid_quiz', express.static(__dirname + '/views/cid_quiz'));
app.use(flash());

app.use(bodyParser.json({limit: '1000mb'}));
app.use(bodyParser.urlencoded({limit: '1000mb', extended: true }));

// development only
if ('development' == app.get('env')) {
//  app.use(express.errorHandler());
}

//controller route
app.use('/', routes);
//app.use('/users', users);
app.use('/adm', admin);

//app.get
app.use('/',about);
//app.use('/',cmn);
//app.use('/',consulting);
app.use('/',contents);
//app.use('/',member);
app.use('/',search);
app.use('/',finance);
app.use('/',lecture);
app.use('/',quiz);


passport.use('local', new LocalStrategy({
	
    usernameField : 'email',
    passwordField : 'pw',
    passReqToCallback : true
}
,


function(req, email, pw, done) {
	
	mysql.select('select * from cider.cid_user where user_email ="'+email+'" and user_password = "'+pw+'"', function (err, data){
		console.log("data");
		console.log(data.length);
		if(data.length < 1){
			console.log('fail');
			return done(null, false);
		}else {
			console.log('success');
			return done(null, data);
		}
		if(err){
			res.redirect('back');
		}
		
    });
	
}
));

passport.use('applycancel', new LocalStrategy({
	
    usernameField : 'app_no',
    passwordField : 'app_name',
    passReqToCallback : true
}

,function(req, app_no, app_name, done) {
	
	mysql.select('select * from cider.cid_applyform where app_no ="'+app_no+'" and app_name = "'+app_name+'"', function (err, data){
		console.log("data");
		console.log(data.length);
		if(data.length < 1){
			console.log('fail');
			//res.send('<script>alert("쿠폰번호를 확인해주세요.");location.href="/lecture/apply";</script>');
			return done(null, false);
		}else {
			console.log('success');
			return done(null, data);
		}
		if(err){
			
			res.redirect('back');
		}
    });	
}
));

passport.serializeUser(function(user, done) {
    done(null, user);
    // if you use Model.id as your idAttribute maybe you'd want
    // done(null, user.id);
});

passport.deserializeUser(function(user, done) {
    done(null, user);
});


// catch 404 and forward to error handler
app.use(function(req, res, next) {
	//2016년 12월 8일 추가됨
	
  res.setTimeout(120000, function(){
        console.log('Request has timed out.');
            //res.send(408);
        });
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
  app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
      message: err.message,
      error: err
    });
  });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  res.render('error', {
    message: err.message,
    error: {}
  });
});

module.exports = app;


http.createServer(app).listen(app.get('port'), function(){
  console.log('Express server listening on port ' + app.get('port'));
});

