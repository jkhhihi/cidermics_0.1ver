var express = require('express');
var router = express.Router();
var mysql = require(".././model/mysql");

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



router.get('/v2main', function(req,res,next){
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
	res.render('front/cid2_main/main', { contents : row});
	});
});



module.exports = router;