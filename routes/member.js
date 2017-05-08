var express = require('express');
var router = express.Router();
var mysql = require("./model/mysql");
var nodemailer = require('nodemailer');
var passport = require('passport');

var formidable = require('formidable');
var fs = require('fs');


function getWorldTime(tzOffset) { // 24시간제
	  var now = new Date();
	  var tz = now.getTime() + (now.getTimezoneOffset() * 60000) + (tzOffset * 3600000);
	  now.setTime(tz);
	  var s =
	    leadingZeros(now.getFullYear(), 4) + '-' +
	    leadingZeros(now.getMonth() + 1, 2) + '-' +
	    leadingZeros(now.getDate(), 2) + ' ' +

	    leadingZeros(now.getHours(), 2) + ':' +
	    leadingZeros(now.getMinutes(), 2) + ':' +
	    leadingZeros(now.getSeconds(), 2);

	  return s;
}
function leadingZeros(n, digits) {
	  var zero = '';
	  n = n.toString();

	  if (n.length < digits) {
	    for (i = 0; i < digits - n.length; i++)
	      zero += '0';
	  }
	  return zero + n;
}


router.get('/join_step_1', function(req, res, next) {

	res.render('front/cid_member/cid_join_step_1', { });

});

router.get('/join_step_2', function(req, res, next) {

	res.render('front/cid_member/cid_join_step_2', { });

});

router.post('/join_step_done',function(req,res,next){
	var em1 = req.body.email1;
	var em2 = req.body.email2;
	var email = em1 + '@' + em2;

	var name = req.body.mem_name;
	var nick = req.body.mem_nick;
	var pw = req.body.mem_pw;

	var mye = req.body.mem_year;
	var mmo = req.body.mem_month;
		if (mmo.length < 2 )
		 {
		    mmo="0"+mmo;
		 }
	var mda = req.body.mem_day;
		if (mda.length < 2 )
		 {
		    mda="0"+mda;
		 }
	var mem_birth = mye+mmo+mda;

	var mem_sex = req.body.mem_sex;

	var mem_id = em1 + mem_birth;

	var date = getWorldTime(+9);

	var sets = {mem_id:mem_id, mem_name: name , mem_nick : name , mem_pwd : pw , mem_email : email, mem_birth : mem_birth, mem_sex:mem_sex,mem_regdate:date};
	mysql.insert('insert into cider.cid_member set ?', sets,  function (err, data){
		res.redirect('/join_step_3');
	});
});

router.get('/join_step_3', function(req, res, next) {

	res.render('front/cid_member/cid_join_step_3', { });

});

router.get('/join', function(req, res, next) {

	res.render('front/cid_member/cid_join', { });

});

router.get('/mem_login', function(req, res, next) {

	res.render('front/cid_member/cid_login', { });

});

/*router.post('/mem_login', passport.authenticate('mem_login', { failureRedirect: '/mem_login',  failureFlash: true }), function(req, res, next) {

	res.redirect('/');
});*/

router.post('/mem_login', function(req, res, next) {
  passport.authenticate('mem_login', function(err, user, info) {
    if (err) {
      return next(err); // will generate a 500 error
    }
    // Generate a JSON response reflecting authentication status
    if (! user) {
      return res.send('<script>alert("아이디 및 비밀번호를 확인해주세요.");location.href="/mem_login";</script>');
    }
    req.login(user, function(err){
      if(err){
        return next(err);
      }
      return res.redirect('/');        
    });
  })(req, res, next);
});


/* Pass found 17. 4. 21 */

router.get('/psearch1', function(req, res, next) {


	res.render('front/cid_member/password_search1', { });

});

router.post('/psearch1', function(req, res, next) {

	var em1 = req.body.email1;
	var em2 = req.body.email2;


	var email = em1 + '@' + em2;

	var codeRandom = Math.floor((Math.random() * 1000000) + 1);


	var smtpTransport = nodemailer.createTransport({  
    
    service: 'Gmail',
	    auth: {
	        user: 'cidermailer@gmail.com',
	        pass: 'tkdlekapdlffj!@'
	    }
	});

	var mailOptions = {

	    from: 'cidermailer@gmail.com',
	    to: email,

	    subject: '[사이다경제] 비밀번호 인증코드',
	    //text: "<html><head></head><body>" + '인증코드' + codeRandom + "</body></html>",
	    html: '<table width="500" cellpadding="0" cellspacing="0" style="font-family:"나눔고딕"; font-size:12px"><tr><td height="100" colspan="2"  style="background-color:#1b87c9; color:#fff; font-size:16px"><blockquote><p style="margin-bottom:10px;"><b>사이다경제</b></p><b>"인증코드"</b></td><td></td></tr><tr><td height="150" ><blockquote><p><span><b>'+email+'</b></span> 님 안녕하세요.<br /><br />사이다경제입니다:)<br /><br />인증코드는 <span><b style="font-size:18px">' + codeRandom + '</b></span> 입니다.</p></blockquote></td><td align="right" style="padding-right:30px"><p><img src="http://i.imgur.com/vHA3uRr.png" height="100" /></p></td></tr><tr><td height="50" style="border-bottom:1px solid #1b87c9;" colspan="2" ><p align="right"><b>문의 : contact@cidermics.com</b></p></td><td></td></tr><tr><td height="80" colspan="2" ><blockquote><p align="center"><span style="color:#1b87c9; border:2px solid #1b87c9; border-radius:5px; padding:8px 12px;"><a style="color:#1b87c9; text-decoration:none" href="http://www.cidermics.com"><b>"사이다경제" 로 바로가기 ></b></a></span></p></blockquote></td><td></td></tr></table></body></html>'


	};

	smtpTransport.sendMail(mailOptions, function(error, response){

	    if (error){
	        console.log(error);
	    } else {
	        console.log("Message sent : " + response.message);
	    }
	    smtpTransport.close();
	});
	req.session.valid = codeRandom;
	req.session.valid2 = email;
  	res.redirect('/psearch2');
	//res.send({ user: '1234' })
	//res.send('<script>alert("신고 완료되었습니다.");location.href="/discuss/detail/'+dis_no+'";</script>');
	//res.send([1,2,3]);
	//res.redirect('/psearch2')

	//res.render('front/cid_member/password_search1', { });

});

router.get('/psearch2', function(req, res, next) {

	var passedVariable = req.session.valid;

  	//req.session.valid = null;

  	var passedEmailVariable = req.session.valid2;


  	//mysql.select('select where comtco_no ='+comtco_no+'', function (err, data){

	res.render('front/cid_member/password_search2', { passedVariable : passedVariable });

});

router.post('/pserach_chk', function(req, res, next) {

	var sePass = req.body.sessionPass;
	var passedVariable = req.session.valid;

	if(sePass == passedVariable){
		res.redirect('/psearch3');
	}else{
		res.send('<script>alert("인증코드를 확인해주세요..");location.href="/psearch1";</script>');
	}

});



router.get('/psearch3', function(req, res, next) {

	var passedEmailVariable = req.session.valid2;

	
	mysql.select('select mem_no,mem_email,mem_pwd from cider.cid_member where mem_email =\''+passedEmailVariable+'\'', function (err, data){

	res.render('front/cid_member/password_search3', {mem:data});

 });
});


router.post('/psearch3', function(req,res,next){
	req.session.valid2 = null;
	req.session.valid = null;
	var mem_pwd = req.body.mem_email_new_pwd;

	var memno = req.body.memno;


	var sets = { mem_pwd : mem_pwd , mem_no : memno};
	mysql.update('update cider.cid_member set mem_pwd = ? where mem_no = '+memno+'', [mem_pwd,memno], function (err, data){
	
    res.redirect('/');
  });
});

/* Pass found 17. 4. 21 */

/* ID chk 17. 4. 24 */

router.post('/idcheck/:email', function(req, res, next) {
	var email = req.params.email;

	//console.log(email);
	var flag;

	mysql.select('select * from cider.cid_member where mem_email =\''+email+'\'', function (err, data){
		flag = data;
		if(flag.length < 1){
			flag = "NO";
		}else{
			flag = "YES";
		}
		res.send({ emailchk : flag });
  });
});
/* ID chk 17. 4. 24 */




router.get('/mypage', function(req, res, next) {

	var sePass = req.session.passport;
	if(sePass != null){
		var mem_id ='';
		if(sePass.user.length == 1){
			mem_id = sePass.user[0].mem_id;
		}else{
			mem_id = proPhoto = sePass.user.id;
		}
	}
	//console.log(mem_id);

	mysql.select('select * from cider.cid_member where mem_id =\''+mem_id+'\'', function (err, data){

		var memidval = data;
		mysql.select('SELECT * FROM cider.cid_clipping where mem_id =\''+mem_id+'\'', function (err, data){
			var clipping = data;

	res.render('front/cid_member/mypage', {mypage:memidval, clip : clipping});
   });
  });
});


router.post('/mypage/update', function(req, res, next) {

});

router.post('/mypage/upload', function (req, res){
    var form = new formidable.IncomingForm();

    form.parse(req);

    form.on('fileBegin', function (name, file){
        file.path = __dirname + '/../public/discuss_imgs/' + file.name;
        console.log(file.path);
    });

    form.on('file', function (name, file){
        console.log('Uploaded ' + file.name);
    });

    //res.sendFile(__dirname + '/../public/discuss_imgs/');
    res.redirect('back');
});




router.get('/meminfo', function(req, res, next) {

	res.render('front/cid_member/memInfo', { });

});

router.get('/memup', function(req, res, next) {

	res.render('front/cid_member/memUpdate', { });

});

router.get('/passup', function(req, res, next) {

	res.render('front/cid_member/passUpdate', { });

});

router.get('/memdel', function(req, res, next) {

	res.render('front/cid_member/memDelete', { });

});
module.exports = router;
