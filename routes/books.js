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

	var books;
	var _tot = releaseTime();

	mysql.select("select con_no, con_photo, con_title from cider.cid_contents where con_category = '7' and con_release <= '"+_tot+"' order by con_no desc", function (err, data){
	if(err){ res.redirect('back'); }
	books = data;

		 res.render('front/cid_books/cid_books', { books:books });
	});
});

module.exports = router;
