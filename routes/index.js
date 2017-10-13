var express = require('express');
var router = express.Router();
var mysql = require("./model/mysql");

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
										mysql.select("select dis_no,dis_title,dis_thum from cider.cid_dis_reg where dis_release <= '"+_tot+"' order by dis_no desc limit 0,2", function(err,data){
											discuss = data;
											//mysql.select("select dis_no,dis_title,dis_thum from cider.cid_dis_reg where dis_release <= '"+_tot+"' order by dis_no desc limit 0,2", function(err,data){

												//mysql.select("select count(*) from cider.cid_dis_comt where dis_no = '2'", function(err,data){
													mysql.select("select r.dis_no as rno , c.dis_no as cno from cider.cid_dis_reg as r left join cider.cid_dis_comt as c on r.dis_no = c.dis_no", function(err,data){
														discussCnt = data;


		    		res.render('front/cid_main2', { contents : row, popular: popular,books:books,podcast:podcast,project:project,rev:data2,stock:stock,company:company,finance:finance,economics:economics,discuss:discuss,discussCnt:discussCnt,stock1:stock1});
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
});
});
router.get('/3', function(req, res, next) {
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
	var qry="select con_no, con_photo, con_title, if (a.con_upDate > DATE_ADD(now(),INTERVAL -5 DAY) ,'/page_imgs/main_img/new_mark4.svg','/page_imgs/main_img/new_mark1px.png') as chkDat from cider.cid_contents a where a.con_release <= '"+_tot+"' order by a.con_release desc limit 0,6";
	mysql.select(qry, function (err, data){
		if (err) throw err;
		 row = data;
		 mysql.select("select con_no, con_photo, con_title from cider.cid_contents where con_category = '4' and con_release <= '"+_tot+"' order by con_no desc limit 0,3", function (err, data){
		 //mysql.select('SELECT * from cider.cid_contents where con_pop = 1 order by con_release desc limit 0,6;', function (err, data){
		 //mysql.select("SELECT * FROM cider.cid_contents where con_release between "+_totmon+"010000 and "+_tot+" order by con_viewCount desc limit 0,16;", function (err, data){
		//mysql.select("SELECT con_no, con_photo, con_title FROM cider.cid_contents where con_release between "+_totmon+"010000 and "+_tot+" order by con_viewCount desc limit 0,6;", function (err, data){ 
		  if (err) throw err;
			popular = data;

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
										mysql.select("select dis_no,dis_title,dis_thum from cider.cid_dis_reg where dis_release <= '"+_tot+"' order by dis_no desc limit 0,2", function(err,data){
											discuss = data;
											//mysql.select("select dis_no,dis_title,dis_thum from cider.cid_dis_reg where dis_release <= '"+_tot+"' order by dis_no desc limit 0,2", function(err,data){

												//mysql.select("select count(*) from cider.cid_dis_comt where dis_no = '2'", function(err,data){
													mysql.select("select r.dis_no as rno , c.dis_no as cno from cider.cid_dis_reg as r left join cider.cid_dis_comt as c on r.dis_no = c.dis_no", function(err,data){
														discussCnt = data;


		    		res.render('front/cid_main3', { contents : row, popular: popular,books:books,podcast:podcast,project:project,rev:data2,stock:stock,company:company,finance:finance,economics:economics,discuss:discuss,discussCnt:discussCnt});
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
router.post('/insert', function(req, res, next) {
	
	var in1 = req.body.in1;
	
	var sets = {quiz_options : in1 };
	
	mysql.insert('insert into cider.cid_quiz set ?', sets,  function (err, data){
		
    	res.redirect('/test');
    });
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


// 핀북 랜딩 페이지
router.get('/finbook', function(req,res,next){
	res.render('front/etc/finbook/finbook',{});
});

router.get('/finbook_pur', function(req,res,next){
	res.render('front/etc/finbook/finbook_purchase',{});
});

router.get('/finbook_ch', function(req,res,next){
	res.render('front/etc/finbook/finbook_ch_purchase',{});
});

//card결제
router.post('/cardOrder', function(req, res, next) {

//특정 아이피만 allow
var http = require('http');
http.createServer(function (req, res)
{
    var ip = req.ip || req.connection.remoteAddress || req.socket.remoteAddress || req.connection.socket.remoteAddress;
    if (ip == '27.102.213.200') // exit if it's a particular ip
        res.end();
});

	var CPID = req.body.CPID;
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
	var POPUPTYPE = req.body.POPUPTYPE;
	
	var sets = {CPID : CPID, ORDERNO : ORDERNO, PRODUCTTYPE : PRODUCTTYPE, BILLTYPE : BILLTYPE, AMOUNT:AMOUNT, CPQUOTA : CPQUOTA, EMAIL : EMAIL, USERID : USERID, USERNAME : USERNAME,
		PRODUCTCODE : PRODUCTCODE, PRODUCTNAME:PRODUCTNAME, RESERVEDINDEX1:RESERVEDINDEX1, RESERVEDINDEX2 : RESERVEDINDEX2, RESERVEDSTRING : RESERVEDSTRING, 
		CLOSEURL : CLOSEURL,FAILURL : FAILURL,APPURL : APPURL, HOMEURL : HOMEURL, DIRECTRESULTFLAG : DIRECTRESULTFLAG, CARDLIST : CARDLIST,HIDECARDLIST:HIDECARDLIST, TAXFREECD : TAXFREECD, POPUPTYPE : POPUPTYPE,
		};
	mysql.insert('insert into cider.cardOrder set ?', sets, function (err, data){
		if(err){
			res.redirect('back');
		}
	mysql.select('select * from cider.cardOrder where ORDERNO ="'+ORDERNO+'"', function (err, data2){
		console.log(data);
	res.render('front/etc/finbook/finbook_success',{data:data2});
	});
  });
});

//휴대폰 결제
router.post('/mobileOrder', function(req, res, next) {
//특정 아이피만 allow
var http = require('http');
http.createServer(function (req, res)
{
    var ip = req.ip || req.connection.remoteAddress || req.socket.remoteAddress || req.connection.socket.remoteAddress;
    if (ip == '27.102.213.200') // exit if it's a particular ip
        res.end();
});


	var CPID = req.body.CPID;
	var ORDERNO = req.body.ORDERNO;
	var PRODUCTTYPE = req.body.PRODUCTTYPE;
	var BILLTYPE = req.body.BILLTYPE;
	//var TAXFREECD = req.body.TAXFREECD; // 모바일은 db테이블에 없음.
	var AMOUNT = req.body.AMOUNT;
	var PRODUCTNAME = req.body.PRODUCTNAME;
	var HOMEURL = req.body.HOMEURL;
	var CLOSEURL = req.body.CLOSEURL;
	var FAILURL = req.body.FAILURL;
	//var APPURL = req.body.APPURL; // 모바일은 db테이블에 없음.

	//var CPQUOTA = req.body.CPQUOTA;
	var EMAIL = req.body.EMAIL;
	var USERID = req.body.USERID;
	var USERNAME = req.body.USERNAME;
	var PRODUCTCODE = req.body.PRODUCTCODE;
	var RESERVEDINDEX1 = req.body.RESERVEDINDEX1;
	var RESERVEDINDEX2 = req.body.RESERVEDINDEX2;
	var RESERVEDSTRING = req.body.RESERVEDSTRING;
	var DIRECTRESULTFLAG = req.body.DIRECTRESULTFLAG;

	var MOBILECOMPANYLIST = req.body.MOBILECOMPANYLIST;

	var sets = {CPID : CPID, ORDERNO : ORDERNO, PRODUCTTYPE : PRODUCTTYPE, BILLTYPE : BILLTYPE, AMOUNT:AMOUNT, PRODUCTNAME:PRODUCTNAME,CLOSEURL : CLOSEURL,FAILURL : FAILURL, HOMEURL : HOMEURL,
		EMAIL : EMAIL, USERID : USERID, USERNAME : USERNAME,
		PRODUCTCODE : PRODUCTCODE, RESERVEDINDEX1:RESERVEDINDEX1, RESERVEDINDEX2 : RESERVEDINDEX2, RESERVEDSTRING : RESERVEDSTRING, 
		DIRECTRESULTFLAG : DIRECTRESULTFLAG, MOBILECOMPANYLIST:MOBILECOMPANYLIST};
	mysql.insert('insert into cider.mobileOrder set ?', sets, function (err, data){
		if(err){
			res.redirect('back');
		}
	mysql.select('select * from cider.mobileOrder where ORDERNO ="'+ORDERNO+'"', function (err, data2){
	res.render('front/etc/finbook/finbook_success',{data:data2});
	});
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