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


//예전버젼 메인
router.get('/main_old', function(req, res, next) {
	var row;

	var _tot = releaseTime();

	 
	 qry="select con_no, con_photo, con_title, if (a.con_upDate > DATE_ADD(now(),INTERVAL -1 DAY) ,'/page_imgs/main_img/new_mark4.svg','/page_imgs/main_img/new_mark1px.png') as chkDat from cider.cid_contents a where a.con_release <= '"+_tot+"' order by a.con_no desc limit 0,12";
	mysql.select(qry, function (err, data){
		if (err) throw err;
		 row = data;
	res.render('front/cid_main', { contents : row});
  });
	 
});

router.get('/', function(req, res, next) {
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
	var qry="select con_no, con_photo, con_title, if (a.con_upDate > DATE_ADD(now(),INTERVAL -5 DAY) ,'/page_imgs/main_img/new_mark4.svg','/page_imgs/main_img/new_mark1px.png') as chkDat from cider.cid_contents a where a.con_release <= '"+_tot+"' order by a.con_release desc limit 0,5";
	mysql.select(qry, function (err, data){
		if (err) throw err;
		 row = data;
		 mysql.select('SELECT * from cider.cid_contents where con_pop = 1 order by con_release desc limit 0,6;', function (err, data){
		 //mysql.select("SELECT * FROM cider.cid_contents where con_release between "+_totmon+"010000 and "+_tot+" order by con_viewCount desc limit 0,16;", function (err, data){
		//mysql.select("SELECT con_no, con_photo, con_title FROM cider.cid_contents where con_release between "+_totmon+"010000 and "+_tot+" order by con_viewCount desc limit 0,6;", function (err, data){ 
		  if (err) throw err;
			popular = data;

		  mysql.select("select con_no, con_photo, con_title from cider.cid_contents where con_category = '7' and con_release <= '"+_tot+"' order by con_no desc limit 0,3", function (err, data){
			if(err){ res.redirect('back'); }

			books = data;

			mysql.select("select con_no, con_photo, con_title from cider.cid_contents where con_category = '6' and con_release <= '"+_tot+"' order by con_no desc limit 0,3", function (err, data){
				if(err){ res.redirect('back'); }

				podcast = data;

				mysql.select("select con_no, con_photo, con_title from cider.cid_contents where con_category = '5' and con_release <= '"+_tot+"' order by con_no desc limit 0,3", function (err, data){
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
											//mysql.select("select dis_no,dis_title,dis_thum from cider.cid_dis_reg where dis_release <= '"+_tot+"' order by dis_no desc limit 0,2", function(err,data){

												//mysql.select("select count(*) from cider.cid_dis_comt where dis_no = '2'", function(err,data){
													mysql.select("select r.dis_no as rno , c.dis_no as cno from cider.cid_dis_reg as r left join cider.cid_dis_comt as c on r.dis_no = c.dis_no", function(err,data){
														discussCnt = data;


		    		res.render('front/cid_main2', { contents : row, popular: popular,books:books,podcast:podcast,project:project,rev:data2,stock:stock,company:company,finance:finance,economics:economics,discuss:discuss,discussCnt:discussCnt});
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
 });
});

router.get('/maincon_include', function(req,res,next){
	var arr = []
	for(var i = 1; i < 7; i++){
	    arr[i] = function(id){
	    return function(){
	        return id;
	    }
	   }(i);
	}

	for(var index in arr) {
	var con_qry;
    con_qry = "select con_no, con_photo, con_title from cider.cid_contents where con_category = '"+arr[index]()+"' order by con_no desc limit 0,4";


    if(arr[index]() == 6 ){

    mysql.select(con_qry, function (err, data){
				if(err){ res.redirect('back'); }
				podcast = data;
				

		});
	   }
	else if(arr[index]() == 5){
		 mysql.select(con_qry, function (err, data){
				if(err){ res.redirect('back'); }
				project = data;

		});
	}
  }
	res.render('front/cid_maincon_include', {podcast:podcast});
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

router.get('/appdown1', function(req, res, next) {
	res.render('front/cid_appdown_gold', { });
});

router.get('/survey', function(req, res, next) {

	res.render('front/cid_survey', { });

});


router.post('/surveyGo', function(req, res, next) {

	var g1 = req.body.group1;
	var g2 = req.body.group2;
	var g3 = req.body.group3;
	var g4 = req.body.group4;
	var g5 = req.body.group5;
	var g6 = req.body.group6;


	var etc1 = req.body.etc1;
	var etc2 = req.body.etc2;
	var etc3 = req.body.etc3;
	var etc4 = req.body.etc4;
	var etc5 = req.body.etc5;

	var name = req.body.name;
	var phone = req.body.phone;

	//var sets = {sry_cate:1,sry_group2:g2};

	//mysql.insert('insert into cider.cid_survey (sry_group3) values('+g3+')', function (err, data){

	var sets = {sry_cate: 1 , sry_name : name , sry_phone : phone , sry_group1:g1,sry_group2:g2,sry_group3:g3,sry_group4:g4,sry_group5:g5,sry_group6:g6,sry_etc1:etc1,sry_etc2:etc2,sry_etc3:etc3,sry_etc4:etc4,sry_etc5:etc5};
	mysql.insert('insert into cider.cid_survey set ?', sets,  function (err, data){
		res.redirect('/');
		//res.send('<script>alert("참여해주셔서 감사합니다");location.href="/";</script>');
	});
});



router.get('/top', function(req, res, next) {

/*
	var sess = req.session;
	console.log(sess);
	var sePass = sess.passport;
	if(sePass != null){
		var proPhoto = sess.passport.user.photos[0].value;
		console.log(sess.passport.user.photos[0].value);
	}
	res.render('front/top', {proPhoto:proPhoto,sePass:sePass});
*/
		res.render('front/top', {proPhoto:proPhoto});

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


router.get('/topLogin', function(req, res, next) {

	var sePass = req.session.passport;
	if(sePass != null){
		var proPhoto ='';
		if(sePass.user.length == 1){
			proPhoto = sePass.user[0].mem_profile;
		}else{
			proPhoto = proPhoto = sePass.user.photos[0].value;
		}


		/*
		console.log(sess.passport.user.length);
		console.log(sess.passport.user.photos[0].value);
		if(sess.passport.user.photos[0].value != null){
			proPhoto = sess.passport.user.photos[0].value;
			console.log(proPhoto);
			console.log("ㅋㅋㅋ");
		}else{
			proPhoto = sess.passport.user[0].mem_no;
			console.log(proPhoto);
			console.log("ㄷㄷㄷ");
		}
		*/
	}
       res.render('front/topLogin', {proPhoto:proPhoto});
});

router.get('/facebooklogin', function(req,res,next){
	res.render('front/facebooklogin',{});
});


module.exports = router;