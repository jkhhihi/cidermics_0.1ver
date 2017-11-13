//var express = require('express');
var express = require('express'), ipfilter = require('express-ipfilter').IpFilter;
var router = express.Router();
var mysql = require("./model/mysql");

var nodemailer = require('nodemailer');

//var Iconv = require('iconv').Iconv;
//var iconv = new Iconv('EUC-KR', 'UTF-8//TRANSLIT//IGNORE');

var urlencode = require('urlencode');
//var assert = require('assert');

//var qs = require('querystring');

//var request = require("request");
//var cheerio = require("cheerio");
//var iconv  = require('iconv-lite');

/*request({
encoding: null,
uri: 'http://localhost/test3',
}, function (err, response, body) {
      var Utf8String = iconv.decode(new Buffer(body), "euc-kr");
      console.log(body);
});
*/



/*인서트 테스트 코드*/
router.get('/test', function(req, res, next) {
	var row;
	var year = req.body.year;
	var _tot = releaseTime();
	 
	 qry="select con_no, con_photo, con_title, if (a.con_upDate > DATE_ADD(now(),INTERVAL -1 DAY) ,'/page_imgs/main_img/new_mark4.svg','/page_imgs/main_img/new_mark1px.png') as chkDat from cider.cid_contents a where a.con_release <= '"+_tot+"' order by a.con_no desc limit 0,4";
	mysql.select(qry, function (err, data){
		if (err) throw err;
		 row = data;
	res.render('front/cid_quiz/test', { contents : row});
});
});

//let url = `http://localhost/test3?test12=${qs.escape('apple 쥬스')}`; 

router.get('/test3', function(req, res, next) {

	//console.log(req.url);
	//var test12 = req.query.test12;
	//console.log(qs.escape(test12));
	//console.log(qs.unescape(req.query.test12));

	//console.log(encodeURIComponent(req.query));

	//var decodedUrl = qs.unescape(req.url);
	/*request({url:"/test3",encoding:'binary'}, function(error,response, body){
		if(!error){
			var convertedCon = new Buffer(body, 'binary')
			iconv = new Iconv('euc-kr','UTF8');
			convertedCon = iconv.convert(convertedCon).toString();
			var $ = cheerio.load(convertedCon);
			linkTable = new Array();
		}
	})*/

	//res.set({ 'content-type': 'application/json; charset=euc-kr' });
	//res.header("Content-Type", "application/json; charset=EUC-KR");
	//res.setEncoding('utf8');
	//res.on('data',function(chunk){ body_data += chunk; });
	//res.on('data',function(chunk){ body_data += iconv.convert(chunk).toString('UTF-8'); });


	//console.log("All query strings: " + JSON.stringify(req.query));
	//res.charset = 'EUC-KR';
	//res.set({ 'content-type': 'application/json; charset=euc-kr' });
	//res.header("Content-Type", "application/json; charset=EUC-KR");
	//console.log(req.query);
	var test12 = req.query.test12;
	var test1 = req.query.test1;
	//qs.unescape(test12);

	//var en1 = qs.escape(test12);
	//var en = qs.unescape(en1);
	//console.log(en1);
	//console.log(en);
	//console.log("------");
	//console.log(encodeURL(test12));

	//console.log(test12);
	//console.log(urlencode('ㅇㅇ','EUC-KR'));
	//test1 = '\''+ test12 + '\'';
	//console.log(test1);
	//console.log(urlencode.parse('test12='+test12+'',{charset:'EUC-KR'}));


	//console.log(test12);

	// parse gbk querystring 
var asas = urlencode.parse('test12='+test12+'', {charset: 'EUC-KR'}); // {nick: '苏千'}
console.log(asas.test12);
var asa = urlencode.parse('test1='+test1+'', {charset: 'EUC-KR'}); // {nick: '苏千'}
console.log(asa.test1);
//var as = urlencode.stringify(asas, {charset: 'EUC-KR'}); // {nick: '苏千'}
//console.log(as);

//console.log(encodeURIComponent(JSON.stringify(asas)));

//urlencode.stringify(obj, {charset: 'EUC-KR'});
 
 //stringify obj with gbk encoding 
//var str = 'test12=' + urlencode(test12, 'EUC-KR'); // x[y][0][v][w]=%CE%ED%BF%D5 
//var obj =  {'test12' : test12};
//var str = urlencode('雾空', 'gbk'); // x[y][0][v][w]=%CE%ED%BF%D5 
//var obj =  {'w' : 'ㅇㅇ'};
//console.log(obj);
//var as1 = urlencode.stringify(obj, {charset: 'EUC-KR'});
//console.log(as1);
var ORDERNO = req.query.ORDERNO;
console.log(ORDERNO);
var HOMEURL = req.query.HOMEURL;
console.log(HOMEURL);
var date = getWorldTime(+9);
console.log(date);
	//var sets = {quiz_options : asas.test12 };
	//mysql.insert('insert into cider.cid_quiz set ?', sets,  function (err, data){
	//res.send(asas.test12);
	res.render('front/etc/finbook/finbook_ch_purchase',{});
//});
});


router.post('/insert', function(req, res, next) {
	
	var in1 = req.body.in1;
	
	var sets = {quiz_options : in1 };
	
	mysql.insert('insert into cider.cid_quiz set ?', sets,  function (err, data){
		
    	res.redirect('/test');
    });
});





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

function rdate() {
	var _tot;
	var now = new Date();
	var _year= now.getFullYear();
	var _mon = now.getMonth()+1;
	 _mon=""+_mon;
		if (_mon.length < 2 )
		{
		_mon="0"+_mon;
		}
	 _tot=_year+""+_mon;
	return _tot;
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

function releaseTime(){
	 var now = new Date();
	 var _year= now.getFullYear();
	 var _mon = now.getMonth()+1;
	 _mon=""+_mon;
	 if (_mon.length < 2 )
	 {
	    _mon="0"+_mon;
	 }
	 var _date=now.getDate ();
	 _date =""+_date;
     if (_date.length < 2 )
	 {
	    _date="0"+_date;
	 }
	 var _hor = now.getHours  ();
	 _hor =""+_hor;
	 if (_hor.length < 2 )
	 {
	    _hor="0"+_hor;
	 }
	 var _min=now.getMinutes();
	  _min =""+_min;
	 if (_min.length < 2 )
	 {
	    _min="0"+_min;
	 }
	 
	var _tot =_year+""+_mon+""+_date+""+_hor+""+ _min;

	return _tot;
}


function aaaa(){
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



//예전버젼 메인
router.get('/main_old', function(req, res, next) {
	var row;

	var _tot = releaseTime();

	 
	qry="select con_no, con_photo, con_title, if (a.con_upDate > DATE_ADD(now(),INTERVAL -1 DAY) ,'/page_imgs/main_img/new_mark4.svg','/page_imgs/main_img/new_mark1px.png') as chkDat from cider.cid_contents a where a.con_release <= '"+_tot+"' order by a.con_no desc limit 0,12";
	mysql.select(qry, function (err, data){
		if (err) throw err;
		 row = data;
	res.render('front/cid_main', { contents : row});
  });
	 
});

router.get('/', function(req, res, next) {
	var row;
	var row2;
	var _tot = releaseTime();


	var now = new Date();
	var _year=  now.getFullYear();
	var _mon =   now.getMonth()+1;
	_mon=""+_mon;
	if (_mon.length < 2 )
	{
	_mon="0"+_mon;
	}
	var _totmon = _year+""+_mon;

	//최신 콘텐츠 qry
	var qry="select con_no, con_photo, con_title, if (a.con_upDate > DATE_ADD(now(),INTERVAL -5 DAY) ,'/page_imgs/main_img/new_mark4.svg','/page_imgs/main_img/new_mark1px.png') as chkDat from cider.cid_contents a where a.con_release <= '"+_tot+"' order by a.con_release desc limit 0,3";
	var qry2="select con_no, con_photo, con_title, if (a.con_upDate > DATE_ADD(now(),INTERVAL -1 DAY) ,'/page_imgs/main_img/new_mark4.svg','/page_imgs/main_img/new_mark1px.png') as chkDat from cider.cid_contents a where a.con_release <= '"+_tot+"' order by a.con_release desc limit 3,12";
	mysql.select(qry, function (err, data){
		if (err) throw err;
		 row = data;

		 mysql.select(qry2, function (err, data){
		if (err) throw err;
		 row2 = data;


		res.render('front/cid_main2', { contents : row, allcontents:row2});
		});
	});
});


router.get('/1', function(req, res, next) {
	var row;
	var popular;
	var podcast;
	var _tot = releaseTime();


	var now = new Date();
	var _year=  now.getFullYear();
	var _mon =   now.getMonth()+1;
	_mon=""+_mon;
	if (_mon.length < 2 )
	{
	_mon="0"+_mon;
	}
	var _totmon = _year+""+_mon;

	//최신 콘텐츠 qry
	var qry="select con_no, con_photo, con_title, if (a.con_upDate > DATE_ADD(now(),INTERVAL -5 DAY) ,'/page_imgs/main_img/new_mark4.svg','/page_imgs/main_img/new_mark1px.png') as chkDat from cider.cid_contents a where a.con_release <= '"+_tot+"' order by a.con_release desc limit 0,5";
	mysql.select(qry, function (err, data){
		if (err) throw err;
		 row = data;
		 mysql.select('SELECT * from cider.cid_contents where con_pop = 1 order by con_release desc limit 0,3;', function (err, data){
		 //mysql.select("SELECT * FROM cider.cid_contents where con_release between "+_totmon+"010000 and "+_tot+" order by con_viewCount desc limit 0,16;", function (err, data){
		//mysql.select("SELECT con_no, con_photo, con_title FROM cider.cid_contents where con_release between "+_totmon+"010000 and "+_tot+" order by con_viewCount desc limit 0,6;", function (err, data){ 
		  if (err) throw err;
			popular = data;
		
			mysql.select("select con_no, con_photo, con_title from cider.cid_contents where con_category = '4' and con_release <= '"+_tot+"' order by con_no desc limit 0,3", function (err, data){
				if(err){ res.redirect('back'); }

				stock1 = data;

		  mysql.select("select con_no, con_photo, con_title from cider.cid_contents where con_category = '7' and con_release <= '"+_tot+"' order by con_no desc limit 0,3", function (err, data){
			if(err){ res.redirect('back'); }

			books = data;

			mysql.select("select con_no, con_photo, con_title from cider.cid_contents where con_category = '6' and con_release <= '"+_tot+"' order by con_no desc limit 0,3", function (err, data){
				if(err){ res.redirect('back'); }

				podcast = data;

				mysql.select("select con_no, con_photo, con_title from cider.cid_contents where con_category = '5' and con_release <= '"+_tot+"' order by con_no desc limit 0,3", function (err, data){
				if(err){ res.redirect('back'); }

				project = data;

					mysql.select('SELECT rev_title,rev_QA1 FROM cider.cid_fi_review order by rev_no desc limit 1,3;', function (err, data2){


						mysql.select("select con_no, con_photo, con_title from cider.cid_contents where con_category = '4' and con_release <= '"+_tot+"' order by con_no desc limit 0,2", function (err, data){
							if(err){ res.redirect('back'); }
							stock = data;
							
							mysql.select("select con_no, con_photo, con_title from cider.cid_contents where con_category = '3' and con_release <= '"+_tot+"' order by con_no desc limit 0,2", function (err, data){
							if(err){ res.redirect('back'); }
							company = data;
								mysql.select("select con_no, con_photo, con_title from cider.cid_contents where con_category = '2' and con_release <= '"+_tot+"' order by con_no desc limit 0,2", function (err, data){
								if(err){ res.redirect('back'); }
								finance = data;
									mysql.select("select con_no, con_photo, con_title from cider.cid_contents where con_category = '1' and con_release <= '"+_tot+"' order by con_no desc limit 0,2", function (err, data){
									if(err){ res.redirect('back'); }
									economics = data;

		    		res.render('front/cid_main1', { contents : row, popular: popular,books:books,podcast:podcast,project:project,rev:data2,stock:stock,company:company,finance:finance,economics:economics,stock1:stock1});
		    });
	       });
	      });
	 	 });
		});
	   });
	  });
	 });
	});
   });
  });
 });


router.get('/maincon_include', function(req,res,next){
	var arr = []
	for(var i = 1; i < 7; i++){
	    arr[i] = function(id){
	    return function(){
	        return id;
	    }
	   }(i);
	}

	for(var index in arr) {
	var con_qry;
    con_qry = "select con_no, con_photo, con_title from cider.cid_contents where con_category = '"+arr[index]()+"' order by con_no desc limit 0,4";


    if(arr[index]() == 6 ){

    mysql.select(con_qry, function (err, data){
				if(err){ res.redirect('back'); }
				podcast = data;
				

		});
	   }
	else if(arr[index]() == 5){
		 mysql.select(con_qry, function (err, data){
				if(err){ res.redirect('back'); }
				project = data;

		});
	}
  }
	res.render('front/cid_maincon_include', {podcast:podcast});
});


router.post('/selectDate', function(req, res, next) {
	var sd = req.body.startDate;
   var qry="";
   //where con_regDate like \'%"+x+"\'
    qry="select con_no, con_photo, con_title from cider.cid_contents where con_regDate like \'%"+sd+"%\' order by con_no desc";
   mysql.select(qry, function (err, data){

       if (err) throw err;
       res.render('front/cid_main', { contents : data});
   });
});


router.get('/complete', function(req, res, next) {

	res.render('front/complete', { });

});

router.get('/modal', function(req, res, next) {

	res.render('front/modal', { });

});

router.get('/appdown', function(req, res, next) {
	res.render('front/cid_appdown', { });
});

router.get('/appdown1', function(req, res, next) {
	res.render('front/cid_appdown_gold', { });
});

router.get('/appdown3', function(req, res, next) {
	res.render('front/cid_appdown3', { });
});

router.get('/survey', function(req, res, next) {

	res.render('front/cid_survey', { });

});


router.post('/surveyGo', function(req, res, next) {

	var g1 = req.body.group1;
	var g2 = req.body.group2;
	var g3 = req.body.group3;
	var g4 = req.body.group4;
	var g5 = req.body.group5;
	var g6 = req.body.group6;


	var etc1 = req.body.etc1;
	var etc2 = req.body.etc2;
	var etc3 = req.body.etc3;
	var etc4 = req.body.etc4;
	var etc5 = req.body.etc5;

	var name = req.body.name;
	var phone = req.body.phone;

	//var sets = {sry_cate:1,sry_group2:g2};

	//mysql.insert('insert into cider.cid_survey (sry_group3) values('+g3+')', function (err, data){

	var sets = {sry_cate: 1 , sry_name : name , sry_phone : phone , sry_group1:g1,sry_group2:g2,sry_group3:g3,sry_group4:g4,sry_group5:g5,sry_group6:g6,sry_etc1:etc1,sry_etc2:etc2,sry_etc3:etc3,sry_etc4:etc4,sry_etc5:etc5};
	mysql.insert('insert into cider.cid_survey set ?', sets,  function (err, data){
		res.redirect('/');
		//res.send('<script>alert("참여해주셔서 감사합니다");location.href="/";</script>');
	});
});



router.get('/top', function(req, res, next) {

/*
	var sess = req.session;
	console.log(sess);
	var sePass = sess.passport;
	if(sePass != null){
		var proPhoto = sess.passport.user.photos[0].value;
		console.log(sess.passport.user.photos[0].value);
	}
	res.render('front/top', {proPhoto:proPhoto,sePass:sePass});
*/
		res.render('front/top', {proPhoto:proPhoto});

});


router.get('/topLogin', function(req, res, next) {

	var sePass = req.session.passport;
	if(sePass != null){
		var proPhoto ='';
		if(sePass.user.length == 1){
			proPhoto = sePass.user[0].mem_profile;
		}else{
			proPhoto = proPhoto = sePass.user.photos[0].value;
		}


		/* 페북, 로그인 세션 테스트
		console.log(sess.passport.user.length);
		console.log(sess.passport.user.photos[0].value);
		if(sess.passport.user.photos[0].value != null){
			proPhoto = sess.passport.user.photos[0].value;
			console.log(proPhoto);
			console.log("ㅋㅋㅋ");
		}else{
			proPhoto = sess.passport.user[0].mem_no;
			console.log(proPhoto);
			console.log("ㄷㄷㄷ");
		}
		*/
	}
       res.render('front/topLogin', {proPhoto:proPhoto});
});

router.get('/facebooklogin', function(req,res,next){
	res.render('front/facebooklogin',{});
});

router.get('/alarm', function(req,res,next){
	res.render('front/alarm',{});
});



router.get('/personalinfo', function(req,res,next){
	res.render('front/personalinfo',{});
});







// 핀북 랜딩 페이지
router.get('/finbook', function(req,res,next){
	res.render('front/etc/finbook/finbook',{});
});

router.get('/finbook_pur', function(req,res,next){
	res.render('front/etc/finbook/finbook_purchase',{});
});

router.get('/finbook_ch/:ORDERNO', function(req,res,next){
	var ORDERNO = req.params.ORDERNO;

	var date = getWorldTime(+9);
	var sets = {ORDERNO : ORDERNO, payDate:date, flag:'Y'};

	mysql.insert('insert into cider.fin_order set ?', sets,  function (err, data){
		if(err){
			res.redirect('back');
		}

	res.render('front/etc/finbook/finbook_ch_purchase',{ORDERNO:ORDERNO, date:date});
	});
});

/*router.get('/finbook_ch/', function(req,res,next){
	res.render('front/etc/finbook/finbook_ch_purchase',{});
});*/

router.post('/finbook_ch_code/:ORDERNO', function(req, res, next) {
	
	var ORDERNO = req.body.ORDERNO;
	var USERNAME = req.body.USERNAME;
	var EMAIL = req.body.EMAIL;
	var TELNO = req.body.TELNO;

	
	var sets = {ORDERNO : ORDERNO, USERNAME : USERNAME, EMAIL:EMAIL , TELNO:TELNO};
	mysql.update('update cider.fin_order set USERNAME = ?,  EMAIL = ?, TELNO = ? where ORDERNO = ?', [USERNAME,EMAIL,TELNO,ORDERNO], function (err, data){

    	res.redirect('/finbook_ch_code/'+ORDERNO+'');
    });
});

router.get('/finbook_ch_code/:ORDERNO', function(req,res,next){
	var ORDERNO = req.params.ORDERNO;

	mysql.select('SELECT cider.fin_order.ORDERNO, cider.fin_order.USERNAME, cider.fin_order.EMAIL, cider.fin_order.TELNO, cider.fin_order.payDate, cider.fin_code.fcode FROM cider.fin_order INNER JOIN cider.fin_code ON cider.fin_order.idx=cider.fin_code.idx where cider.fin_order.ORDERNO = '+ORDERNO+';', function(err,data){
	res.render('front/etc/finbook/finbook_ch_code',{oinfo:data});
});
});



//무통장 입금
router.get('/finbook_noamount', function(req,res,next){
	var USERNAME = req.query.USERNAME;
	var EMAIL = req.query.EMAIL;
	var TELNO = req.query.TELNO;

	console.log(USERNAME);
	console.log(EMAIL);
	//var date = getWorldTime(+9);

	var limdate = aaaa();
	//console.log(limdate);
	res.render('front/etc/finbook/finbook_noamount',{limdate:limdate, USERNAME:USERNAME, EMAIL:EMAIL, TELNO:TELNO});
});


router.get('/finbook_search_fin', function(req,res,next){
	res.render('front/etc/finbook/finbook_search',{});
});

router.post('/finbook_search_fin', function(req, res, next) {


	var email = req.body.EMAIL;

	mysql.select('SELECT cider.fin_order.EMAIL, cider.fin_code.fcode FROM cider.fin_order INNER JOIN cider.fin_code ON cider.fin_order.idx=cider.fin_code.idx where cider.fin_order.EMAIL = \''+email+'\';', function(err,data){
	var codeRandom = data[0].fcode;

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

	    subject: '[사이다경제] 핀코드',
	    //text: "<html><head></head><body>" + '인증코드' + codeRandom + "</body></html>",
	    html: '<table width="500" cellpadding="0" cellspacing="0" style="font-family:"나눔고딕"; font-size:12px"><tr><td height="100" colspan="2"  style="background-color:#1b87c9; color:#fff; font-size:16px"><blockquote><p style="margin-bottom:10px;"><b>사이다경제</b></p><b>"핀코드"</b></td><td></td></tr><tr><td height="150" ><blockquote><p><span><b>'+email+'</b></span> 님 안녕하세요.<br /><br />사이다경제입니다:)<br /><br />결제하신 핀코드는 <span><b style="font-size:18px; color:#2686c9;">' + codeRandom + '</b></span> 입니다.</p></blockquote></td><td align="right" style="padding-right:30px"><p><img src="http://i.imgur.com/vHA3uRr.png" height="100" /></p></td></tr><tr><td height="50" style="border-bottom:1px solid #1b87c9;" colspan="2" ><p align="right"><b>문의 : contact@cidermics.com</b></p></td><td></td></tr><tr><td height="80" colspan="2" ><blockquote><p align="center"><span style="color:#1b87c9; border:2px solid #1b87c9; border-radius:5px; padding:8px 12px;"><a style="color:#1b87c9; text-decoration:none" href="http://www.cidermics.com"><b>"사이다경제" 로 바로가기 ></b></a></span></p></blockquote></td><td></td></tr><tr><td height="80" colspan="2" ><blockquote><p align="center"><span style="color:#1b87c9; border:2px solid #1b87c9; border-radius:5px; padding:8px 12px;"><a style="color:#1b87c9; text-decoration:none" href="http://onlinetest.thecubemind.co.kr/cidermics"><b>"핀북 검사" 로 바로가기 ></b></a></span></p></blockquote></td></tr></table></body></html>'


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
  	//res.redirect('/finbook');
	//res.send({ user: '1234' })
	res.send('<script>alert("이메일 전송 완료");location.href="/finbook";</script>');
	//res.send([1,2,3]);
	//res.redirect('/psearch2')

	//res.render('front/cid_member/password_search1', { });
  });
});

router.post('/finbook_send_email', function(req, res, next) {


	var email = req.body.EMAIL;

	mysql.select('SELECT cider.fin_order.ORDERNO, cider.fin_order.EMAIL, cider.fin_code.fcode FROM cider.fin_order INNER JOIN cider.fin_code ON cider.fin_order.idx=cider.fin_code.idx where cider.fin_order.EMAIL = \''+email+'\';', function(err,data){
	var codeRandom = data[0].fcode;

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

	    subject: '[사이다경제] 핀코드',
	    //text: "<html><head></head><body>" + '인증코드' + codeRandom + "</body></html>",
	    html: '<table width="500" cellpadding="0" cellspacing="0" style="font-family:"나눔고딕"; font-size:12px"><tr><td height="100" colspan="2"  style="background-color:#1b87c9; color:#fff; font-size:16px"><blockquote><p style="margin-bottom:10px;"><b>사이다경제</b></p><b>"핀코드"</b></td><td></td></tr><tr><td height="150" ><blockquote><p><span><b>'+email+'</b></span> 님 안녕하세요.<br /><br />사이다경제입니다:)<br /><br />결제하신 핀코드는 <span><b style="font-size:18px; color:#2686c9;">' + codeRandom + '</b></span> 입니다.</p></blockquote></td><td align="right" style="padding-right:30px"><p><img src="http://i.imgur.com/vHA3uRr.png" height="100" /></p></td></tr><tr><td height="50" style="border-bottom:1px solid #1b87c9;" colspan="2" ><p align="right"><b>문의 : contact@cidermics.com</b></p></td><td></td></tr><tr><td height="80" colspan="2" ><blockquote><p align="center"><span style="color:#1b87c9; border:2px solid #1b87c9; border-radius:5px; padding:8px 12px;"><a style="color:#1b87c9; text-decoration:none" href="http://www.cidermics.com"><b>"사이다경제" 로 바로가기 ></b></a></span></p></blockquote></td><td></td></tr><tr><td height="80" colspan="2" ><blockquote><p align="center"><span style="color:#1b87c9; border:2px solid #1b87c9; border-radius:5px; padding:8px 12px;"><a style="color:#1b87c9; text-decoration:none" href="http://onlinetest.thecubemind.co.kr/cidermics"><b>"핀북 검사" 로 바로가기 ></b></a></span></p></blockquote></td></tr></table></body></html>'


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
  	//res.redirect('/finbook');
	//res.send({ user: '1234' })
	res.send('<script>alert("이메일 전송 완료");location.href="/finbook_ch_code/'+data[0].ORDERNO+'";</script>');
	//res.send([1,2,3]);
	//res.redirect('/psearch2')

	//res.render('front/cid_member/password_search1', { });
  });
});


//특정 아이피만 allow
/*var http = require('http');
http.createServer(function (req, res)
{
    var ip = req.ip || req.connection.remoteAddress || req.socket.remoteAddress || req.connection.socket.remoteAddress;
    if (ip == '27.102.213.200') // exit if it's a particular ip
        res.end();
});*/

//ip filter
//var testers = ['27.102.213.200','27.102.213.209'];
//var testers = [['27.102.213.200','27.102.213.209']];
//var testers = [['192.168.0.1','192.168.0.185']];
//var testers = ['::ffff:127.0.0.1'];
var testers = ['127.0.0.1/24'];

//ip허용
var ips = [['27.102.213.200','27.102.213.209']];
//var ips = ['::ffff:127.0.0.1'];
var ipss = ['::1','::ffff:127.0.0.1'];

 
// Create the server 
//router.use('/cardOrder',ipfilter(ips));

//card결제
//router.post('/cardOrder', function(req, res, next) {
//router.post('/cardOrder', ipfilter(testers,{mode:'allow'}), function(req, res, next) {
//router.get('/cardOrder', ipfilter(ips, {mode: 'allow'}), function(req, res) {
//router.use('/cardOrder',ipfilter(ips, {})); // the ipfilter only applies to the routes below
//router.get('/cardOrder', ipfilter(ips, {mode: 'allow'}), function(req, res) {

router.get('/cardOrder',ipfilter(ips,ipss, {mode: 'allow'}), function(req, res) {

	console.log(ips);
	console.log(ipss);
/*	var CPID = req.body.CPID;
	var ORDERNO = req.body.ORDERNO;
	var PRODUCTTYPE = req.body.PRODUCTTYPE;
	var BILLTYPE = req.body.BILLTYPE;
	var TAXFREECD = req.body.TAXFREECD;
	var AMOUNT = req.body.AMOUNT;
	var CPQUOTA = req.body.CPQUOTA;
	var EMAIL = req.body.EMAIL;
	var USERID = req.body.USERID;
	var USERNAME = req.body.USERNAME;
	var PRODUCTCODE = req.body.PRODUCTCODE;
	var PRODUCTNAME = req.body.PRODUCTNAME;
	var RESERVEDINDEX1 = req.body.RESERVEDINDEX1;
	var RESERVEDINDEX2 = req.body.RESERVEDINDEX2;
	var RESERVEDSTRING = req.body.RESERVEDSTRING;
	var CLOSEURL = req.body.CLOSEURL;
	var FAILURL = req.body.FAILURL;
	var APPURL = req.body.APPURL;
	var HOMEURL = req.body.HOMEURL;
	var DIRECTRESULTFLAG = req.body.DIRECTRESULTFLAG;
	var CARDLIST = req.body.CARDLIST;
	var HIDECARDLIST = req.body.HIDECARDLIST;
	var POPUPTYPE = req.body.POPUPTYPE;*/
	var CPID = req.query.CPID;
	var ORDERNO = req.query.ORDERNO;
	var PRODUCTTYPE = req.query.PRODUCTTYPE;
	var BILLTYPE = req.query.BILLTYPE;
	var TAXFREECD = req.query.TAXFREECD;
	var AMOUNT = req.query.AMOUNT;
	var CPQUOTA = req.query.CPQUOTA;
	var EMAIL = req.query.EMAIL;
	var USERID = req.query.USERID;
	var USERNAME = req.query.USERNAME;
	var PRODUCTCODE = req.query.PRODUCTCODE;
	var PRODUCTNAME = req.query.PRODUCTNAME;
	var RESERVEDINDEX1 = req.query.RESERVEDINDEX1;
	var RESERVEDINDEX2 = req.query.RESERVEDINDEX2;
	var RESERVEDSTRING = req.query.RESERVEDSTRING;
	var CLOSEURL = req.query.CLOSEURL;
	var FAILURL = req.query.FAILURL;
	var APPURL = req.query.APPURL;
	var HOMEURL = req.query.HOMEURL;
	var DIRECTRESULTFLAG = req.query.DIRECTRESULTFLAG;
	var CARDLIST = req.query.CARDLIST;
	var HIDECARDLIST = req.query.HIDECARDLIST;
	var POPUPTYPE = req.query.POPUPTYPE;
	var PHONENO = req.query.PHONENO;

	/*var PAYMETHOD = req.query.PAYMETHOD;
	var SETTDATE = req.query.SETTDATE;
	var AUTHNO = req.query.AUTHNO;
	var CARDCODE = req.query.CARDCODE;
	var CARDNAME = req.query.CARDNAME;
	var CARDNO = req.query.CARDNO;*/


	var date = getWorldTime(+9);

	var enPdnm = urlencode.parse('PRODUCTNAME='+PRODUCTNAME+'', {charset: 'EUC-KR'}); // {nick: '苏千'}
	console.log(enPdnm.PRODUCTNAME);
	var enUsernm = urlencode.parse('USERNAME='+USERNAME+'', {charset: 'EUC-KR'}); // {nick: '苏千'}
	console.log(enUsernm.USERNAME);

	var sets = {CPID : CPID, ORDERNO : ORDERNO, PRODUCTTYPE : "2", BILLTYPE : "1", AMOUNT:AMOUNT, CPQUOTA : CPQUOTA, EMAIL : EMAIL, USERID : USERID, USERNAME : enUsernm.USERNAME,
		PRODUCTCODE : PRODUCTCODE, PRODUCTNAME:enPdnm.PRODUCTNAME, RESERVEDINDEX1:RESERVEDINDEX1, RESERVEDINDEX2 : RESERVEDINDEX2, RESERVEDSTRING : RESERVEDSTRING, 
		CLOSEURL : "http://cidermics.com/finbook_pur",FAILURL : "http://cidermics.com/finbook_pur", HOMEURL : "http://cidermics.com/finbook_ch", APPURL : "http://cidermics.com/finbook",
		DIRECTRESULTFLAG : DIRECTRESULTFLAG, CARDLIST : CARDLIST,HIDECARDLIST:HIDECARDLIST, TAXFREECD : "00", POPUPTYPE : POPUPTYPE, date:date
		};
	//, PAYMETHOD:PAYMETHOD, SETTDATE:SETTDATE, AUTHNO:AUTHNO,CARDCODE:CARDCODE, CARDNAME:CARDNAME, CARDNO:CARDNO, date:date
	mysql.insert('insert into cider.cardOrder set ?', sets, function (err, data){
		if(err){
			res.redirect('back');
		}
	//res.redirect('/cardOrder');
	//mysql.select('select * from cider.cardOrder where ORDERNO ="'+ORDERNO+'"', function (err, data2){
	//	console.log(data);
	res.render('front/etc/finbook/finbook_success',{});
	});
  });
//});


//휴대폰 결제
//router.use('/mobileOrder',ipfilter(ips, {})); // the ipfilter only applies to the routes below
//router.get('/mobileOrder', function(req, res) {
//router.get('/mobileOrder', ipfilter(ips, {mode: 'allow'}), function(req, res) {
//router.use('/mobileOrder', ipfilter(testers, {}));
//router.get('/mobileOrder', ipfilter(testers,{mode:'allow'}), function(req, res, next) {
//router.get('/mobileOrder', function(req, res, next) {

router.get('/mobileOrder',ipfilter(ips,ipss, {mode: 'allow'}), function(req, res) {

	console.log(ips);
	console.log(ipss);

	var CPID = req.query.CPID;
	var ORDERNO = req.query.ORDERNO;
	var PRODUCTTYPE = req.query.PRODUCTTYPE;
	var BILLTYPE = req.query.BILLTYPE;
	//var TAXFREECD = req.body.TAXFREECD; // 모바일은 db테이블에 없음.
	var AMOUNT = req.query.AMOUNT;
	var PRODUCTNAME = req.query.PRODUCTNAME;
	var HOMEURL = req.query.HOMEURL;
	var CLOSEURL = req.query.CLOSEURL;
	var FAILURL = req.query.FAILURL;
	//var APPURL = req.body.APPURL; // 모바일은 db테이블에 없음.

	//var CPQUOTA = req.body.CPQUOTA;
	var EMAIL = req.query.EMAIL;
	var USERID = req.query.USERID;
	var USERNAME = req.query.USERNAME;
	var PRODUCTCODE = req.query.PRODUCTCODE;
	var RESERVEDINDEX1 = req.query.RESERVEDINDEX1;
	var RESERVEDINDEX2 = req.query.RESERVEDINDEX2;
	var RESERVEDSTRING = req.query.RESERVEDSTRING;
	var DIRECTRESULTFLAG = req.query.DIRECTRESULTFLAG;
	var MOBILECOMPANYLIST = req.query.MOBILECOMPANYLIST;

	var date = getWorldTime(+9);

	var enPdnm = urlencode.parse('PRODUCTNAME='+PRODUCTNAME+'', {charset: 'EUC-KR'}); // {nick: '苏千'}
	console.log(enPdnm.PRODUCTNAME);
	var enUsernm = urlencode.parse('USERNAME='+USERNAME+'', {charset: 'EUC-KR'}); // {nick: '苏千'}
	console.log(enUsernm.USERNAME);

	var sets = {CPID : CPID, ORDERNO : ORDERNO, PRODUCTTYPE : "2", BILLTYPE : "1", AMOUNT:AMOUNT, PRODUCTNAME:enPdnm.PRODUCTNAME,CLOSEURL : "http://cidermics.com/finbook_pur",FAILURL : "http://cidermics.com/finbook_pur", HOMEURL : "http://cidermics.com/finbook_ch",
		EMAIL : EMAIL, USERID : USERID, USERNAME : enUsernm.USERNAME,
		PRODUCTCODE : PRODUCTCODE, RESERVEDINDEX1:RESERVEDINDEX1, RESERVEDINDEX2 : RESERVEDINDEX2, RESERVEDSTRING : RESERVEDSTRING, 
		DIRECTRESULTFLAG : DIRECTRESULTFLAG, MOBILECOMPANYLIST:MOBILECOMPANYLIST, date:date};
	mysql.insert('insert into cider.mobileOrder set ?', sets, function (err, data){
		if(err){
			res.redirect('back');
		}
	//res.redirect('/mobileOrder');
	res.render('front/etc/finbook/finbook_success',{});
  });
});


router.get('/finbook_done', function(req,res,next){
	res.render('front/etc/finbook/finbook_done',{});
});




// 포도 재무설계 페이지
router.get('/podo', function(req,res,next){
	res.render('front/etc/podo/podo',{});
});

router.get('/podo_alliance', function(req,res,next){
	var pdnm = req.query.podoname;

	sql = 'SELECT * from cider.podoalliance where podoname like \'%'+pdnm+'%\' order by podono desc';
    mysql.select(sql, function(err, data) {
        if (err) throw err;
        console.log(data);
	res.render('front/etc/podo/podo_alliance',{data:data});
	});
});

router.get('/podo_apply', function(req,res,next){
	res.render('front/etc/podo/podo_apply',{});
});

//포도 재무신청 (우리 재무폼 그대로 가져옴. + 라디오 버튼 추가)
router.post('/podo_apply/insert', function(req, res, next) {
	var pd_no = req.body.fi_app_no;
	var pd_cate = req.body.fi_app_cate;
	var pd_name = req.body.fi_app_name;
	var phone1 = req.body.fi_app_phone1;
	var phone2 = req.body.fi_app_phone2;
	var phone3 = req.body.fi_app_phone3;
	var email1 = req.body.fi_app_email1;
	var email2 = req.body.fi_app_email2;
	var pd_job = req.body.fi_app_job;
	var pd_path = req.body.fi_app_path;
	var pd_comment = req.body.fi_app_comment;
	var pd_age = req.body.fi_app_age;
	var pd_place = req.body.fi_app_place;
	var pd_whatuwnt = req.body.whatuwnt;
	
	var pd_email = email1 + "@" + email2;
	var pd_phone = phone1 + "-" + phone2 + "-" + phone3;
	
	var pd_sex = req.body.mem_sex;
	
	var date = getWorldTime(+9);

	var pd_cate= rdate();
	
	var row;
	var sets = {pd_cate : pd_cate, pd_name : pd_name, pd_phone : pd_phone, pd_email : pd_email, pd_sex:pd_sex, pd_job : pd_job, pd_path : pd_path, pd_whatuwnt:pd_whatuwnt, pd_comment : pd_comment, pd_regDate : date, pd_age:pd_age, pd_place:pd_place};
	
	mysql.insert('insert into cider.podo_apply set ?', sets, function (err, data){
		if(err){
			res.redirect('back');
		}
		//2016년 12월 16일 수정 사항(재무 테스트용)=====
		 setTimeout(function() {
         }, 3000);
		 //=============================================
		mysql.select('select * from cider.podo_apply where pd_phone ="'+pd_phone+'" and pd_name = "'+pd_name+'"', function (err, data2){
		//res.redirect('/lecture/done');
		res.render('front/etc/podo/podo_done', {row : data2});
		});
	 });
});

module.exports = router;