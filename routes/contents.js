var express = require('express');
var router = express.Router();
var mysql = require("./model/mysql");
var passport = require('passport');

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


router.get('/contents', function(req, res, next) {
	var no = req.params.no;
	var row;
	
	 var now = new Date();
	 var _year=  now.getFullYear();
	 var _mon =   now.getMonth()+1;
	 _mon=""+_mon;
	 if (_mon.length < 2 )
	 {
	    _mon="0"+_mon;
	 }

	
	var _totmon = _year+""+_mon;
	var _tot = releaseTime();

	var qry="";
	
	var sets = {con_no : no};
	var next = {};
	var pre = {};
	mysql.select("SELECT * FROM cider.cid_contents where con_pop = 1 order by con_release desc limit 0,16;", function (err, data){
	//mysql.select("SELECT * FROM cider.cid_contents where con_release between "+_totmon+"010000 and "+_tot+" order by con_release desc limit 0,16;", function (err, data){
		//mysql.select("SELECT * FROM cider.cid_contents where con_release between 201703010000 and "+_tot+" order by con_viewCount desc limit 0,16;", function (err, data){
		 if (err) throw err;
		 
		 row = data;
			
		 res.render('front/cid_contents/cid_contents_popular', { contents : row});
	});
 });



router.get('/contents/all', function(req, res, next) {
	var no = req.params.no;
	var row;

	var _tot = releaseTime();

	var qry="";
	
	 qry="select con_no, con_photo, con_title, if (a.con_upDate > DATE_ADD(now(),INTERVAL -1 DAY) ,'/page_imgs/main_img/new_mark4.svg','/page_imgs/main_img/new_mark1px.png') as chkDat from cider.cid_contents a where a.con_release <= '"+_tot+"' order by a.con_no desc limit 0,60";
	mysql.select(qry, function (err, data){
		if (err) throw err;
		 row = data;
			
		 res.render('front/cid_contents/cid_contents_all', { contents : row});
	});
 });


router.get('/contents/:no', function(req, res, next) {
	
	var no = req.params.no;
	
	var _tot = releaseTime();

	var qry="";
	
	var sets = {con_category : no, con_release : _tot};
	var row;
	
	qry="select con_no, con_photo, con_title from cider.cid_contents where con_category = '"+no+"' and con_release <= '"+_tot+"' order by con_no desc limit 0,60";

	//mysql.select('select con_no, con_photo, con_title from cider.cid_contents where con_category = '+no+' order by con_no desc limit 0,12', function (err, data){
	mysql.select(qry,
			 function (err, data){	 
				if (err) throw err;
		 
		 row = data;
		 res.render('front/cid_contents/cid_contents', { contents : row,no : no});
	});
});



router.get('/contents/detail/:no', function(req, res, next) {



	var sePass = req.session.passport;
	var mem_id ='';
	if(sePass != null){
		if(sePass.user.length == 1){
			mem_id = sePass.user[0].mem_id;
		}else{
			mem_id = proPhoto = sePass.user.id;
		}
	}else{
		mem_id = 0;
	}

	var sePass = req.session.passport;
	var sePasschk;
	if(sePass != null){
		sePasschk = 1;
	}else{
		sePasschk = 0;
	}

	var no = req.params.no;


	
	var _tot = releaseTime();

	var qry="";
	
	var row;
	var sets = {con_no : no};
	var next = {};
	var pre = {};

	mysql.select("select mem_id, cli_no from cider.cid_clipping where mem_id = '"+mem_id+"' and con_no = "+no+"", function(err,data3){


	mysql.update('update cider.cid_contents set con_viewCount = con_viewCount + 1 where con_no = ?', [no] ,function (err, data){
		if(err){
			res.redirect('back');
		}
		
		mysql.select('select c.con_no, c.con_category, c.con_writer, c.con_title, c.con_content, c.con_photo, c.con_viewCount,c.con_regDate, c.con_upDate, c.con_likeCnt, c.comment_no, c.user_no, c.user_comment, c.con_release,  u.user_email, u.user_name, u.user_profile_img, u.user_sns_url, u.user_sns_icon, cate.cate_no, cate.cate_name from cider.cid_contents c left join cider.cid_user u on u.user_no = c.user_no left join cider.cid_con_cate cate on c.con_category = cate.cate_no and u.user_level = "2" where 1=1 and c.con_no = '+no+'', function (err, data){
			if(err){
				res.redirect('back');
			}
			console.log(data.length == 0)
			if(data.length == 0){
			var lang = 0;

			}else{			
			var lang = data[0].con_category;
			}
			var contents = data;
			
			mysql.select('(SELECT con_no, con_title, con_photo FROM cider.cid_contents WHERE con_no > '+ no +' and con_category = "'+ lang +'" and con_release <= "'+_tot+'"  LIMIT 1) UNION ( SELECT con_no, con_title ,con_photo FROM cider.cid_contents WHERE con_no < '+ no +' and con_category = "'+ lang +'" and con_release <= "'+_tot+'" ORDER BY con_no DESC LIMIT 1 ) order by con_no desc' , function (err, data){	
				if(err){
					res.redirect('back');
				}
				
				qry="select con_no, con_photo, con_title from cider.cid_contents where con_release <= '"+_tot+"' ORDER BY RAND() LIMIT 0,24";
				   mysql.select(qry, function (err, data1){
					if(err){
					res.redirect('back');
					}
					row = data1;

					mysql.select('SELECT con_no, cmore_op1, cmore_op2,cmore_op3,cmore_label FROM cider.cid_contentsMore WHERE con_no = '+ no +'' , function (err, data2){	
						if(err){
							res.redirect('back');
						}
						var cmore = data2;

				res.render('front/cid_contents/cid_contents_detail', {contents : contents, preNext : data, cont : row, cmore:cmore,sePass:mem_id, memidval : data3 });
			  });
			});
		  });
		 });
	   });
	});
});

router.post('/clipping/:sePasschk&:no', function(req, res, next) {
	var sePasschk = req.params.sePasschk;
	var no = req.params.no;
	var title = req.body.title;
	var photo = req.body.photo;
	var date = getWorldTime(+9);
	var sets = {mem_id: sePasschk , con_no: no, con_title:title, con_photo:photo, reg_date:date};
	mysql.insert('insert into cider.cid_clipping set ?', sets,  function (err, data){

		console.log("성공");
		res.send({success:1});
		//res.redirect('back');
		//res.send('<script>location.reload()</script>');
		//res.redirect('/');
	});
});

router.post('/clipping_del/:id&:no', function(req, res, next) {
	var clino = req.params.id;
	var no = req.params.no;
	mysql.del('delete from cider.cid_clipping where con_no = '+ no +' and cli_no='+clino+'', function (err, data){
		if(err){
			res.redirect('back');
		}else{
			res.redirect('back');
		}
    });
});




router.get('/addMore/:idx', function(req, res, next) {
   
   var idx = req.params.idx;
   var qry="";
   
  var _tot = releaseTime();

   var lang = req.params.lang;
   var start = (idx - 1) * 30;
   //var start= start +1;
   //var end = idx * 12;
   var end = 30;
   
    qry="select con_no, con_photo, con_title  from cider.cid_contents where con_release <= '"+_tot+"' order by con_no desc limit "+ start +", "+ end +"";

   mysql.select(qry, function (err, data){

       if (err) throw err;
       res.send({ contents : data });
   });
   
});


router.get('/addMore2/:idx/:p', function(req, res, next) {
   
   var idx = req.params.idx;
   var p=req.params.p;
   var _tot = releaseTime();
   var lang = req.params.lang;
   var start = (idx - 1) * 30;
   var end = 30;
   var qry='';
         qry="select con_no, con_photo, con_title  from cider.cid_contents where con_release <= '"+_tot+"' and con_category = "+ p +" order by con_no desc limit "+ start +", "+ end +"";

   
   mysql.select(qry, function (err, data){
       if (err) throw err;
       //console.log('select con_no, con_photo, con_title  from cider.cid_contents  order by con_no desc limit '+ start +', '+ end +'');
       res.send({ contents : data });
   });
   
   
});

router.get('/contents/editor/:no', function(req, res, next) {

		var no = req.params.no;
		var editor;
		var _tot = releaseTime();

	mysql.select('select c.con_no,c.con_writer,c.con_title,c.con_photo,c.user_comment, u.user_sns_icon from cider.cid_contents c left join cider.cid_user u on u.user_no = c.user_no where c.user_no = '+no+' and con_release <= '+_tot+' order by c.con_no desc', function (err, data){
			if(err){
				res.redirect('back');
			}

			editor = data;
			res.render('front/cid_contents/cid_contents_editor', {editor:editor});
	});
});

module.exports = router;
