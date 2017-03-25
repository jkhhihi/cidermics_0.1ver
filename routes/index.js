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




router.get('/', function(req, res, next) {
	var row;

	var _tot = releaseTime();

	 
	 qry="select con_no, con_photo, con_title, if (a.con_upDate > DATE_ADD(now(),INTERVAL -1 DAY) ,'/page_imgs/main_img/new_mark4.svg','/page_imgs/main_img/new_mark1px.png') as chkDat from cider.cid_contents a where a.con_release <= '"+_tot+"' order by a.con_no desc limit 0,12";
	mysql.select(qry, function (err, data){
		if (err) throw err;
		 row = data;
	res.render('front/cid_main', { contents : row});
  });
	 
});

router.get('/main2', function(req, res, next) {
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

	var qry="select con_no, con_photo, con_title, if (a.con_upDate > DATE_ADD(now(),INTERVAL -1 DAY) ,'/page_imgs/main_img/new_mark4.svg','/page_imgs/main_img/new_mark1px.png') as chkDat from cider.cid_contents a where a.con_release <= '"+_tot+"' order by a.con_no desc limit 0,4";
	mysql.select(qry, function (err, data){
		if (err) throw err;
		 row = data;

		mysql.select("SELECT con_no, con_photo, con_title FROM cider.cid_contents where con_release between "+_totmon+"010000 and "+_tot+" order by con_viewCount desc limit 0,4;", function (err, data){
		  if (err) throw err;
			popular = data;

			mysql.select("select con_no, con_photo, con_title from cider.cid_contents where con_category = '6' and con_release <= '"+_tot+"' order by con_no desc limit 0,4", function (err, data){
				if(err){ res.redirect('back'); }

				podcast = data;

				mysql.select("select con_no, con_photo, con_title from cider.cid_contents where con_category = '5' and con_release <= '"+_tot+"' order by con_no desc limit 0,4", function (err, data){
				if(err){ res.redirect('back'); }

				project = data;

					mysql.select('SELECT rev_title,rev_QA1 FROM cider.cid_fi_review order by rev_no desc limit 1,3;', function (err, data2){


						mysql.select("select con_no, con_photo, con_title from cider.cid_contents where con_category = '4' and con_release <= '"+_tot+"' order by con_no desc limit 0,2", function (err, data){
							if(err){ res.redirect('back'); }
							stock = data;
							
							mysql.select("select con_no, con_photo, con_title from cider.cid_contents where con_category = '3' and con_release <= '"+_tot+"' order by con_no desc limit 0,2", function (err, data){
							if(err){ res.redirect('back'); }
							company = data;
								mysql.select("select con_no, con_photo, con_title from cider.cid_contents where con_category = '2' and con_release <= '"+_tot+"' order by con_no desc limit 0,2", function (err, data){
								if(err){ res.redirect('back'); }
								finance = data;
									mysql.select("select con_no, con_photo, con_title from cider.cid_contents where con_category = '1' and con_release <= '"+_tot+"' order by con_no desc limit 0,2", function (err, data){
									if(err){ res.redirect('back'); }
									economics = data;
										mysql.select("select dis_no,dis_title,dis_thum from cider.cid_dis_reg where dis_release <= '"+_tot+"' order by dis_no desc limit 0,2", function(err,data){
											discuss = data;


	    		res.render('front/cid_main_temp', { contents : row, popular: popular,podcast:podcast,project:project,rev:data2,stock:stock,company:company,finance:finance,economics:economics,discuss:discuss});

	      });
	 	 });
		});
	   });
	  });
	 });
	});
   });
  });
 });
});


router.post('/selectDate', function(req, res, next) {
	var sd = req.body.startDate;
   var qry="";
   //where con_regDate like \'%"+x+"\'
    qry="select con_no, con_photo, con_title from cider.cid_contents where con_regDate like \'%"+sd+"%\' order by con_no desc";
   mysql.select(qry, function (err, data){

       if (err) throw err;
       res.render('front/cid_main', { contents : data});
   });
});


router.get('/complete', function(req, res, next) {

	res.render('front/complete', { });

});

router.get('/modal', function(req, res, next) {

	res.render('front/modal', { });

});

router.get('/appdown', function(req, res, next) {

	res.render('front/cid_appdown', { });

});




/*인서트 테스트 코드*/
router.get('/test', function(req, res, next) {
	var row;
	var year = req.body.year;
	var _tot = releaseTime();
	 
	 qry="select con_no, con_photo, con_title, if (a.con_upDate > DATE_ADD(now(),INTERVAL -1 DAY) ,'/page_imgs/main_img/new_mark4.svg','/page_imgs/main_img/new_mark1px.png') as chkDat from cider.cid_contents a where a.con_release <= '"+_tot+"' order by a.con_no desc limit 0,4";
	mysql.select(qry, function (err, data){
		if (err) throw err;
		 row = data;
	res.render('front/cid_quiz/test', { contents : row});
});
	 
});
router.post('/insert', function(req, res, next) {
	
	var in1 = req.body.in1;
	
	var sets = {quiz_options : in1 };
	
	mysql.insert('insert into cider.cid_quiz set ?', sets,  function (err, data){
		
    	res.redirect('/test');
    });
});


router.post('/test2', function(req, res, next) {
	var ds = req.body.dateSelect;
	console.log(ds);
   var qry="";
   //where con_regDate like \'%"+x+"\'
    qry="select con_no, con_photo, con_title from cider.cid_contents where con_regDate like \'%"+ds+"%\' order by con_no desc limit 0,2";
   mysql.select(qry, function (err, data){

       if (err) throw err;
       res.render('front/cid_quiz/test', { contents : data});
   });
});


module.exports = router;