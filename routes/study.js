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


router.get('/study', function(req, res, next) {
	res.render('front/cid_study/std_idx', { });
});

router.get('/study/intro', function(req, res, next) {
	res.render('front/cid_study/std_intro', { });
});

router.get('/study/list', function(req, res, next) {
	res.render('front/cid_study/std_list', { });
});

router.get('/study/cal', function(req, res, next) {
	res.render('front/cid_study/std_cal', { });
});

router.get('/study/faq', function(req, res, next) {
	res.render('front/cid_study/std_faq', { });
});

router.post('/study/ask', function(req, res, next) {
	var cate = req.body.stda_cate;
	var name = req.body.stda_name;
	var email = req.body.stda_email;
	var title = req.body.stda_title;
	var text = req.body.stda_textarea;

	var date = getWorldTime(+9);

	var sets = {stda_cate: cate , stda_name : name , stda_email : email , stda_title:title, stda_text:text, stda_regdate:date};
	mysql.insert('insert into cider.std_ask set ?', sets,  function (err, data){
		res.send('<script>alert("문의주셔서 감사합니다!");location.href="/study";</script>');
		//res.redirect('/study');
	});
});


router.get('/study/top', function(req, res, next) {
	res.render('front/cid_study/std_top', { });
});

router.get('/study/bottom', function(req, res, next) {
	res.render('front/cid_study/std_bottom', { });
});


module.exports = router;
