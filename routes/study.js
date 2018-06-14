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
	var stdlist;
	mysql.select('SELECT idx,subject,subject2,decate,recentdate,thum,leader,sche1 from cider.std_more where flag="Y" order by idx desc;', function (err, data){
		stdlist = data;
	res.render('front/cid_study/std_idx', {stdlist : data});
	});
});
router.get('/studym', function(req, res, next) {
	var stdlist;
	mysql.select('SELECT idx,subject,subject2,decate,recentdate,thum,leader,sche1 from cider.std_more where flag="Y" order by idx desc;', function (err, data){
		stdlist = data;
	res.render('front/cid_study/std_idx_2', {stdlist : data});
	});
});

router.get('/study/intro', function(req, res, next) {
	res.render('front/cid_study/std_intro', { });
});

router.get('/study/memship', function(req, res, next) {
	res.render('front/cid_study/std_memship', { });
});

router.get('/study/process', function(req, res, next) {
	res.render('front/cid_study/std_process', { });
});


router.get('/study/list', function(req, res, next) {
	var stdlist;
	mysql.select('SELECT idx,subject,subject2,decate,recentdate,thum,leader,sche1,state from cider.std_more where flag="Y" order by idx desc;', function (err, data){
		stdlist = data;
	res.render('front/cid_study/std_list', {stdlist : data});
  });
});

router.get('/studymore/:idx', function(req, res, next) {
	var idx = req.params.idx;
	var stdlist;
	mysql.select('SELECT * from cider.std_more where idx = '+idx+';', function (err, data){
		mysql.select('SELECT idx,subject,subject2,decate,recentdate,thum,leader,sche1 from cider.std_more where flag="Y" order by idx desc;', function (err, data1){
	res.render('front/cid_study/std_more', {md:data, stdlist : data1});
  	});
  });
});

router.get('/studymore1/:idx', function(req, res, next) {
	var idx = req.params.idx;
	var stdlist;
	mysql.select('SELECT idx,cate,subject,bgimg1,thum2,leader,period,sche1,sche2,sche3,location,people,price,img1,img2,img3,state from cider.std_more where idx = '+idx+';', function (err, data){
		mysql.select('SELECT idx,subject,subject2,decate,recentdate,thum,leader,sche1 from cider.std_more where flag="Y" order by idx desc;', function (err, data1){
	res.render('front/cid_study/std_more1', {md:data, stdlist : data1});
  	});
  });
});

router.get('/studymore2/13', function(req, res, next) {
	var idx = req.params.idx;
	var stdlist;
	mysql.select('SELECT idx,cate,subject,bgimg1,thum2,leader,period,sche1,sche2,sche3,location,people,price,img1,img2,img3,state from cider.std_more where idx = "13";', function (err, data){
		mysql.select('SELECT idx,subject,subject2,decate,recentdate,thum,leader,sche1 from cider.std_more where flag="Y" order by idx desc;', function (err, data1){
	res.render('front/cid_study/std_more2', {md:data, stdlist : data1});
  	});
  });
});

router.get('/studymorenew/:idx', function(req, res, next) {
	var idx = req.params.idx;
	var stdlist;
	mysql.select('SELECT idx,cate,subject,bgimg1,thum2,leader,period,sche1,sche2,sche3,location,people,price,img1,img2,img3,state from cider.std_more where idx = '+idx+';', function (err, data){
		mysql.select('SELECT idx,subject,subject2,decate,recentdate,thum,leader,sche1 from cider.std_more where flag="Y" order by idx desc;', function (err, data1){
	res.render('front/cid_study/std_more_new', {md:data, stdlist : data1});
  	});
  });
});

router.get('/study/cal', function(req, res, next) {
	res.render('front/cid_study/std_cal', { });
});

router.get('/study/faq', function(req, res, next) {
	res.render('front/cid_study/std_faq', { });
});

router.post('/study/ask', function(req, res, next) {
	var cate = "2";
	var scate = req.body.stda_cate;
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


router.get('/study/top', function(req, res, next) {
	res.render('front/cid_study/std_top', { });
});

router.get('/study/bottom', function(req, res, next) {
	res.render('front/cid_study/std_bottom', { });
});

router.get('/study/event', function(req, res, next) {
	res.render('front/cid_study/std_event', { });
});
router.get('/study/map', function(req, res, next) {
	res.render('front/cid_study/std_map', { });
});

router.get('/study/disc', function(req, res, next) {
	var stdlist;
	mysql.select('SELECT idx,subject,subject2,decate,recentdate,thum,leader,sche1,cate from cider.std_more where flag="Y" order by idx desc;', function (err, data){
		stdlist = data;
	res.render('front/cid_study/std_disc', {stdlist : data});
  });
});

router.get('/study/review', function(req, res, next) {
	var review;
	mysql.select('SELECT cons_no,cons_name,cons_img,cons_title from cider.cid_consulting order by cons_no desc;', function (err, data){
		review = data;
	res.render('front/cid_study/std_review', {review : data});
  });
});

router.get('/stdreview/:cons_no', function(req, res, next) {
	var idx = req.params.cons_no;
	var stdreview;
		mysql.select('SELECT * from cider.cid_consulting where cons_no='+idx+' order by cons_no desc;', function (err, data){
	res.render('front/cid_study/std_review_detail', { stdreview : data});
  	});
  });
module.exports = router;
