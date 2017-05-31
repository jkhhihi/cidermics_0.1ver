var express = require('express');
var router = express.Router();
var mysql = require("./model/mysql");

var pool = require("./model/mysql");


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

router.get('/ftest', function(req, res, next) {
	var consult_name = req.body.consult_name;
	var row;
	var CP = 1;
	mysql.select('select * from cider.cid_finance', function (err, data){
		//res.render('front/cid_finance/cid_finance', {contents : data});	    	
	//});});

	res.render('front/cid_finance/cid_finance_test', {row : data});
	});
});

router.post('/ftest', function(req, res, next) {
	var consult_name = req.body.consult_name;
	var consult_test = req.body.consult_test;
	var coup_code = req.body.coup_code;
	var row;
	//var consult_no = req.body.consult_no;
	//var no = consult_no + 1;
	console.log(consult_name);
	
	var sets = {consult_name : consult_name, consult_test : consult_test};
	
	//mysql.select('select * from cider.cid_coupon where coup_code = '+coup_code+'', function (err, data){
	pool.insert('INSERT INTO cider.cid_finance (consult_name) VALUES (?)',sets, function (err, data){
		if(err){
			res.redirect('back');
		} 
		res.render('front/cid_finance/cid_finance_test', {row : data});
	 });
	});


router.get('/ftest/checkcode', function(req, res, next) {

	var coup_code = req.body.coup_code;
	
	console.log(coup_code);
});

router.get('/finance/profile', function(req, res, next) {
	var finance;
	var fi_app_cate= rdate();
	mysql.select("SELECT COUNT(*) AS appno FROM cider.cid_fi_applyform where fi_app_cate="+fi_app_cate+";", function (err, data){
		
	res.render('front/cid_finance/cid_finance_profile', {finance : data});
	});
});

router.get('/finance/done', function(req, res, next) {

	res.render('front/cid_finance/cid_finance_done', { });

});

router.get('/finance', function(req, res, next) {
	var finance;
	var fi_app_cate= rdate();
	mysql.select("SELECT COUNT(*) AS appno FROM cider.cid_fi_applyform where fi_app_cate="+fi_app_cate+";", function (err, data){
		
	res.render('front/cid_finance/cid_finance', {finance : data});
	});
});


router.get('/finance/apply', function(req, res, next) {

	res.render('front/cid_finance/cid_finance_apply', { });

});

router.get('/finance/contents', function(req, res, next) {
	var finance;
	var no = req.params.no;
	
	var now = new Date();
	 var _year=  now.getFullYear();
   var _mon =   now.getMonth()+1;
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
	 
	var _tot=_year+""+_mon+""+_date+""+_hor+""+ _min;
	
	var sets = {con_category : no, con_release : _tot};
	var row;


	var fi_app_cate= rdate();
	
	qry="select con_no, con_photo, con_title from cider.cid_contents where con_category = '2' and con_release <= '"+_tot+"' order by con_no desc limit 0,12";
	mysql.select(qry,
			 function (err, data){	 
				if (err) throw err;
		 
		 row = data;
		 
			mysql.select("SELECT COUNT(*) AS appno FROM cider.cid_fi_applyform where fi_app_cate="+fi_app_cate+";", function (err, data){
				
			

		 res.render('front/cid_finance/cid_finance_contents', { contents : row, finance:data});
			});
	});
});




router.post('/finance/apply/insert', function(req, res, next) {
	var fi_app_no = req.body.fi_app_no;
	var fi_app_cate = req.body.fi_app_cate;
	var fi_app_name = req.body.fi_app_name;
	var phone1 = req.body.fi_app_phone1;
	var phone2 = req.body.fi_app_phone2;
	var phone3 = req.body.fi_app_phone3;
	var email1 = req.body.fi_app_email1;
	var email2 = req.body.fi_app_email2;
	var fi_app_job = req.body.fi_app_job;
	var fi_app_path = req.body.fi_app_path;
	var fi_app_comment = req.body.fi_app_comment;
	var fi_app_age = req.body.fi_app_age;
	var fi_app_place = req.body.fi_app_place
	
	var fi_app_email = email1 + "@" + email2;
	var fi_app_phone = phone1 + "-" + phone2 + "-" + phone3;
	
	var date = getWorldTime(+9);

	var fi_app_cate= rdate();
	
	var row;
	var sets = {fi_app_cate : fi_app_cate, fi_app_name : fi_app_name, fi_app_phone : fi_app_phone, fi_app_email : fi_app_email, fi_app_job : fi_app_job, fi_app_path : fi_app_path, fi_app_comment : fi_app_comment, fi_app_regDate : date, fi_app_upDate : date, fi_app_age:fi_app_age, fi_app_place:fi_app_place};
	
	pool.insert('insert into cider.cid_fi_applyform set ?', sets, function (err, data){
		if(err){
			res.redirect('back');
		}
		//2016년 12월 16일 수정 사항(재무 테스트용)=====
		 setTimeout(function() {
         }, 3000);
		 //=============================================
		mysql.select('select * from cider.cid_fi_applyform where fi_app_phone ="'+fi_app_phone+'" and fi_app_name = "'+fi_app_name+'"', function (err, data2){
		//res.redirect('/lecture/done');
		res.render('front/cid_finance/cid_finance_done', {row : data2});
		});
	 });
});



router.get('/addMore2/:idx/:p', function(req, res, next) {
   
   var idx = req.params.idx;
   var p=req.params.p;
   var now = new Date();
    var _year=  now.getFullYear();
     var _mon =   now.getMonth()+1;
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
     var _hor = now.getHours ();
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
    
    var _tot=_year+""+_mon+""+_date+""+_hor+""+ _min;
   console.log(idx+"=================");
   var lang = req.params.lang;
   var start = (idx - 1) * 12;
   //var start= start +1;
   //var end = idx * 12;
   var end = 12;
   var qry='';
   console.log(start, end);
   //mysql.select('select con_no, con_photo, con_title  from cider.cid_contents where con_category = "'+ idx +'" order by con_no desc limit '+ start +', '+ end +'', function (err, data){
      //mysql.select('select con_no, con_photo, con_title  from cider.cid_contents  order by con_no desc limit '+ start +', '+ end +'', function (err, data){
       //if(p==null)
      // {
      //   qry='select con_no, con_photo, con_title  from cider.cid_contents  order by con_no desc limit '+ start +', '+ end +'';
      // } else {
         qry="select con_no, con_photo, con_title  from cider.cid_contents where con_release <= '"+_tot+"' and con_category = "+ p +" order by con_no desc limit "+ start +", "+ end +"";
      // }
       //mysql.select('select con_no, con_photo, con_title  from cider.cid_contents where con_category = "'+ p +'" order by con_no desc limit '+ start +', '+ end +'', function (err, data){
   console.log(qry);
   
   mysql.select(qry, function (err, data){
       if (err) throw err;
       console.log('select con_no, con_photo, con_title  from cider.cid_contents  order by con_no desc limit '+ start +', '+ end +'');
       res.send({ contents : data });
   });
   
   
});


router.get('/finance/review', function(req, res, next) {

	var finance;
	var rev;
	var fi_app_cate = rdate();
	var rd = fi_app_cate[2]+fi_app_cate[3]+fi_app_cate[4]+fi_app_cate[5]-2;
	console.log(rd);
	mysql.select("SELECT COUNT(*) AS appno FROM cider.cid_fi_applyform where fi_app_cate="+fi_app_cate+";", function (err, data){
		
		mysql.select('SELECT * FROM cider.cid_fi_review order by rev_no desc;', function (err, data2){

			mysql.select('SELECT rev_title FROM cider.cid_fi_review where rev_intDate = '+rd+' order by rev_no desc;', function (err, data3){
		
	res.render('front/cid_finance/cid_finance_review', {finance : data, rev:data2, rev2:data3});
	});
   });
 });
});

router.get('/reviewDate/:rd', function(req, res, next) {

	var rd = req.params.rd;
	console.log(rd);
	mysql.select('SELECT * FROM cider.cid_fi_review where rev_intDate = '+rd+' order by rev_no desc;', function (err, data){
	res.send({ rd : data });
	});
});


router.get('/finance/process', function(req, res, next) {

	var finance;

	var fi_app_cate= rdate();

	mysql.select("SELECT COUNT(*) AS appno FROM cider.cid_fi_applyform where fi_app_cate="+fi_app_cate+";", function (err, data){
		
	res.render('front/cid_finance/cid_finance_process', {finance : data});
	});
});

router.get('/finance/necessary', function(req, res, next) {

	var finance;

	var fi_app_cate= rdate();

	mysql.select("SELECT COUNT(*) AS appno FROM cider.cid_fi_applyform where fi_app_cate="+fi_app_cate+";", function (err, data){
		
	res.render('front/cid_finance/cid_finance_necessary', {finance : data});
	});
});

router.get('/finance/menu', function(req, res, next) {

	var finance;

	var fi_app_cate= rdate();

	mysql.select("SELECT COUNT(*) AS appno FROM cider.cid_fi_applyform where fi_app_cate="+fi_app_cate+";", function (err, data){
		
	res.render('front/cid_finance/cid_finance_menu', {finance : data});
	});
});


module.exports = router;
