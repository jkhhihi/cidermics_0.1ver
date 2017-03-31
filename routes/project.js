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




router.get('/project', function(req, res, next) {

	var project;
	var _tot = releaseTime();

	mysql.select("select con_no, con_photo, con_title from cider.cid_contents where con_category = '5' and con_release <= '"+_tot+"' order by con_no desc", function (err, data){
	if(err){ res.redirect('back'); }
	//console.log(data);
	project = data;

	 res.render('front/cid_project/cid_project', {project:project});
  });
});


router.get('/project/in', function(req, res, next) {

		 res.render('front/cid_project/cid_project_in', { });
	});

router.get('/project/detail', function(req, res, next) {

		 res.render('front/cid_project/cid_project_detail', { });
	});

module.exports = router;
