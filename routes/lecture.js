var express = require('express');
var router = express.Router();
var mysql = require("./model/mysql");

var pool = require("./model/mysql");

var cookieParser = require('cookie-parser');
var passport = require('passport');

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

router.get('/lecture', function(req, res, next) {
	
	var row;
	mysql.select('select con_no, con_photo, con_title from cider.cid_contents order by con_viewCount desc limit 0,4', function (err, data){
		 if (err) throw err;
		 row = data;
		 res.render('front/cid_lecture/cid_lecture', { contents : row});
	});

});


router.get('/lecture/apply', function(req, res, next) {
	var lec_price = 150000;

	console.log(lec_price);

	res.render('front/cid_lecture/cid_lecture_apply', {lec_price:lec_price });

});

router.post('/lecture/done/insert', function(req, res, next) {
	var app_no = req.body.app_no;
	var app_cate = req.body.app_cate;
	var app_name = req.body.app_name;
	var phone1 = req.body.app_phone1;
	var phone2 = req.body.app_phone2;
	var phone3 = req.body.app_phone3;
	var email1 = req.body.app_email1;
	var email2 = req.body.app_email2;
	var app_job = req.body.app_job;
	var app_path = req.body.app_path;
	var lec_price = req.body.lec_price;
	var app_comment = "";
	
	var app_email = email1 + "@" + email2;
	var app_phone = phone1 + "-" + phone2 + "-" + phone3;
	
	var date = getWorldTime(+9);
	
	var row;
	var sets = {app_cate : 1, app_name : app_name, app_price : lec_price, app_phone : app_phone, app_email : app_email, app_job : app_job, app_path : app_path, app_process : "입금대기",app_comment : app_comment, app_regDate : date, app_upDate : date,};
	
	pool.insert('insert into cider.cid_applyform set ?', sets, function (err, data){
		if(err){
			res.redirect('back');
		}
		mysql.select('select * from cider.cid_applyform where app_phone ="'+app_phone+'" and app_name = "'+app_name+'"', function (err, data2){

		//res.redirect('/lecture/done');
		res.render('front/cid_lecture/cid_lecture_done', {row : data2});
		});
	 });
});

router.post('/lecture/apply/codeapply', function(req, res, next) {
	var coup_code = req.body.coup_code;
	var lec_price = req.body.lec_price;
	

	
	if(coup_code == "CKEH01" || coup_code == "CJSM02" || coup_code == "CJKH03" || coup_code == "CYHA04" ){
		console.log("ok");
		lec_price = lec_price - 30000;
		res.render('front/cid_lecture/cid_lecture_apply', {lec_price:lec_price });
	}else {
		console.log("No");
		res.send('<script>alert("쿠폰번호를 확인해주세요.");location.href="/lecture/apply";</script>');
		//res.redirect('/lecture/apply');
	}
});


router.get('/lecture/cancel', function(req, res, next) {
	
	console.log(req.cookies);
	if(req.cookies.auth){
		res.redirect('/lecture/candone');
	}else{
		//res.redirect('/adm')
		//res.send('<script>alert("신청 정보를 확인해주세요.");location.href="/lecture/cancel";</script>');
		res.render('front/cid_lecture/cid_lecture_cancel', { });
	}
});

router.post('/lecture/cancel/process', passport.authenticate('applycancel', { failureRedirect: '/lecture/cancel', failureFlash: true }), function(req, res, next) {
	var app_no = req.body.app_no;
	var app_name = req.body.app_name;
	var app_comment = req.body.app_comment;

	var app_process;
	
	var date = getWorldTime(+9);
	
	mysql.select('select * from cider.cid_applyform where app_no ="'+app_no+'" and app_name = "'+app_name+'"', function (err, data){

		var sets = {app_no : app_no, app_process : "취소요청" , app_comment:app_comment, app_upDate : date};
		
		mysql.update('update cider.cid_applyform set app_process = ?, app_comment= ?,  app_upDate = ? where app_no = ?', ["취소요청",app_comment,date,app_no], function (err, data){
		});
		res.render('front/cid_lecture/cid_lecture_candone', {row:data});
	});
});



router.get('/lecture/detail', function(req, res, next) {

	res.render('front/cid_lecture/cid_lecture_detail', { });
});

router.get('/lecture/sale', function(req, res, next) {

	res.render('front/cid_lecture/cid_lecture_sale', { });
});






/*ㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡ 세미나 ㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡ
 * 
 * 
 * 
 * 
 ㅡㅡㅡㅡㅡ*/



router.get('/lecture/detail/2', function(req, res, next) {
	
	var lecture;
	mysql.select('SELECT COUNT(*) AS appno FROM cider.cid_applyform where app_Date="18";', function (err, data){
		
		mysql.select('SELECT COUNT(*) AS appno FROM cider.cid_applyform where app_Date="19";', function (err, data2){

	res.render('front/cid_lecture2/cid_lecture_detail', { lecture : data, lecture2 : data2 });
		});
	});
});



router.get('/lecture/apply/2', function(req, res, next) {

	res.render('front/cid_lecture2/cid_lecture_apply', {});
});

router.post('/lecture/done/insert/2', function(req, res, next) {
	var app_no = req.body.app_no;
	var app_cate = req.body.app_cate;
	var app_name = req.body.app_name;
	var phone1 = req.body.app_phone1;
	var phone2 = req.body.app_phone2;
	var phone3 = req.body.app_phone3;
	var email1 = req.body.app_email1;
	var email2 = req.body.app_email2;
	var app_job = req.body.app_job;
	var app_path = req.body.app_path;
	var app_comment = "";
	var app_Date = req.body.app_Date;
	
	
	var app_email = email1 + "@" + email2;
	var app_phone = phone1 + "-" + phone2 + "-" + phone3;
	
	var date = getWorldTime(+9);
	
	var row;
	var sets = {app_cate : 2, app_name : app_name, app_phone : app_phone, app_email : app_email, app_job : app_job, app_path : app_path, app_process : "입금대기",app_comment : app_comment, app_regDate : date, app_upDate : date, app_Date : app_Date};
	
	pool.insert('insert into cider.cid_applyform set ?', sets, function (err, data){
		if(err){
			res.redirect('back');
		}
		mysql.select('select * from cider.cid_applyform where app_phone ="'+app_phone+'" and app_name = "'+app_name+'"', function (err, data2){
			console.log(data2);
		//res.redirect('/lecture/done');
		res.render('front/cid_lecture2/cid_lecture_done', {row : data2});
		});
	 });
});


/*역사학자 주경철 교수 강연  21세기 북스 */

router.get('/lecture/detail/3', function(req, res, next) {
	res.render('front/cid_lecture2/cid_lecture_detail_3', { });
});


router.post('/lecture/insert/3', function(req, res, next) {
	var app_cate = req.body.app_cate;
	var app_name = req.body.app_name;
	var phone1 = req.body.app_phone1;
	var phone2 = req.body.app_phone2;
	var phone3 = req.body.app_phone3;

	var app_phone = phone1 + "-" + phone2 + "-" + phone3;
	
	var date = getWorldTime(+9);
	
	var row;
	var sets = {app_cate : 3, app_name : app_name, app_phone : app_phone, app_regDate : date};
	
	pool.insert('insert into cider.cid_applyform set ?', sets, function (err, data){
		if(err){
			res.redirect('back');
		}
		mysql.select('select * from cider.cid_applyform where app_phone ="'+app_phone+'" and app_name = "'+app_name+'"', function (err, data2){
			console.log(data2);
		res.redirect('/lecture/detail/3');
		//res.render('front/cid_lecture2/cid_lecture_done', {row : data2});
		});
	 });
});


/* 삼박자 투자법 */
router.get('/lecture/detail/4', function(req, res, next) {
	res.render('front/cid_lecture2/cid_lecture_detail_4', { });
});


module.exports = router;
