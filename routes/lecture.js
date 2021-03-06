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


/*핀북 스터디1:'내 월급으로 집 사기'프로젝트*/
router.get('/lecture/detail/5', function(req, res, next) {
	res.render('front/cid_lecture2/cid_lecture_detail_5', { });
});

/*핀북 세미나2*/
router.get('/lecture/detail/7', function(req, res, next) {
	res.render('front/cid_lecture2/cid_lecture_detail_7', { });
});


/*누보리치 세미나*/
router.get('/lecture/detail/6', function(req, res, next) {
	res.render('front/cid_lecture2/cid_lecture_detail_6', { });
});


/*경이로움 세미나 */
router.get('/seminar', function(req, res, next) {
	mysql.select('select * from cider.cid_semilist where flag="Y" order by sdate desc;', function (err, data){
	res.render('front/cid_seminar/seminar', {semi:data});
  });
});

router.get('/seminar/detail/:idx', function(req, res, next) {
	var idx = req.params.idx;
	mysql.select('SELECT * from cider.cid_semilist where idx = '+idx+';', function (err, data){
	res.render('front/cid_seminar/seminar_detail', {semi:data});
  });
});


/*세미나 문의 */

router.post('/seminar/ask', function(req, res, next) {
	var scate = req.body.stda_cate;
	var cate = "4";
	var name = req.body.stda_name;
	var email = req.body.stda_email;
	var title = req.body.stda_title;
	var text = req.body.stda_textarea;

	var date = getWorldTime(+9);

	var sets = {cate:cate,stda_cate: scate , stda_name : name , stda_email : email , stda_title:title, stda_text:text, stda_regdate:date};
	mysql.insert('insert into cider.std_ask set ?', sets,  function (err, data){
		res.send('<script>alert("문의주셔서 감사합니다!");location.href="/study";</script>');
		//res.redirect('/study');
	});
});


router.get('/seminar/map', function(req, res, next) {
	res.render('front/cid_seminar/seminarmap', {});
  });

router.get('/seminar/map2', function(req, res, next) {
	res.render('front/cid_seminar/seminarmap2', {});
 });


router.get('/seminar/s', function(req, res, next) {

	res.render('front/cid_survey/cid_seminar_s', { });

});


router.post('/seminar/s', function(req, res, next) {

	var group1 = req.body.group1; //만족도 
	var group2 = req.body.group2; //평점
	var group8 = req.body.group8; //평점


	var g1 = req.body.g1; //재무상담년월
	var g2 = req.body.g2; //멘토 성함

	var g3 = req.body.g3; //만족 이유
	var g4 = req.body.g4; //상담태도
	var g5 = req.body.g5; //니즈
	var g6 = req.body.g6; //하고싶은말

	var etc8 = req.body.etc8;

	var date = getWorldTime(+9);


	var name = req.body.name;
console.log(name);
	if(name == ''){
		name = '무기명';
	}
console.log(name);

	//var sets = {sry_cate:1,sry_group2:g2};

	//mysql.insert('insert into cider.cid_survey (sry_group3) values('+g3+')', function (err, data){

	var sets = {sry_cate: 6 , sry_name : name , sry_etc1 : g1, sry_etc2 : g2, sry_group1 : group1, sry_group2 : group2,sry_group8 : group8,sry_etc8:etc8, sry_etc3 : g3, sry_etc4 : g4, sry_etc5 : g5, sry_group13 : g6,  date:date};
	mysql.insert('insert into cider.cid_survey set ?', sets,  function (err, data){
		res.redirect('/');
		//res.send('<script>alert("참여해주셔서 감사합니다");location.href="/";</script>');
	});
});


module.exports = router;
