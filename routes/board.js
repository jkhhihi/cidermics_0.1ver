var express = require('express');
var router = express.Router();
var mysql = require("./model/mysql");
var session = require('express-session');
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


/* view */
router.get('/board', function(req, res, next) {
	var row;
	var date = getWorldTime(+9);
	var rda= rdate();
	var qry = "select idx, userid, title, content, ymd from cider.community_board";
	mysql.select(qry, function (err, data){
		if (err) throw err;
			row = data;
			
	res.render('front/cid_board/community', {rows : row});
	});
 });

/* read */
router.get('/board/read', function(req, res, next) {
	var row;
	var qry = "select idx, userid, title, content, ymd from cider.community_board";
	mysql.select(qry, function (err, data){
		if (err) throw err;
			row = data;
			
	res.render('front/cid_board/read', {rows : row});
	});
 });

router.get('/board/read/:idx', function(req, res, next) {
	var rows;
	var idx = req.params.idx;

	var sePass = req.session.passport;
	if(sePass != null){
		var mem_id ='';
		var mem_name ='';
		if(sePass.user.length == 1){
			mem_id = sePass.user[0].mem_id;//일반로그인
			mem_name = sePass.user[0].mem_name;
		}else{
			mem_id = proPhoto = sePass.user.id;//페이스북 로그인
			mem_name = proPhoto = sePass.user.displayName;//req.user.displayName
		}
	}

	var qry = "select * from cider.community_board where idx="+idx+"";
	mysql.select(qry, function (err, data){
		if (err) throw err;
			rows = data;

	qry = "select * from cider.communuty_comt where idx="+idx+" order by comt_regdate desc";
	mysql.select(qry, function (err, data){
		if (err) throw err;
			comt = data;

	qry = "select mem_name, mem_id from cider.cid_member where mem_id='"+mem_id+"'";
	mysql.select(qry, function (err, data){
		if (err) throw err;
			mem = data;

	qry = "select count(*) as idx, comt_no from cider.communuty_comt where idx='"+idx+"'";
	mysql.select(qry, function (err, data){
		var comtCount = data;

	res.render('front/cid_board/read', {rows : rows, data:comt, mem:mem, mem_id:mem_id, mem_name:mem_name, comtCount:comtCount});
        });
      });
    });
  });
});

/* 댓글 등록 */
router.post('/read/comtPush', function(req,res,next){
	var comt_writer = req.body.comt_writer;
	var comt_pw = req.body.comt_pw;
	var comt_text = req.body.comt_text;
	var idx = req.body.idx;
	var date = getWorldTime(+9);

	var sets = {idx:idx, comt_writer:comt_writer, comt_pw:comt_pw, comt_text:comt_text,comt_regdate:date};

	mysql.insert('insert into cider.communuty_comt set ?', sets,  function (err, data){
		idx;
    res.redirect('/board/read/'+idx+'');
  });
});

/* 대댓글 등록 */
router.post('/read/comtcomtPush', function(req,res,next){
	var comt_writer = req.body.comt_writer;
	var comt_pw = req.body.comt_pw;
	var comt_text = req.body.comt_text;
	var idx = req.body.idx;
	var comt_no = req.body.comt_no;
	var date = getWorldTime(+9);

	var sets = {comt_no:comt_no, comtco_writer:comt_writer, comtco_pw:comt_pw, comtco_text:comt_text, comtco_date:date};
	var qry = ("insert into cider.communuty_comt_comt set ?");
	mysql.insert(qry, sets,  function (err, data){
		idx;

	//뒤로 가는 스크립트
	var backURL=req.header('Referer') || '/';
  	res.redirect(backURL);
  });
});

/* 댓글 삭제 */
router.get('/read/deleteComt/:ida&:pwNum', function(req, res, next) {
	
	var CP = 1;
	var ida = req.params.ida;
	var pwNum = req.params.pwNum;

	mysql.select('select comt_pw from cider.communuty_comt where comt_no = '+ida+'', function (err, data){

		if(pwNum == data[0].comt_pw){

	
	mysql.del('delete from cider.communuty_comt where comt_no = '+ ida +'', function (err, data){
		if(err){
			res.send({fail:data});
		}else{
			res.send({success:data});
		}
    });

		} else{
			res.send({fail:1});
		}
  });
});

/* 대댓글 삭제 */
router.get('/read/deleteComtco/:ida&:pwNum', function(req, res, next) {
	
	var CP = 1;
	var ida = req.params.ida;
	var pwNum = req.params.pwNum;

	mysql.select('select comtco_pw from cider.communuty_comt_comt where comtco_no = '+ida+'', function (err, data){

		if(pwNum == data[0].comtco_pw){
	mysql.del('delete from cider.communuty_comt_comt where comtco_no = '+ ida +'', function (err, data){
		if(err){
			res.send({fail:data});
		}else{
			res.send({success:data});
		}
    });

		} else{
			res.send({fail:1});
		}
  });
});

/* ************ 댓글 신고하기  **********/
router.get('/read/declaration', function(req,res,next){

	var comt_no = req.query.declar_comt_no;
	mysql.select('select idx, comt_no, comt_text from cider.communuty_comt where comt_no ='+comt_no+'', function (err, data){	//mysql.select('(SELECT dis_no,comt_no,"" as comtco_no,comt_writer,comt_regdate from cider.cid_dis_comt) UNION (SELECT "",comt_no,comtco_no as comtco_no,comtco_writer,comtco_date FROM cider.cid_dis_comt_comt)order by comt_regdate desc;', function (err, data){
		var comtlist = data;
	res.render('front/cid_board/discuss_board', {comtlist: comtlist})
	 });
 });

router.post('/read/declaration', function(req,res,next){
	var idx = req.body.idx;
	var comt_no = req.body.comt_no;
	var comt_text = req.body.comt_text;
	var date = getWorldTime(+9);
	var sets = {dis_no:idx, comt_no:comt_no, comt_text:comt_text, comt_regdate:date};

	mysql.insert('insert into cider.cid_dis_declar set ?', sets,  function (err, data){
		idx;
	res.send('<script>alert("신고 완료되었습니다.");location.href="/board/read/'+idx+'";</script>');
  });
});

/************** 대댓글 신고하기  **********/
router.get('/read/declaration2', function(req,res,next){
	var comtlist;
	var comtco_no = req.query.declar_comtco_no;
	
	mysql.select('select comt_no,comtco_no,comtco_text from cider.communuty_comt_comt where comtco_no ='+comtco_no+'', function (err, data){
		var comtlist2 = data;
	res.render('front/cid_discuss/cid_discuss_declaration2', {comtlist2: comtlist2})
	 });
 });

router.post('/read/declaration2', function(req,res,next){
	var idx = req.body.idx;
	var comt_no = req.body.comt_no;
	var comtco_no = req.body.comtco_no;
	var comtco_text = req.body.comt_text;
	var date = getWorldTime(+9);
	var sets = {comt_no:comt_no, comtco_no:comtco_no, comt_text:comtco_text, comt_regdate:date};

	mysql.insert('insert into cider.cid_dis_declar set ?', sets,  function (err, data){
	res.send('<script>alert("신고 완료되었습니다.");location.href="/board/read/'+dis_no+';</script>');
  });
});

router.get('/boardcmt/:idx', function(req, res, next) {
	var idx = req.params.idx;

    mysql.select('select * from cider.communuty_comt_comt where comt_no = '+idx+'', function (err, data){

        if (err) throw err;
 
  	res.send({ ddd : data });
	});
});

/* write */
router.get('/board/write', function(req, res, next) {
	var sePass = req.session.passport;
	var rows ='';
	if(sePass != null){
		var mem_id ='';
		if(sePass.user.length == 1){
			mem_id = sePass.user[0].mem_id;//일반로그인
		}else{
			mem_id = proPhoto = sePass.user.id;//페이스북 로그인
		}
	}
	var qry = "select mem_name as mname, mem_id from cider.cid_member where mem_id='"+mem_id+"'";
		    mysql.select(qry, function (err, rows){
			if (err) throw err;
				rows = rows;
	res.render('front/cid_board/write', {rows:rows});
	});
});


router.post('/board/write', function(req, res, next) {
	var row;
	var userid = req.body.userid;
	var title = req.body.title;
	var contents = req.body.contents;
	var ymd = getWorldTime(+9);
	var passwd = req.body.passwd;
	var memid = req.body.memid;
	var sets = {userid:userid, title:title, content:contents, ymd:ymd, passwd:passwd, mem_id:memid};

	mysql.insert('insert into cider.community_board set ?', sets,  function (err, rows){
	res.redirect('list/1');
	});
});

/* update */
router.get('/board/update/:idx/:passwd', function(req, res, next) {
	var sePass = req.session.passport;
	var rows;
	var idx = req.params.idx;
	var passwd = req.params.passwd;
	
	if(sePass == null){
		var qry = "select userid from cider.community_board where idx="+idx+" and passwd='"+passwd+"'";
	    mysql.select(qry, function (err, data){
		if (err) throw err;
			row = data;
	    if (row.length != 1) {
	    	res.redirect('/board/list/1');
	    }
	 });
	}

	var qry = "select idx, userid, title, content, passwd from cider.community_board where idx="+idx+"";
	    mysql.select(qry, function (err, data){
		if (err) throw err;
			row = data;
	    res.render('front/cid_board/update', {rows : row});
	 });
});

router.post('/board/update', function(req, res, next) {
	var rows;
	var idx = req.body.idx;
	var userid = req.body.userid;
	var title = req.body.title;
	var contents = req.body.contents;

	mysql.update('update cider.community_board set userid=?, title=?, content=? where idx=?', [userid,title,contents,idx], function (err, data){
	res.redirect('/board/read/'+idx+'');
	});
});

/* delete */
router.get('/board/delete/:idx/:passwd', function(req, res, next) {
	var sePass = req.session.passport;
	var rows;
	var idx = req.params.idx;
	var passwd = req.params.passwd;
	
	if(sePass == null){
		var qry = "select userid from cider.community_board where idx="+idx+" and passwd='"+passwd+"'";
	    mysql.select(qry, function (err, data){
		if (err) throw err;
			row = data;
	    if (row.length != 1) {
	    	res.redirect('/board/list/1');
	    }
	 });
	}

	var qry = "delete from cider.community_board where idx="+idx+"";
	    mysql.select(qry, function (err, data){
		if (err) throw err;
			row = data;
	    res.redirect('/board/list/1');
	 });
});


/* paging */
router.get('/board/list/:page', function(req, res, next) {
	var page = req.params.page;
    var opt = req.query.opt;
    var seval = req.query.seval;

	var totalRec = 0,
	pageSize  = 5,
	pageCount = 0;
    start     = 0;
    currentPage = 1;

    if(opt == undefined)
    {
    	opt = 0;
    	seval = 0;
    }

  var countSql = 'SELECT count(*) as numrows from cider.community_board';

  if(opt != 0)
  	countSql = 'SELECT count(*) as numrows from cider.community_board where '+opt+' like \'%'+seval+'%\'';	

  mysql.select( countSql, function(err, countrows, fields) {
    if (err) throw err;
    totalRec      = countrows[0]['numrows'];
    pageCount     =  Math.ceil(totalRec /  pageSize);
    if (typeof req.params.page !== 'undefined') {
        currentPage = req.params.page;
    }
    if(currentPage >1){
      start = (currentPage - 1) * pageSize;
    }

    var sql  = 'SELECT * from cider.community_board order by idx desc LIMIT '+start+' ,'+pageSize+' ';
    
    if(opt != 0)
    	sql = 'SELECT * from cider.community_board where '+opt+' like \'%'+seval+'%\' order by idx desc LIMIT '+start+' ,'+pageSize+' ';
    mysql.select( sql, function(err, data, fields) {
        if (err) throw err;
         res.render('front/cid_board/list', { data: data, pageSize: pageSize, pageCount: pageCount, currentPage: currentPage, opt:opt, seval:seval });
      });
    });
  });

/* passwd_check */
router.get('/board/listcheck', function(req,res,next){
	var idx = req.query.idx;
	var set = req.query.set;
	var memid = req.query.memid;
	var flag = -1;

	var sql  = "SELECT mem_id from cider.community_board where idx="+idx+" and mem_id='"+memid+"'";
	mysql.select(sql, function (err, data){
		if(data.length > 0) {
			flag = 1;//본인이 작성한 글인 경우
		}
		else {
			flag = -1;//본인이 작성한 글이 아닌 경우
		}

    res.render('front/cid_board/listcheck',{idx:idx, set:set, flag:flag});
    });
});

router.post('/board/listcheck', function(req,res,next){
	var passwd = req.body.passwd;
	var idx = req.body.idx;
	var set = req.body.set;
	var flag = 0;

	var sql  = "SELECT passwd from cider.community_board where idx="+idx+" and passwd='"+passwd+"'";
	mysql.select(sql, function (err, data){
		if(data.length > 0){
			flag = 1;//패스워드가 일치 한 경우
		}

	res.render('front/cid_board/listcheck', {idx:idx, set:set, passwd:passwd, flag:flag});
	});
});


module.exports = router;