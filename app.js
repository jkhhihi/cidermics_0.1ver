
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
var passportFB = require('passport'), FacebookStrategy = require('passport-facebook').Strategy;
var passport = require('passport'), LocalStrategy = require('passport-local').Strategy;
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
var member = require('./routes/member');
var search = require('./routes/search');
var finance = require('./routes/finance');
var lecture = require('./routes/lecture');
var quiz = require('./routes/quiz');
var discuss = require('./routes/discuss');
var project = require('./routes/project');
var podcast = require('./routes/podcast');
var books = require('./routes/books');

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
app.use('/cid_member', express.static(__dirname + '/views/cid_member'));
app.use('/cid_search', express.static(__dirname + '/views/cid_search'));
app.use('/cid_finance', express.static(__dirname + '/views/cid_finance'));
app.use('/cid_lecture', express.static(__dirname + '/views/cid_lecture'));
app.use('/cid_quiz', express.static(__dirname + '/views/cid_quiz'));
app.use('/cid_discuss',express.static(__dirname+'/views/cid_discuss'));
app.use('/cid_project',express.static(__dirname+'/views/cid_project'));
app.use('/cid_podcast',express.static(__dirname+'/views/cid_podcast'));
app.use('/cid_books',express.static(__dirname+'/views/cid_books'));
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
app.use('/',member);
app.use('/',search);
app.use('/',finance);
app.use('/',lecture);
app.use('/',quiz);
app.use('/',discuss);
app.use('/',project);
app.use('/',podcast);
app.use('/',books);

//passportFB.use('fbLogin', new LocalStrategy({
passportFB.use( new FacebookStrategy({
        clientID: '237556010053271',
        clientSecret: 'cc7f7051e543769a0cffdfaa3f946200',
        callbackURL: "http://localhost/auth/facebook/callback",
        profileFields: ['id', 'displayName', 'photos']
    },
    function(accessToken, refreshToken, profile, done) {
        console.log(profile);
        console.log("+++++++");
        console.log(profile.id);
        console.log(profile.displayName);

        //mysql.select('select * from cider.cid_member where mem_id ="'+profile.id+'" and mem_name = "'+profile.displayName+'"', function (err, data){
         // console.log(data);
        /*
        var sets = {mem_id : profile.id, mem_name : profile.displayName };
        mysql.insert('insert into cider.cid_member set ?', sets, function(err,data){
        */
        //var sets = {mem_id : profile.id, mem_name : profile.displayName };
/*
          if(data.length < 1){
            //mysql.insert('insert into cider.cid_member set ?', sets, function(err,data){
            console.log('회원가입 완료');
           // });
            return done(null, false);
          }else {
            console.log('success');
            return done(null, data);
          }
          if(err){
            res.redirect('back');
          }*/
       // });
  
    
        done(null,profile);
    }
));

app.get('/auth/facebook', passportFB.authenticate('facebook'));
app.get('/auth/facebook/callback',
    passportFB.authenticate('facebook', { successRedirect: '/login_success',
        failureRedirect: '/login_fail' }));
app.get('/login_success', ensureAuthenticated, function(req, res){
    var sets = {mem_id : req.user.id, mem_name : req.user.displayName };
    mysql.select('select * from cider.cid_member where mem_id ="'+req.user.id+'" and mem_name = "'+req.user.displayName+'"', function (err, data){
    console.log(req.user.id);
    console.log(data);
    if(data.length < 1){
      console.log("하앙");
      mysql.insert('insert into cider.cid_member set ?', sets, function(err,data){
      console.log('회원가입 완료');
      });
    }
    //res.send(req.user);
    res.redirect('/');
    //res.render('front/facebooklogin_test', {member:data});
  });
});
app.get('/login_fail', ensureAuthenticated, function(req, res){
    res.redirect('/');
});
app.get('/logout', function(req, res){
    req.logout();
    res.redirect('/fbtest');
});
function ensureAuthenticated(req, res, next) {
    // 로그인이 되어 있으면, 다음 파이프라인으로 진행
    console.log("로그인이 되어 있음");
    if (req.isAuthenticated()) { return next(); }
    // 로그인이 안되어 있으면, login 페이지로 진행
     console.log("로그인이 안되어 있음");
    res.redirect('/');
}


passport.use('local', new LocalStrategy({
	
    usernameField : 'email',
    passwordField : 'pw',
    passReqToCallback : true
}
,

function(req, email, pw, done) {
	
	mysql.select('select * from cider.cid_user where user_email ="'+email+'" and user_password = "'+pw+'"', function (err, data){
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

passportFB.serializeUser(function(user, done) {
    done(null, user);
    // if you use Model.id as your idAttribute maybe you'd want
    // done(null, user.id);
});

passportFB.deserializeUser(function(user, done) {
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

