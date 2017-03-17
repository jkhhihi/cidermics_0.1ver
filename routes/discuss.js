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

function releaseTime(){
	 var now = new Date();
	 var _year=  now.getFullYear();
	 var _mon =   now.getMonth()+1;
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
	 
	var _tot=_year+""+_mon+""+_date+""+_hor+""+ _min;

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

router.get('/discuss', function(req, res, next) {
	var row;
	var cate;

		mysql.select('select * from cider.cid_dis_reg', function (err, data2){

		row=data2;

		mysql.select('select * from cider.cid_dis_cate', function (err, data){
		if(err){
			res.redirect('back');
		}
		
		cate = data;

	res.render('front/cid_discuss/cid_discuss', {row : row, cate:cate});
	});
  });
});

router.post('/discuss/ask', function(req,res,next){
	var a_cate = req.body.a_cate;
	var a_writer = req.body.a_writer;
	var a_title = req.body.a_title;
	var a_text = req.body.a_text;
	var date = getWorldTime(+9);

	var sets = {disAsk_cate: a_cate, disAsk_writer: a_writer, disAsk_title: a_title, disAsk_text: a_text, disAsk_regdate:date, disAsk_update:date};

	pool.insert('insert into cider.cid_dis_ask set ?', sets, function(err,data){
		if(err){
			res.redirect('back');
		}
		res.redirect('/discuss');
	});
});



router.get('/discuss/detail/:no', function(req, res, next) {
	

	var no = req.params.no;
	var _tot = releaseTime();
	var qry="";
	var row;
	var sets = {dis_no : no};
	var next = {};
	var pre = {}

	mysql.update('update cider.cid_dis_reg set dis_view = dis_view + 1 where dis_no = ?', [no] ,function (err, data){
		if(err){
			res.redirect('back');
		}
		
		//mysql.select('SELECT * FROM cider.cid_dis_reg r left join cider.cid_dis_comt c on c.dis_no = r.dis_no where dis_no = '+no+'', function (err, data){
			mysql.select('SELECT * FROM cider.cid_dis_reg where dis_no = '+no+'', function (err, data){
			if(err){
				res.redirect('back');
			}
			row = data;
				mysql.select('select * from cider.cid_dis_comt where dis_no = '+no+' order by comt_regdate desc', function(err,data){
					if(err){
						res.redirect('back');
					}
				var comt = data;

					//mysql.select('select comt_opt as chk,count(ifnull(comt_opt,0)) as cnt, dis_no from cider.cid_dis_comt where dis_no='+no+' group by comt_opt', function(err,data){
					//mysql.select('select comt_opt as chk,count(comt_opt) as cnt from cider.cid_dis_comt where dis_no='+no+'  group by comt_opt', function(err,data){
					//mysql.select('select comt_opt,count(comt_opt) from cider.cid_dis_comt where dis_no='+no+'  group by comt_opt', function(err,data){
					mysql.select('select count(*) as dis_no,comt_no from cider.cid_dis_comt where dis_no='+no+'', function(err,data){
						var comtCount = data;


						//mysql.select('select count(comt_opt) from cider.cid_dis_comt where dis_no='+no+'', function(err,data){

								//var a_comtCount = data;

							mysql.select('select comt_opt as chk,count(ifnull(comt_opt,0)) as cnt from cider.cid_dis_comt where dis_no='+no+' group by comt_opt order by comt_opt asc', function(err,data){
								var g_comtCount = data;

									var a1 = 0;
									var a2 = 0;
									var a3 = 0;
									if((g_comtCount.length) == 1)
									{

										for (var i in data) {
                                           //console.log('Post Titles: ', g_comtCount[i].chk);
                                           if(g_comtCount[i].chk==0)
                                           {
                                           	a1=g_comtCount[i].cnt
                                           }else if(g_comtCount[i].chk==1)
                                           {
                                           	 a2=g_comtCount[i].cnt
                                           }else if(g_comtCount[i].chk==2)
                                           {
                                           	 a3=g_comtCount[i].cnt
                                           }
                                        }

									} else if((g_comtCount.length) == 2)
									{
										for (var i in data) {
                                           if(g_comtCount[i].chk=="0")
                                           {
                                           	a1=g_comtCount[i].cnt
                                           }else if(g_comtCount[i].chk=="1")
                                           {
                                           	 a2=g_comtCount[i].cnt
                                           }else if(g_comtCount[i].chk=="2")
                                           {
                                           	 a3=g_comtCount[i].cnt
                                           }
                                        }
									}else if((g_comtCount.length) == 3)
									{
										for (var i in data) {
                                           if(g_comtCount[i].chk==0)
                                           {
                                           	a1=g_comtCount[i].cnt
                                           }else if(g_comtCount[i].chk==1)
                                           {
                                           	 a2=g_comtCount[i].cnt
                                           }else if(g_comtCount[i].chk==2)
                                           {
                                           	 a3=g_comtCount[i].cnt
                                           }
                                        }
									}

								//mysql.select('(SELECT IFNULL(comt_opt, 0) as cnt FROM cider.cid_dis_comt where dis_no='+no+')UNION(SELECT 0 comt_opt)', function(err,data){
									//var testCount = data;
								/*mysql.select('select * from cider.cid_dis_comt_comt where comt_no = '+no+'', function(err,data){
									if(err){ res.redirect('back');	}
								var comtco = data;*/

				res.render('front/cid_discuss/cid_discuss_detail', {discuss:row, comt:comt, comtCount:comtCount,g_comtCount:g_comtCount,a1:a1,a2:a2,a3:a3});
			});
		  });  
		});
	  });
	});
  });
//});
//});
router.post('/discuss/comtPush', function(req,res,next){
	var options = req.body.options;
	var comt_writer = req.body.comt_writer;
	var comt_pw = req.body.comt_pw;
	var comt_text = req.body.comt_text;
	var dis_no = req.body.dis_no;
	var date = getWorldTime(+9);

	var sets = {dis_no:dis_no, comt_opt:options,comt_writer:comt_writer, comt_pw:comt_pw, comt_text:comt_text,comt_regdate:date,comt_update:date};

	mysql.insert('insert into cider.cid_dis_comt set ?', sets,  function (err, data){
		dis_no;
    res.redirect('/discuss/detail/'+dis_no+'');
  });
});
router.post('/discuss/comtcomtPush', function(req,res,next){
	var comt_writer = req.body.comt_writer;
	var comt_pw = req.body.comt_pw;
	var comt_text = req.body.comt_text;
	var dis_no = req.body.dis_no;
	var comt_no = req.body.comt_no;
	var date = getWorldTime(+9);

	console.log(comt_writer);
	console.log(comt_pw);
	console.log(dis_no); 
	console.log(comt_no);

	var sets = {comt_no:comt_no, comtco_writer:comt_writer, comtco_pw:comt_pw, comtco_text:comt_text, comtco_date:date};

	mysql.insert('insert into cider.cid_dis_comt_comt set ?', sets,  function (err, data){
		dis_no;

	//뒤로 가는 스크립트
	var backURL=req.header('Referer') || '/';
  	// do your thang
  	res.redirect(backURL);
    //res.redirect('/discuss/detail/'+dis_no+'');
  });
});

router.get('/ssss/:idx', function(req, res, next) {
	var idx = req.params.idx;

	//console.log(idx);

    mysql.select('select * from cider.cid_dis_comt_comt where comt_no = '+idx+'', function (err, data){

        if (err) throw err;
        //console.log("+++++++");
        //console.log(data);

        //var aaa = data;
       // aaa == "123";
       //res.send( {aaa:data} );
     // res.send(data[0].comt_no);
   // var json=JSON.stringify(data);
   // res.send(json);
  //res.send(data);
  res.send({ ddd : data });
	});
});

router.get('/discuss/declaration', function(req,res,next){

	var comt_no = req.query.declar_comt_no;
	console.log(comt_no);
	mysql.select('select dis_no, comt_no, comt_text from cider.cid_dis_comt where comt_no ='+comt_no+'', function (err, data){
	//mysql.select('(SELECT dis_no,comt_no,"" as comtco_no,comt_writer,comt_regdate from cider.cid_dis_comt) UNION (SELECT "",comt_no,comtco_no as comtco_no,comtco_writer,comtco_date FROM cider.cid_dis_comt_comt)order by comt_regdate desc;', function (err, data){
		var comtlist = data;
	res.render('front/cid_discuss/cid_discuss_declaration', {comtlist: comtlist})
	 });
 });

router.post('/discuss/declaration', function(req,res,next){
	var dis_no = req.body.dis_no;
	var comt_no = req.body.comt_no;
	var comt_text = req.body.comt_text;
	var date = getWorldTime(+9);

	console.log(dis_no);
	console.log(comt_no);

	var sets = {dis_no:dis_no, comt_no:comt_no, comt_text:comt_text, comt_regdate:date};

	mysql.insert('insert into cider.cid_dis_declar set ?', sets,  function (err, data){
		dis_no;
	res.send('<script>alert("신고 완료되었습니다.");location.href="/discuss/detail/'+dis_no+'";</script>');
    //res.redirect('/discuss/detail/'+dis_no+'');
  });
});

router.get('/discuss/deleteComt/:ida&:pwNum', function(req, res, next) {
	
	var CP = 1;
	var ida = req.params.ida;
	var pwNum = req.params.pwNum;

	mysql.select('select comt_pw from cider.cid_dis_comt where comt_no = '+ida+'', function (err, data){

		if(pwNum == data[0].comt_pw){

	
	mysql.del('delete from cider.cid_dis_comt where comt_no = '+ ida +'', function (err, data){
		if(err){
			res.send({fail:data});
		}else{
			res.send({success:data});
		}
    });

		} else{
			//console.log("fail");
			//res.redirect('/discuss/detail/');
			//res.send('<script>alert("비밀번호를 확인해주세요.");location.href="/discuss/detail/";</script>');
			res.send({fail:1});
		}
  });
});



router.get('/shComt/:idx', function(req, res, next) {
   
   alert("1111");
   var idx = req.params.idx;


   var qry="";
   
   var now = new Date();
   var _year=  now.getFullYear();
   var _mon =   now.getMonth()+1;
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
     var _hor = now.getHours ();
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
    
    var _tot=_year+""+_mon+""+_date+""+_hor+""+ _min;
   var lang = req.params.lang;
   var start = (idx - 1) * 12;
   //var start= start +1;
   //var end = idx * 12;
   var end = 12;
    qry="select * from cider.cid_dis_comt_comt order by comtco_no desc limit "+ start +", "+ end +"";
   console.log(qry);
   mysql.select(qry, function (err, data){

       if (err) throw err;
       res.send({ contents : data });
   });
   
});


router.post('/ftest', function(req, res, next) {
	var consult_name = req.body.consult_name;
	var consult_test = req.body.consult_test;
	var coup_code = req.body.coup_code;
	var row;
	//var consult_no = req.body.consult_no;
	//var no = consult_no + 1;
	console.log(consult_name);
	
	var sets = {consult_name : consult_name, consult_test : consult_test};
	
	//mysql.select('select * from cider.cid_coupon where coup_code = '+coup_code+'', function (err, data){
	pool.insert('INSERT INTO cider.cid_finance (consult_name) VALUES (?)',sets, function (err, data){
		if(err){
			res.redirect('back');
		} 
		res.render('front/cid_finance/cid_finance_test', {row : data});
	 });
	});


router.get('/ftest/checkcode', function(req, res, next) {

	var coup_code = req.body.coup_code;
	
	console.log(coup_code);
});

router.get('/finance/profile', function(req, res, next) {
	var finance;
	var fi_app_cate= rdate();
	mysql.select("SELECT COUNT(*) AS appno FROM cider.cid_fi_applyform where fi_app_cate="+fi_app_cate+";", function (err, data){
		
	res.render('front/cid_finance/cid_finance_profile', {finance : data});
	});
});

router.get('/finance/done', function(req, res, next) {

	res.render('front/cid_finance/cid_finance_done', { });

});

router.get('/finance', function(req, res, next) {
	var finance;
	var fi_app_cate= rdate();
	mysql.select("SELECT COUNT(*) AS appno FROM cider.cid_fi_applyform where fi_app_cate="+fi_app_cate+";", function (err, data){
		
	res.render('front/cid_finance/cid_finance', {finance : data});
	});
});


router.get('/finance/apply', function(req, res, next) {

	res.render('front/cid_finance/cid_finance_apply', { });

});

router.get('/finance/contents', function(req, res, next) {
	var finance;
	var no = req.params.no;
	
	var now = new Date();
	 var _year=  now.getFullYear();
   var _mon =   now.getMonth()+1;
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
	 
	var _tot=_year+""+_mon+""+_date+""+_hor+""+ _min;
	
	var sets = {con_category : no, con_release : _tot};
	var row;


	var fi_app_cate= rdate();
	
	qry="select con_no, con_photo, con_title from cider.cid_contents where con_category = '2' and con_release <= '"+_tot+"' order by con_no desc limit 0,12";
	mysql.select(qry,
			 function (err, data){	 
				if (err) throw err;
		 
		 row = data;
		 
			mysql.select("SELECT COUNT(*) AS appno FROM cider.cid_fi_applyform where fi_app_cate="+fi_app_cate+";", function (err, data){
				
			

		 res.render('front/cid_finance/cid_finance_contents', { contents : row, finance:data});
			});
	});
});




router.post('/finance/apply/insert', function(req, res, next) {
	var fi_app_no = req.body.fi_app_no;
	var fi_app_cate = req.body.fi_app_cate;
	var fi_app_name = req.body.fi_app_name;
	var phone1 = req.body.fi_app_phone1;
	var phone2 = req.body.fi_app_phone2;
	var phone3 = req.body.fi_app_phone3;
	var email1 = req.body.fi_app_email1;
	var email2 = req.body.fi_app_email2;
	var fi_app_job = req.body.fi_app_job;
	var fi_app_path = req.body.fi_app_path;
	var fi_app_comment = req.body.fi_app_comment;
	var fi_app_age = req.body.fi_app_age;
	var fi_app_place = req.body.fi_app_place
	
	var fi_app_email = email1 + "@" + email2;
	var fi_app_phone = phone1 + "-" + phone2 + "-" + phone3;
	
	var date = getWorldTime(+9);

	var fi_app_cate= rdate();
	
	var row;
	var sets = {fi_app_cate : fi_app_cate, fi_app_name : fi_app_name, fi_app_phone : fi_app_phone, fi_app_email : fi_app_email, fi_app_job : fi_app_job, fi_app_path : fi_app_path, fi_app_comment : fi_app_comment, fi_app_regDate : date, fi_app_upDate : date, fi_app_age:fi_app_age, fi_app_place:fi_app_place};
	
	pool.insert('insert into cider.cid_fi_applyform set ?', sets, function (err, data){
		if(err){
			res.redirect('back');
		}
		//2016년 12월 16일 수정 사항(재무 테스트용)=====
		 setTimeout(function() {
         }, 3000);
		 //=============================================
		mysql.select('select * from cider.cid_fi_applyform where fi_app_phone ="'+fi_app_phone+'" and fi_app_name = "'+fi_app_name+'"', function (err, data2){
		//res.redirect('/lecture/done');
		res.render('front/cid_finance/cid_finance_done', {row : data2});
		});
	 });
});



router.get('/addMore2/:idx/:p', function(req, res, next) {
   
   var idx = req.params.idx;
   var p=req.params.p;
   var now = new Date();
    var _year=  now.getFullYear();
     var _mon =   now.getMonth()+1;
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
     var _hor = now.getHours ();
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
    
    var _tot=_year+""+_mon+""+_date+""+_hor+""+ _min;
   console.log(idx+"=================");
   var lang = req.params.lang;
   var start = (idx - 1) * 12;
   //var start= start +1;
   //var end = idx * 12;
   var end = 12;
   var qry='';
   console.log(start, end);
   //mysql.select('select con_no, con_photo, con_title  from cider.cid_contents where con_category = "'+ idx +'" order by con_no desc limit '+ start +', '+ end +'', function (err, data){
      //mysql.select('select con_no, con_photo, con_title  from cider.cid_contents  order by con_no desc limit '+ start +', '+ end +'', function (err, data){
       //if(p==null)
      // {
      //   qry='select con_no, con_photo, con_title  from cider.cid_contents  order by con_no desc limit '+ start +', '+ end +'';
      // } else {
         qry="select con_no, con_photo, con_title  from cider.cid_contents where con_release <= '"+_tot+"' and con_category = "+ p +" order by con_no desc limit "+ start +", "+ end +"";
      // }
       //mysql.select('select con_no, con_photo, con_title  from cider.cid_contents where con_category = "'+ p +'" order by con_no desc limit '+ start +', '+ end +'', function (err, data){
   console.log(qry);
   
   mysql.select(qry, function (err, data){
       if (err) throw err;
       console.log('select con_no, con_photo, con_title  from cider.cid_contents  order by con_no desc limit '+ start +', '+ end +'');
       res.send({ contents : data });
   });
   
   
});


router.get('/finance/review', function(req, res, next) {

	var finance;
	var rev;
	var fi_app_cate= rdate();
	mysql.select("SELECT COUNT(*) AS appno FROM cider.cid_fi_applyform where fi_app_cate="+fi_app_cate+";", function (err, data){
		
		mysql.select('SELECT * FROM cider.cid_fi_review order by rev_no desc;', function (err, data2){
		
	res.render('front/cid_finance/cid_finance_review', {finance : data, rev:data2});
	});
 });
});

router.get('/finance/process', function(req, res, next) {

	var finance;

	var fi_app_cate= rdate();

	mysql.select("SELECT COUNT(*) AS appno FROM cider.cid_fi_applyform where fi_app_cate="+fi_app_cate+";", function (err, data){
		
	res.render('front/cid_finance/cid_finance_process', {finance : data});
	});
});

router.get('/finance/necessary', function(req, res, next) {

	var finance;

	var fi_app_cate= rdate();

	mysql.select("SELECT COUNT(*) AS appno FROM cider.cid_fi_applyform where fi_app_cate="+fi_app_cate+";", function (err, data){
		
	res.render('front/cid_finance/cid_finance_necessary', {finance : data});
	});
});

router.get('/finance/menu', function(req, res, next) {

	var finance;

	var fi_app_cate= rdate();

	mysql.select("SELECT COUNT(*) AS appno FROM cider.cid_fi_applyform where fi_app_cate="+fi_app_cate+";", function (err, data){
		
	res.render('front/cid_finance/cid_finance_menu', {finance : data});
	});
});


module.exports = router;
