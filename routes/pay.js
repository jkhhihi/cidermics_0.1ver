var express = require('express');
var router = express.Router();
var mysql = require("./model/mysql");
var nodemailer = require('nodemailer');

// var Iconv = require('iconv').Iconv;
// var iconv = new Iconv('EUC-KR', 'UTF-8//TRANSLIT//IGNORE');
// iconv.convert([Buffer]);


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

/* GET home page. */


router.get('/pay/:ORDERNO/:cate/:decate/:price', function(req, res, next) {
	var ORDERNO = req.params.ORDERNO;
	var subject = req.params.subject;
	var decate = req.params.decate;
	var cate = req.params.cate;
	var price = req.params.price;

	res.render('front/pay/pay_idx', {ORDERNO:ORDERNO,subject:subject, decate:decate, cate:cate, price:price});
});

router.get('/npay', function(req, res, next) {

	var subject = req.query.subject;
	var idx = req.query.idx;
	var cate = req.query.cate;
	var price = req.query.price;
	var PRODUCTCODE = req.query.PRODUCTCODE;


	res.render('front/pay/pay_go', {subject:subject, idx:idx, cate:cate, price:price, PRODUCTCODE:PRODUCTCODE});

});


router.post('/npayinsert', function(req,res,next){
	var ORDERNO = req.body.ORDERNO;
	var cate = req.body.cate;
	var decate = req.body.decate;
	var price = req.body.price;
	var subject = req.body.subject;
	var USERNAME = req.body.USERNAME;
	var EMAIL = req.body.EMAIL;
	var TELNO = req.body.TELNO;
	var birth = req.body.birth;
	var optsex = req.body.optsex;
	var path = req.body.path;
	var gitar = req.body.gitar;


	var date = getWorldTime(+9);

	var sets = {orderno:ORDERNO, cate:cate, decate:decate, amount:price, name : USERNAME, email:EMAIL, phone:TELNO, birth:birth, sex:optsex, regDate:date, path:path, gitar:gitar};

	mysql.insert('insert into cider.pay_appform set ?', sets,  function (err, data){
		if(err){
			res.redirect('back');
		}

		if(price == 0){
			res.send('<script>alert("신청 완료");location.href="/";</script>');
		}else{
			res.redirect('/pay/'+ORDERNO+'/'+cate+'/'+decate+'/'+price);
		}

	});
});

router.get('/paydone/:ORDERNO', function(req,res,next){
	var ORDERNO = req.params.ORDERNO;
	var date = getWorldTime(+9);

	mysql.select('SELECT * FROM cider.pay_appform where orderno = '+ORDERNO+';', function(err,data){
	res.render('front/pay/pay_done',{oinfo:data});
	});
});

router.get('/nubo_pay_done/:ORDERNO', function(req,res,next){
	var ORDERNO = req.params.ORDERNO;

	mysql.select('SELECT * FROM cider.pay_appform_nubo where orderno = '+ORDERNO+';', function(err,data){
	res.render('front/pay/nubo_pay_done',{oinfo:data});
	});
});



function limtime(){
	 var now = new Date();
	 var _year= now.getFullYear();
	 var _mon = now.getMonth()+1;
	 _mon=""+_mon;
	 if (_mon.length < 2 )
	 {
	    _mon="0"+_mon;
	 }
	 var _date=now.getDate();
	 //var _date = now.setDate(now.getDate() -1);
	 _date =""+_date;
     if (_date.length < 2 )
	 {
	    _date="0"+_date;
	 }
	var _tot =_year+"-"+_mon+"-"+_date;

	return _tot;
}

//무통장 입금
router.get('/pay_noamount', function(req,res,next){
	var USERNAME = req.query.USERNAME;
	var EMAIL = req.query.EMAIL;
	var TELNO = req.query.TELNO;
	var subject = req.query.subject;

	var data = iconv.convert(next).toString();

	//var date = getWorldTime(+9);

	var limdate = limtime();
	//console.log(limdate);
	res.render('front/pay/pay_noamount',{limdate:limdate, USERNAME:USERNAME, EMAIL:EMAIL, TELNO:TELNO, subject:subject});
});

router.post('/pay_noamount', function(req,res,next){
	var USERNAME = req.body.USERNAME;

	var EMAIL = req.body.EMAIL;
	var TELNO = req.body.TELNO;
	var cate = req.body.PRODUCTCATE;
	var decate = req.body.PRODUCTDETAILCATE;
	var subject = req.body.PRODUCTNAME;
	var path = req.body.path;
	var gitar = req.body.gitar;

	var duedate = req.body.duedate;

	var price = req.body.price;
	var insertdate = getWorldTime(+9);


	var limdate = limtime();

	var sets = {USERNAME : USERNAME, EMAIL:EMAIL, TELNO:TELNO, regDate:limdate, cate:cate, decate:decate, subject:subject, duedate:duedate, insertdate:insertdate, state:'입금대기', price:price, path:path, gitar:gitar};

	mysql.insert('insert into cider.fin_nonaccount set ?', sets,  function (err, data){
		if(err){
			res.redirect('back');
		}
	res.render('front/pay/pay_noamount',{limdate:limdate, USERNAME:USERNAME, EMAIL:EMAIL, TELNO:TELNO, subject:subject, price:price});
	});
});





/* Nuborich */

router.get('/paynubo', function(req, res, next) {

	var subject = req.query.subject;
	var cate = req.query.cate;
	var detailCate = req.query.detailCate;
	var price = req.query.price;

	res.render('front/pay/nubo_pay_idx', {subject:subject, cate:cate, detailCate:detailCate, price:price});
});


router.get('/paygonubo/:ORDERNO/:PRODUCTCATE/:PRODUCTDETAILCATE/:AMOUNT', function(req,res,next){
	var ORDERNO = req.params.ORDERNO;
	var PRODUCTCATE = req.params.PRODUCTCATE;
	var PRODUCTDETAILCATE = req.params.PRODUCTDETAILCATE;
	var AMOUNT = req.params.AMOUNT;
	var date = getWorldTime(+9);

	res.render('front/pay/nubo_pay_go',{ORDERNO:ORDERNO, PRODUCTCATE:PRODUCTCATE, PRODUCTDETAILCATE:PRODUCTDETAILCATE, AMOUNT:AMOUNT, date:date });
});

router.post('/payinsertnubo', function(req,res,next){
	var ORDERNO = req.body.ORDERNO;
	var PRODUCTCATE = req.body.PRODUCTCATE;
	var PRODUCTDETAILCATE = req.body.PRODUCTDETAILCATE;
	var AMOUNT = req.body.AMOUNT;
	var USERNAME = req.body.USERNAME;
	var EMAIL = req.body.EMAIL;
	var TELNO = req.body.TELNO;
	var birth = req.body.birth;
	var optsex = req.body.optsex;
	var career = req.body.career;
	var price = req.body.investprice;

	var date = getWorldTime(+9);

	var sets = {orderno:ORDERNO, cate:PRODUCTCATE, decate:PRODUCTDETAILCATE, amount:AMOUNT, name : USERNAME, email:EMAIL, phone:TELNO, birth:birth, sex:optsex, career:career, price:price, regDate:date};

	mysql.insert('insert into cider.pay_appform_nubo set ?', sets,  function (err, data){
		if(err){
			res.redirect('back');
		}

	res.redirect('/nubo_pay_done/'+ORDERNO+'');
	});
});


router.get('/nubo_pay_done/:ORDERNO', function(req,res,next){
	var ORDERNO = req.params.ORDERNO;

	mysql.select('SELECT * FROM cider.pay_appform_nubo where orderno = '+ORDERNO+';', function(err,data){
	res.render('front/pay/nubo_pay_done',{oinfo:data});
	});
});



/* email send */

router.post('/pay_send_email', function(req, res, next) {


	var email = req.body.EMAIL;

	mysql.select('SELECT * FROM cider.pay_appform where email = \''+email+'\';', function(err,data){
	var name = data[0].name;
	var codeRandom = data[0].orderno;
	var regDate = data[0].regdate;

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

	    subject: '[사이다경제] 신청 결제 완료 내역서',
	    //text: "<html><head></head><body>" + '인증코드' + codeRandom + "</body></html>",
	    html: '<table width="500" cellpadding="0" cellspacing="0" style="font-family:"나눔고딕"; font-size:12px"><tr><td height="100" colspan="2"  style="background-color:#1b87c9; color:#fff; font-size:16px"><blockquote><p style="margin-bottom:10px;"><b>사이다경제</b></p><b>"주문 내역"</b></td><td></td></tr><tr><td height="150" ><blockquote><p><span><b>'+name+'</b></span> 님 안녕하세요.<br /><br />사이다경제입니다:)<br /><br />결제하신 주문번호는 <span><b style="font-size:18px; color:#2686c9;">' + codeRandom + '</b></span> 입니다. <br><br> 신청일 : '+regDate+'</p></blockquote></td><td align="right" style="padding-right:30px"><p><img src="http://i.imgur.com/vHA3uRr.png" height="100" /></p></td></tr><tr><td height="50" style="border-bottom:1px solid #1b87c9;" colspan="2" ><p align="right"><b>문의 : contact@cidermics.com  <br> 카카오 플러스 친구 ID : 사이다경제</b></p></td><td> </td></tr><tr><td height="80" colspan="2" ><blockquote><p align="center"><span style="color:#1b87c9; border:2px solid #1b87c9; border-radius:5px; padding:8px 12px;"><a style="color:#1b87c9; text-decoration:none" href="http://www.cidermics.com"><b>"사이다경제" 로 바로가기 ></b></a></span></p></blockquote></td><td></td></tr><tr><td height="80" colspan="2" ><blockquote><p align="center"><span style="color:#1b87c9; border:2px solid #1b87c9; border-radius:5px; padding:8px 12px;"><a style="color:#1b87c9; text-decoration:none" href="http://plus.kakao.com/home/@%EC%82%AC%EC%9D%B4%EB%8B%A4%EA%B2%BD%EC%A0%9C"><b>"카카오톡 플러스 친구" 로 바로가기 ></b></a></span></p></blockquote></td></tr></table></body></html>'


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

	res.send('<script>alert("이메일 전송 완료");location.href="/paydone/'+data[0].orderno+'";</script>');

  });
});


/* nubo rich email send */

router.post('/pay_send_email_nubo', function(req, res, next) {


	var email = req.body.EMAIL;

	mysql.select('SELECT * FROM cider.pay_appform_nubo where email = \''+email+'\';', function(err,data){
	var name = data[0].name;
	var codeRandom = data[0].orderno;
	var regDate = data[0].regdate;

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

	    subject: '[사이다경제] 신청 결제 완료 내역서',
	    //text: "<html><head></head><body>" + '인증코드' + codeRandom + "</body></html>",
	    html: '<table width="500" cellpadding="0" cellspacing="0" style="font-family:"나눔고딕"; font-size:12px"><tr><td height="100" colspan="2"  style="background-color:#1b87c9; color:#fff; font-size:16px"><blockquote><p style="margin-bottom:10px;"><b>사이다경제</b></p><b>"주문 내역"</b></td><td></td></tr><tr><td height="150" ><blockquote><p><span><b>'+name+'</b></span> 님 안녕하세요.<br /><br />사이다경제입니다:)<br /><br />결제하신 주문번호는 <span><b style="font-size:18px; color:#2686c9;">' + codeRandom + '</b></span> 입니다. <br><br> 신청일 : '+regDate+'</p></blockquote></td><td align="right" style="padding-right:30px"><p><img src="http://i.imgur.com/vHA3uRr.png" height="100" /></p></td></tr><tr><td height="50" style="border-bottom:1px solid #1b87c9;" colspan="2" ><p align="right"><b>문의 : contact@cidermics.com  <br> 카카오 플러스 친구 ID : 사이다경제</b></p></td><td> </td></tr><tr><td height="80" colspan="2" ><blockquote><p align="center"><span style="color:#1b87c9; border:2px solid #1b87c9; border-radius:5px; padding:8px 12px;"><a style="color:#1b87c9; text-decoration:none" href="http://www.cidermics.com"><b>"사이다경제" 로 바로가기 ></b></a></span></p></blockquote></td><td></td></tr><tr><td height="80" colspan="2" ><blockquote><p align="center"><span style="color:#1b87c9; border:2px solid #1b87c9; border-radius:5px; padding:8px 12px;"><a style="color:#1b87c9; text-decoration:none" href="http://plus.kakao.com/home/@%EC%82%AC%EC%9D%B4%EB%8B%A4%EA%B2%BD%EC%A0%9C"><b>"카카오톡 플러스 친구" 로 바로가기 ></b></a></span></p></blockquote></td></tr></table></body></html>'


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

	res.send('<script>alert("이메일 전송 완료");location.href="/nubo_pay_done/'+data[0].orderno+'";</script>');

  });
});


module.exports = router;
