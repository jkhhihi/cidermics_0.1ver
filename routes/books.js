var express = require('express');
var router = express.Router();
var mysql = require("./model/mysql");


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




router.get('/books', function(req, res, next) {

		 res.render('front/cid_books/cid_books', { });
	});

module.exports = router;
