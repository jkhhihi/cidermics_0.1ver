var express = require('express'), ipfilter = require('express-ipfilter').IpFilter;
var router = express.Router();
var mysql = require("./model/mysql");

var nodemailer = require('nodemailer');

var urlencode = require('urlencode');




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


router.get('/bobby', function(req, res, next) {
	res.render('front/bobby/b_main', { });
});

router.get('/bobby/pguide', function(req, res, next) {
	res.render('front/bobby/b_pguide', { });
});

router.get('/bobby/uguide', function(req, res, next) {
	res.render('front/bobby/b_uguide', { });
});

router.get('/bobby/conlist', function(req, res, next) {
	res.render('front/bobby/b_conlist', { });
});

router.get('/bobby/conde', function(req, res, next) {
	res.render('front/bobby/b_conde', { });
});

router.get('/bobby/top', function(req, res, next) {
	res.render('front/bobby/b_top', { });
});

router.get('/bobby/bottom', function(req, res, next) {
	res.render('front/bobby/b_bottom', { });
});

module.exports = router;