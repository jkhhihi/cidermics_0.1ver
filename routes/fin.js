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



router.get('/fin', function(req, res, next) {

	res.render('front/cid_fin/fin_idx', { });

});

router.get('/fin/review', function(req, res, next) {

	mysql.select('SELECT * from cider.cid_survey where sry_cate ="5" order by sry_no desc limit 0,5;', function (err, data){
		mysql.select('SELECT * from cider.cid_survey where sry_cate ="5" order by sry_no desc;', function (err, data2){
	res.render('front/cid_fin/fin_review', {slist : data, slist2:data2}); 
	});
  });
});

module.exports = router;
