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

								/*mysql.select('(select count(comt_no) as comt_no from cider.cid_dis_comt_comt)UNION(SELECT dis_no FROM cider.cid_dis_comt where dis_no = '+no+')', function(err,data){
									if(err){ res.redirect('back');	}
									var comtco_cnt = data;
								*/

								mysql.select('select * from cider.cid_dis_comt where dis_no = '+no+'', function(err,data){
									var d_n = data;
									var d_val;
									var qry='';
									var comtco_count;


									for(var j =0; j < d_n.length; j++){
										d_val = d_n[j].comt_no;
										console.log(d_val);
										qry='select count(comt_no) as ctno from cider.cid_dis_comt_comt where comt_no = '+d_val+'';
										mysql.select(qry, function(err,data){
										comtco_count = data;
										console.log(comtco_count);
										});
									}
									console.log(d_val);

									console.log("--아래에 있는 것은 undefined뜸--")
									console.log(comtco_count);
				res.render('front/cid_discuss/cid_discuss_detail', {discuss:row, comt:comt, comtCount:comtCount,g_comtCount:g_comtCount,a1:a1,a2:a2,a3:a3});
			});
		  });  
		});
	  });
	});
  });
});
//});
//});

router.get('/discuss/detail/:no', function(req, res, next) {
mysql.select('select * from cider.cid_dis_comt where dis_no = '+no+'', function(err,data){
			var d_n = data;
			var d_val;
			//var comtco_count;
			var abab;
			var qry="";
			var qrycnt="";

			for(var j =0; j < d_n.length; j++){
				d_val = d_n[j].comt_no;
				console.log(d_val);
				
				qry='select count(comt_no) as ctno from cider.cid_dis_comt_comt where comt_no = '+d_val+'';
				console.log(qry);
				console.log("----");
				mysql.select(qry, function(err,data){
					var comtco_count = data;
					var bbb = 1;
					//abab = comtco_count[0];
					//console.log(comtco_count);
					//{comtco_count:comtco_count};
					res.render('front/cid_discuss/cid_discuss_detail', {comtco_count:comtco_count,bbb:bbb});
				});
				
			}
	
	});
});
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

/* ************ 댓글 신고하기  **********/
router.get('/discuss/declaration', function(req,res,next){

	var comt_no = req.query.declar_comt_no;
	//console.log(comt_no);
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

	//console.log(dis_no);
	//console.log(comt_no);

	var sets = {dis_no:dis_no, comt_no:comt_no, comt_text:comt_text, comt_regdate:date};

	mysql.insert('insert into cider.cid_dis_declar set ?', sets,  function (err, data){
		dis_no;
	res.send('<script>alert("신고 완료되었습니다.");location.href="/discuss/detail/'+dis_no+'";</script>');
    //res.redirect('/discuss/detail/'+dis_no+'');
  });
});
/************** 대댓글 신고하기  **********/
router.get('/discuss/declaration2', function(req,res,next){
	var comtlist;
	var comtco_no = req.query.declar_comtco_no;
	
	mysql.select('select comt_no,comtco_no,comtco_text from cider.cid_dis_comt_comt where comtco_no ='+comtco_no+'', function (err, data){
		var comtlist2 = data;
	res.render('front/cid_discuss/cid_discuss_declaration2', {comtlist2: comtlist2})
	 });
 });

router.post('/discuss/declaration2', function(req,res,next){
	//var dis_no = req.body.dis_no;
	var comt_no = req.body.comt_no;
	var comtco_no = req.body.comtco_no;
	var comtco_text = req.body.comt_text;
	var date = getWorldTime(+9);

	console.log(comtco_text);

	//console.log(dis_no);
	//console.log(comt_no);

	var sets = {comt_no:comt_no, comtco_no:comtco_no, comt_text:comtco_text, comt_regdate:date};

	mysql.insert('insert into cider.cid_dis_declar set ?', sets,  function (err, data){
	res.send('<script>alert("신고 완료되었습니다.");window.history.go(-2);</script>');
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

router.get('/discuss/deleteComtco/:ida&:pwNum', function(req, res, next) {
	
	var CP = 1;
	var ida = req.params.ida;
	var pwNum = req.params.pwNum;

	mysql.select('select comtco_pw from cider.cid_dis_comt_comt where comtco_no = '+ida+'', function (err, data){

		if(pwNum == data[0].comtco_pw){
	mysql.del('delete from cider.cid_dis_comt_comt where comtco_no = '+ ida +'', function (err, data){
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



module.exports = router;
