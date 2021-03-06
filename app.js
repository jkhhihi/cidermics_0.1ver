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
var cid2_idx = require('./routes/main_v2/index');
var board = require('./routes/board');
var std = require('./routes/study');
var pay = require('./routes/pay');

//재무 새로운 페이지
var fin = require('./routes/fin');


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
app.use('/cid_main_v2',express.static(__dirname+'/views/cid_main_v2'));
app.use('/cid_board',express.static(__dirname+'/views/cid_board'));
app.use('/cid_study',express.static(__dirname+'/views/cid_study'));
app.use('/pay',express.static(__dirname+'/views/pay'));

app.use('/fin',express.static(__dirname+'/views/fin'));


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
app.use('/',cid2_idx);
app.use('/',board);
app.use('/',std);
app.use('/',pay);

app.use('/',fin);


//passportFB.use('fbLogin', new LocalStrategy({
passportFB.use( new FacebookStrategy({
        clientID: '2364864330207062',
        clientSecret: '4d470c8764179cf7c3cfc135ef4379fe',
        callbackURL: "http://cidermics.com/auth/facebook/callback",
        //callbackURL: "http://localhost/auth/facebook/callback",
        profileFields: ['id', 'displayName', 'photos']
    },
    function(accessToken, refreshToken, profile, done) {
    
        done(null,profile);
    }
));

app.get('/auth/facebook', passportFB.authenticate('facebook'));
app.get('/auth/facebook/callback',
    passportFB.authenticate('facebook', { successRedirect: '/login_success/:mem_id',
        failureRedirect: '/login_fail' }));
app.get('/login_success/:mem_id', ensureAuthenticated, function(req, res){
    var sets = {mem_id : req.user.id, mem_name : req.user.displayName };
    mysql.select('select * from cider.cid_member where mem_id ="'+req.user.id+'" and mem_name = "'+req.user.displayName+'"', function (err, data){
    //console.log(req.user.id);
    //console.log(req.user.photos[0].value);
    //var profilephoto = req.user.photos[0].value;

    if(data.length < 1){
      mysql.insert('insert into cider.cid_member set ?', sets, function(err,data){
      console.log('회원가입 완료');
      });
    }
    //res.send(req.user);
    res.redirect('/');
    //res.render('front/facebooklogin_success', {member:data,profilephoto:profilephoto});
  });
});
app.get('/login_fail', ensureAuthenticated, function(req, res){
    res.redirect('/');
});
app.get('/logout', function(req, res){

  req.session.destroy(function (err) {
    res.redirect('/'); //Inside a callback… bulletproof!
  });
    //req.logout();
    //res.send('<script>alert("로그아웃되었습니다.");location.href="/main_old";</script>');
    //res.redirect('/');
});
function ensureAuthenticated(req, res, next) {
    // 로그인이 되어 있으면, 다음 파이프라인으로 진행
    console.log("로그인이 되어 있음");
    if (req.isAuthenticated()) { return next(); }
    // 로그인이 안되어 있으면, login 페이지로 진행
     console.log("로그인이 안되어 있음");
    res.redirect('/');
}

//관리자
passport.use('local', new LocalStrategy({
    usernameField : 'email',
    passwordField : 'pw',
    passReqToCallback : true
}
,

function(req, email, pw, done) {

	mysql.select('select * from cider.cid_user where user_email ="'+email+'" and user_password = "'+pw+'" and user_inside ="Y"', function (err, data){
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

//재무관리자
passport.use('fin', new LocalStrategy({
    usernameField : 'email',
    passwordField : 'pw',
    passReqToCallback : true
},
function(req, email, pw, done) {
  mysql.select('select * from cider.cid_user where user_email ="'+email+'" and user_password = "'+pw+'" and user_inside ="F" OR user_inside ="Y"', function (err, data){
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


//플랜어투즈 
passport.use('plan', new LocalStrategy({
    usernameField : 'email',
    passwordField : 'pw',
    passReqToCallback : true
},
function(req, email, pw, done) {
  mysql.select('select * from cider.cid_user where user_email ="'+email+'" and user_password = "'+pw+'" and user_inside ="M" OR user_inside ="Y"', function (err, data){
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


//쿠폰
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
//회원 로그인
passport.use('mem_login', new LocalStrategy({
    usernameField : 'email',
    passwordField : 'pw',
    passReqToCallback : true
}
,

function(req, email, pw, done) {

  console.log(email);
  mysql.select('select * from cider.cid_member where mem_email ="'+email+'" and mem_pwd = "'+pw+'"', function (err, data){


    if(data.length < 1){
      console.log('fail');
      //alert('<script>alert("아이디 및 비밀번호를 확인해주세요.");location.href="/mem_login";</script>');
      //req.flash('<script>alert("아이디 및 비밀번호를 확인해주세요.");location.href="/mem_login";</script>');
      return done(null, false);
    }else {
      console.log('success');
      console.log(data);
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
    res.render('error500', {
      message: err.message,
      error: err
    });
  });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  res.render('error500', {
    message: err.message,
    error: {}
  });
});

module.exports = app;


http.createServer(app).listen(app.get('port'), function(){
  console.log('Express server listening on port ' + app.get('port'));
});

if (app.get('env') === 'development') {
  app.use(function(err, req, res, _next) {
    console.log('Error handler', err);
    if(err instanceof IpDeniedError){
      res.status(401);
    }else{
      res.status(err.status || 500);
    }

    res.render('error', {
      message: 'You shall not pass',
      error: err
    });
  });
}

/*
var app = connect()
  .use(function(req, res, next) {
    if (req.url.indexOf('/cardOrder/') === 0) // YOUR 'HIDDEN' PATH
    {
      var ipnumber = req.socket.address().address;
      if (ipnumber !== '27.102.213.200')     // YOUR IP NUMBER 
      {
        res.writeHead(404);
        return res.end();
      }
    }
    next();
  })
  .use(connect.static('public'))
  .listen(3000);
*/
