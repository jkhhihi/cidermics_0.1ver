var express = require('express');
var router = express.Router();
var mysql = require("./model/mysql");
var nodemailer = require('nodemailer');

router.get('/join_step_1', function(req, res, next) {

	res.render('front/cid_member/cid_join_step_1', { });

});

router.get('/join_step_2', function(req, res, next) {

	res.render('front/cid_member/cid_join_step_2', { });

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
	        user: 'JeongKH91@gmail.com',
	        pass: 'wjdrlgns1'
	    }
	});

	var mailOptions = {

	    from: 'jeongkh91@gmail.com',
	    to: email,

	    subject: '[사이다경제] 비밀번호 인증코드',
	    text: '인증코드' + codeRandom


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


router.get('/mypage', function(req, res, next) {

	res.render('front/cid_member/mypage', { });

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
