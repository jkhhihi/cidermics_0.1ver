/**
 * http://usejsdoc.org/
 */
var express = require('express');
var router = express.Router();
var fs = require('fs');
var multer = require('multer');

/*의미없는 코드
var storage = multer.diskStorage({
	destination: function (req, file, callback) {
		callback(null, './public/uploads');
	},
	filename: function (req, file, callback) {
		callback(null, file.originalname);
	}
});
var upload = multer({ storage : storage});
*/

var formidable = require('formidable');
var dir = require('node-dir');
var mysql = require("./model/mysql");

var multiparty = require('connect-multiparty');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');


//var upload = multer({ dest: '../public/uploads/' });
var passport = require('passport');

//시간 설정
function getWorldTime(tzOffset) { // 24시간제
	  var now = new Date();
	  var tz = now.getTime() + (now.getTimezoneOffset() * 60000) + (tzOffset * 3600000);
	  now.setTime(tz);


	  var s =
	    leadingZeros(now.getFullYear(), 4) + '-' +
	    leadingZeros(now.getMonth() + 1, 2) + '-' +
	    leadingZeros(now.getDate(), 2) + ' ' +

	    leadingZeros(now.getHours(), 2) + ':' +
	    leadingZeros(now.getMinutes(), 2)// + ':' +
	    //leadingZeros(now.getSeconds(), 2);

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

/* GET home page. */
router.get('/', function(req, res, next) {
	
	var CP = 0;
	console.log(req.cookies);
	if(req.cookies.auth){
		res.redirect('/adm/index');
	}else{
		res.render('admin/admin', {CP:CP});
	}
});

router.post('/login', passport.authenticate('local', { failureRedirect: '/adm', failureFlash: true }), function(req, res, next) {
	var CP = 0;
	res.redirect('/adm/index');
	var sess = req.session;
	//console.log(sess);
	var sePass = sess.passport;
	if(sePass != null){
		var proPhoto = sess.passport.user;
	//console.log(proPhoto);
	}
	/*var id = req.body.id;
	var pw = req.body.pw;
	
	console.log(id, pw);
	if(id == "superadmin" && pw == "boto7aws!"){
		res.cookie('auth', true);
		res.redirect('/adm/contents');
	}else {
		res.redirect('/adm');
	}*/
});


router.get('/contents', ensureAuthenticated, function(req, res, next) {
	var CP = 1;
		mysql.select('select * from cider.cid_contents order by con_no desc', function (err, data){
			 res.render('admin/contents/contents', { CP : CP, contents : data });	    	
		});
});

router.get('/index', ensureAuthenticated, function(req, res, next) {
	var CP = 0;
		mysql.select('SELECT * from cider.cid_contents where con_pop = 1 order by con_release desc;', function (err, data){
			 res.render('admin/admin_index', { CP : CP, contents : data });
		});
});


router.get('/contents/insert', function(req, res, next) {
	
	var CP = 1;
	var cate;
	var user;
	mysql.select('select * from cider.cid_con_cate', function (err, data){
		if(err){
			res.redirect('back');
		}
		
		cate = data;
		
		mysql.select('select * from cider.cid_user where user_level="2"', function (err, data2){
			if(err){
				res.redirect('back');
			}
			user = data2;

			res.render('admin/contents/insert', {cate : cate, user : user, CP : CP});
			});
		});
    });

router.get('/contents/insertMore', function(req, res, next) {
	
	var CP = 1;
	var cate;
	var user;
	mysql.select('SELECT * FROM cider.cid_contents where con_category = 7 order by con_no desc', function (err, data){
		if(err){
			res.redirect('back');
		}
		
		cate = data;
		
		mysql.select('select * from cider.cid_user where user_level="2"', function (err, data2){
			if(err){
				res.redirect('back');
			}
			user = data2;

			res.render('admin/contents/insertMore', {cate : cate, user : user, CP : CP});
			});
		});
    });


/*test중 comment
router.get('/uMent/:user_no', function(req, res, next) {
	var user_no =  req.params.user_no;
		mysql.select('select * from cider.cid_user', function (err, data){
			if(err){
				res.redirect('back');
			}
			user_no = data;

			res.send({ userC : data });
			});
		});

*/

router.get('/contents/files/:page', ensureAuthenticated, function(req, res, next){
	var page;
	if (typeof req.params.page == 'undefined'){
		page = 1;
	}
	page = req.params.page;
	var obj = [];
	var start = (page - 1) * 12;
	var end = page * 12 -1;
	
	var dir = __dirname + "/../public/uploads/";
	var files = fs.readdirSync(dir)
	    .map(function(v) {
	        return { name:v,
	                 time:fs.statSync(dir + v).mtime.getTime()
	               }; 
	     })
	     .sort(function(a, b) { return a.time - b.time; })
	     .map(function(v) { return v.name; });
	
	files.reverse();
	for (var i = start; i < end+1; i++){
		obj.push(files[i]);
	}
	var pagination = [];
	var totalPage = Math.ceil(files.length / 12);
	var startPage;
	var lastPage;
	if(page % 5 != 0){ startPage = Math.floor(page/5) * 5 + 1; lastPage = Math.ceil(page/5) * 5; }
	else{ startPage = (page/5) * 5 - 4; lastPage = parseInt(page) };
	
	var next = true;
	
	if (lastPage >= totalPage){
		lastPage = totalPage;
		next = false;
	}
	pagination.push(totalPage, startPage, lastPage, next, parseInt(page));
	res.send({'pagination' : pagination, 'files': obj});
});


//콘텐츠 이미지 업로드 등록
router.post('/contents/insert/upload', ensureAuthenticated, function(req, res, next) {
	
	var form = new formidable.IncomingForm();
	console.log(req.file);
	
	form.parse(req);
//	form.on("fileBegin", function (name, file){
//		console.log('upload come on3');
//    });
    form.on("file", function (name, file){
        fs.readFile(file.path, function(error, data){
        	var filePath = __dirname + '/../public/uploads/' + file.name;
        	console.log(filePath);
        	console.log(file);


			
        	
        	fs.writeFile(filePath, data, function(error){
        		if(error){
        			//throw err;
        			//res.redirect('back');
        		}else {
        			//form.on("end", function() {
        				 // res.redirect('back');
        				//});
        		}
        	});
        });
    });
    
    form.on("end", function() {
		  res.redirect('back');
		});

});

router.post('/discuss/insert/upload', ensureAuthenticated, function(req, res, next) {
	
	var form = new formidable.IncomingForm();
	console.log("++++");
	console.log(req.form);
	
	form.parse(req);
    form.on("file", function (name, file){
        fs.readFile(file.path, function(error, data){
        	var filePath = __dirname + '/../public/discuss_imgs' + file.name;
        	console.log(filePath);
        	console.log(file);
			
        	
        	fs.writeFile(filePath, data, function(error){
        		if(error){
        		}else {
        		}
        	});

        });
    });
    
    form.on("end", function() {
		  res.redirect('back');
		});
});



router.post('/contents/insert', ensureAuthenticated, function(req, res, next) {
	
	var CP = 1;
	
	var title = req.body.title;
	var contents = req.body.contents;
	var category = req.body.category;
	var photo = req.body.photo;
	var userNo = req.body.userNo;
	var writer = req.body.writer;
	//console.log(writer);
	var userText = req.body.userText;
	var date = getWorldTime(+9);
	var rdate = req.body.rdate;
	//console.log(userNo);
	//console.log(title);
	var sets = {con_category : category, con_writer : writer, con_title : title, con_content : contents, con_photo : photo, con_viewCount : 0, con_regDate : date, con_upDate : date, user_no : userNo, user_comment : userText, con_release : rdate};
	
	mysql.insert('insert into cider.cid_contents set ?', sets,  function (err, data){
		
    	res.redirect('/adm/contents');
    	
    });
});

router.post('/contents/update', ensureAuthenticated, function(req, res, next) {
	
	var CP = 1;
	
	var no = req.body.no;
	var title = req.body.title;
	var contents = req.body.contents;
	var category = req.body.category;
	var photo = req.body.photo;
	var userNo = req.body.userNo;
	var writer = req.body.writer;
	var userText = req.body.userText;
	var rdate   = req.body.rdate;
	var date = getWorldTime(+9);
	var sets = {con_no : no, con_category : category, con_title : title, con_content : contents, con_photo : photo, con_upDate : date, user_no : userNo, user_comment : userText, con_writer : writer,con_release : rdate   };
	mysql.update('update cider.cid_contents set con_category = ?,  con_title = ?, con_content = ?, con_photo = ?,  con_upDate = ?, user_no = ?, user_comment = ?, con_writer = ? ,con_release= ?  where con_no = ?', [category,title,contents,photo,date,userNo,userText,writer,rdate,no], function (err, data){
		
    	res.redirect('/adm/contents');
    	
    });
});


router.post('/contents/insertMore', ensureAuthenticated, function(req, res, next) {
	
	var CP = 1;
	
	var con_no = req.body.con_no;
	var yes24 = req.body.yes24;
	var ala = req.body.ala;
	var kyobo = req.body.kyobo;
	var cmlabel = req.body.cmlabel;
	var sets = {con_no : con_no, cmore_label : cmlabel, cmore_op1 : yes24, cmore_op2 : ala, cmore_op3 : kyobo};
	
	mysql.insert('insert into cider.cid_contentsMore set ?', sets,  function (err, data){
		
    	res.redirect('/adm/contents');
    	
    });

});

router.get('/contents/delete/:no', ensureAuthenticated, function(req, res, next) {
	
	var CP = 1;
	var no = req.params.no;
	
	mysql.del('delete from cider.cid_contents where con_no = '+ no +'', function (err, data){
		if(err){
			res.redirect('/adm/contents');
		}else{
			res.redirect('/adm/contents');
		}
    });
});

router.get('/contents/detail/:no', ensureAuthenticated, function(req, res, next) {
	
	var CP = 1;
	var no = req.params.no;
	var cate;
	var user;
	
	mysql.select('select * from cider.cid_con_cate', function (err, data){
		if(err){
			res.redirect('back');
		}
			mysql.select('select c.con_no, c.con_category, c.con_writer, c.con_title, c.con_content, c.con_photo, c.con_viewCount, c.con_regDate, c.con_upDate, c.con_likeCnt, c.comment_no, c.user_no, c.user_comment, c.con_release, u.user_email, u.user_name, u.user_profile_img, u.user_sns_url, u.user_sns_icon from cider.cid_contents c left join cider.cid_user u on u.user_no = c.user_no and u.user_level = "2" where 1=1 and c.con_no = '+no+'', function (err, data2){
				if(err){
					res.redirect('back');
				}
				mysql.select('select * from cider.cid_user where user_level="2"', function (err, data3){
					if(err){
						res.redirect('back');
					}
					user = data3;
					console.log(user);
					res.render('admin/contents/update', {contents : data2, CP : CP, cate : data, user : user});
					
			    });
				
			});
		
    });
	
});


router.post('/pop_ck', ensureAuthenticated, function(req, res, next) {
	
	var CP = 1;
	
	var pop_ck = req.body.pop_ck;
	var sets = { con_no : pop_ck };
	mysql.update('update cider.cid_contents set con_pop= 1  where con_no = ?', [pop_ck], function (err, data){
		
    	res.redirect('/adm/contents');
    	
    });
});
router.post('/pop_ck_default', ensureAuthenticated, function(req, res, next) {
	
	var CP = 0;
	
	var pop_ck = req.body.pop_ck;
	var sets = { con_no : pop_ck };
	mysql.update('update cider.cid_contents set con_pop= 0 where con_no = ?', [pop_ck], function (err, data){
		
    	res.redirect('/adm/index');
    	
    });
});

router.get('/lecture', ensureAuthenticated, function(req, res, next) {
	var CP = 2;
			 res.render('admin/lecture/lecture_index', { CP : CP });
		});

router.get('/lecture/insert', ensureAuthenticated, function(req, res, next) {
	
	var CP = 2;
	var cate;
	mysql.select('select * from cider.cid_lec_cate', function (err, data){
		if(err){
			res.redirect('back');
		}
		cate = data;
			res.render('admin/lecture/insert', {cate : cate, CP : CP});
			});
		});

router.get('/lecture/files/:page', ensureAuthenticated, function(req, res, next){
	var page;
	if (typeof req.params.page == 'undefined'){
		page = 1;
	}
	page = req.params.page;
	var obj = [];
	var start = (page - 1) * 9;
	var end = page * 9 -1;
	var dir = __dirname + "/../public/page_imgs/lecture_img/";
	var files = fs.readdirSync(dir)
	    .map(function(v) {
	        return { name:v,
	                 time:fs.statSync(dir + v).mtime.getTime()
	               }; 
	     })
	     .sort(function(a, b) { return a.time - b.time; })
	     .map(function(v) { return v.name; });
	
	files.reverse();
	for (var i = start; i < end+1; i++){
		obj.push(files[i]);
	}
	var pagination = [];
	var totalPage = Math.ceil(files.length / 9);
	var startPage;
	var lastPage;
	if(page % 5 != 0){ startPage = Math.floor(page/5) * 5 + 1; lastPage = Math.ceil(page/5) * 5; }
	else{ startPage = (page/5) * 5 - 4; lastPage = parseInt(page) };
	
	var next = true;
	
	if (lastPage >= totalPage){
		lastPage = totalPage;
		next = false;
	}
	pagination.push(totalPage, startPage, lastPage, next, parseInt(page));
	res.send({'pagination' : pagination, 'files': obj});
});

router.post('/lecture/insert/upload', ensureAuthenticated, function(req, res, next) {
	var form = new formidable.IncomingForm();
	form.parse(req);
    form.on("file", function (name, file){
        fs.readFile(file.path, function(error, data){
        	var filePath = __dirname + '/../public/page_imgs/lecture_img/' + file.name;
        	fs.writeFile(filePath, data, function(error){
        		if(error){
        			//throw err;
        			//res.redirect('back');
        		}else {
        		}
        	});

        });
    });
    form.on("end", function() {
		  res.redirect('back');
		});
});

router.get('/lecture/list', ensureAuthenticated, function(req, res, next) {
	var CP = 2;
		mysql.select('SELECT * from cider.cid_applyform order by app_no desc;', function (err, data){
			console.log(CP);
			 res.render('admin/lecture/lecture_list', { CP : CP, lecture : data });	    	
		});
});

router.get('/lecture/detail/:app_no', ensureAuthenticated, function(req, res, next) {
	
	var CP = 2;
	var app_no = req.params.app_no;
	
	mysql.select('select * from cider.cid_applyform', function (err, data2){
		if(err){
			res.redirect('back');
		}
		user = data2;
		mysql.select('select * from cider.cid_applyform where app_no = '+ app_no +'', function (err, data){
			if(err){
				res.redirect('back');
			}
			res.render('admin/lecture/lecture_detail', {CP : CP, lecture : data});
		});
    });
});


router.post('/lecture/detail/update', ensureAuthenticated, function(req, res, next) {

	
	var CP = 2;
	
	var app_no = req.body.app_no;
	var app_process = req.body.app_process;
	
	//console.log(app_process);
	//console.log(app_no);
	
	var date = getWorldTime(+9);
	
	var sets = {app_no : app_no, app_process : app_process, app_upDate : date };
	
	mysql.update('update cider.cid_applyform set app_process = ?, app_upDate = ? where app_no = ?', [app_process,date,app_no], function (err, data){
		
    	res.redirect('/adm/lecture/list/');
    	
    });
});

router.get('/lecture/list/delete/:app_no', function(req, res, next) {
	
	var CP = 2;
	var app_no = req.params.app_no;
	
	mysql.del('delete from cider.cid_applyform where app_no = '+ app_no +'', function (err, data){
		if(err){
			res.redirect('/adm/lecture/list');
		}else{
			res.redirect('/adm/lecture/list');
		}
    });
});


router.get('/finance', ensureAuthenticated, function(req, res, next) {
	var CP = 3;
		mysql.select('SELECT * from cider.cid_fi_applyform order by fi_app_no desc;', function (err, data){
			console.log(CP);
			 res.render('admin/finance/finance_index', { CP : CP, finance : data });	    	
		});
});

router.get('/finance/detail/:fi_app_no', ensureAuthenticated, function(req, res, next) {
	
	var CP = 3;
	var fi_app_no = req.params.fi_app_no;
	
	mysql.select('select * from cider.cid_fi_applyform', function (err, data2){
		if(err){
			res.redirect('back');
		}
		user = data2;
		mysql.select('select * from cider.cid_fi_applyform where fi_app_no = '+ fi_app_no +'', function (err, data){
			if(err){
				res.redirect('back');
			}
			res.render('admin/finance/finance_detail', {CP : CP, finance : data});
		});
    });
});


router.get('/finance/delete/:fi_app_no', function(req, res, next) {
	
	var CP = 3;
	var fi_app_no = req.params.fi_app_no;
	
	mysql.del('delete from cider.cid_fi_applyform where fi_app_no = '+ fi_app_no +'', function (err, data){
		if(err){
			res.redirect('/adm/finance');
		}else{
			res.redirect('/adm/finance');
		}
    });
});





//2016년 8월 25일 기능추가
//관리자 입력 오류 부분 때문에 임시로 만든 부분
//더미 자동생성 버튼
router.get('/contents/insert2', ensureAuthenticated, function(req, res, next) {

var CP = 1;
var now = new Date();
var _year= now.getFullYear();
var _mon = now.getMonth()+2;
  console.log(_mon);
 _mon=""+_mon;
 if (_mon.length < 2 )
 {
    _mon="0"+_mon;
 }
  var _date=now.getDate();
  console.log(_date);
  _date =""+_date;
  if (_date.length < 2 )
	 {
	    _date="0"+_date;
	 }
  var _hor = now.getHours() +2;
  console.log(_hor);
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
var title = "더미";
var contents = " ";
var category = "1";
var photo = "/uploads/leverage-in-the-financial-markets.jpg";
var userNo = "";
var writer = "";
var userText ="";
var date = getWorldTime(+9);
var cdate = _tot;
var sets = {con_category : category, con_title : title, con_content : contents, con_photo : photo, con_viewCount : 0, con_regDate : date, con_upDate : date, con_writer : writer, user_no : userNo, user_comment : userText,con_release : cdate};

mysql.insert('insert into cider.cid_contents set ?', sets,  function (err, data){
    res.redirect('/adm/contents');
    
 });
});


//토론

router.get('/discuss', ensureAuthenticated, function(req, res, next) {
	var CP = 4;
	var askval;
	mysql.select('SELECT * from cider.cid_dis_reg order by dis_no desc;', function (err, data){

		mysql.select('select * from cider.cid_dis_ask order by disAsk_no desc;', function(err,data2){

			askval = data2;
			mysql.select('select * from cider.cid_dis_declar order by disDec_no desc;', function(err,data3){
				declar = data3;

	res.render('admin/discuss/discuss_index', { CP : CP, discuss : data, askval : askval, declar:declar });
	 });
	});    	
  });
});

router.get('/discuss/insert', ensureAuthenticated, function(req, res, next) {
	var CP = 4;
	var cate;
	mysql.select('select * from cider.cid_dis_cate', function (err, data){
		if(err){
			res.redirect('back');
		}
		res.render('admin/discuss/discuss_insert',  {cate : data, CP : CP});
	});
});


/* 정체를 알 수 없는 코드... 내가 이걸 어케 한거지;;
router.post("/discuss/insert/upload", upload.any(), function(req, res, next) {
	var table = {}
	var keys = Object.keys(req.files);
	keys.forEach(function(key) {
		var file = req.files[key];
		table[file.fieldname] = "/discuss_imgs/"+file.originalname;
	});
});
*/
router.post('/discuss/insert', ensureAuthenticated, function(req, res, next) {
	
	var CP = 4;

	var title = req.body.title;
	var category = req.body.category;
	var photo = req.body.photo;
	var writer = req.body.writer;
	var comt_1 = req.body.comt_1;
	var comt_2 = req.body.comt_2;
	var date = getWorldTime(+9);
	var rdate = req.body.rdate;
	var no = req.body.no;

	var sets = {dis_cate : category, dis_writer : writer, dis_title:title, dis_thum:photo,dis_comt_1:comt_1, dis_comt_2:comt_2, dis_comt_3:"기타",dis_regdate:date, dis_update:date,dis_view:0,dis_release:rdate};
	mysql.insert('insert into cider.cid_dis_reg set ?', sets,  function (err, data){
		if(no == null){
			res.redirect('/adm/discuss');
		}
		else{
		mysql.del('delete from cider.cid_dis_ask where disAsk_no = '+ no +'', function (err, data){

		res.redirect('/adm/discuss');
		});
		}
	});
});




router.get('/discuss/insert_2/:disAsk_no', ensureAuthenticated, function(req, res, next) {
	var CP = 4;
	var no = req.params.disAsk_no;

	mysql.select('select * from cider.cid_dis_cate', function (err, data){
		if(err){
			res.redirect('back');
		}

		mysql.select('select * from cider.cid_dis_ask where disAsk_no = '+ no +'', function (err, data2){
			if(err){
				res.redirect('back');
			}

		res.render('admin/discuss/discuss_insert2',  {cate : data, CP : CP, askval:data2});
	});
  });
});



router.get('/discuss/files/:page', ensureAuthenticated, function(req, res, next){
	var page;
	if (typeof req.params.page == 'undefined'){
		page = 1;
	}
	page = req.params.page;
	var obj = [];
	var start = (page - 1) * 12;
	var end = page * 12 -1;
	
	var dir = __dirname + "/../public/discuss_imgs/";
	console.log(dir);
	var files = fs.readdirSync(dir)
	    .map(function(v) {
	        return { name:v,
	                 time:fs.statSync(dir + v).mtime.getTime()
	               }; 
	     })
	     .sort(function(a, b) { return a.time - b.time; })
	     .map(function(v) { return v.name; });
	
	files.reverse();
	for (var i = start; i < end+1; i++){
		obj.push(files[i]);
	}
	var pagination = [];
	var totalPage = Math.ceil(files.length / 12);
	var startPage;
	var lastPage;
	if(page % 5 != 0){ startPage = Math.floor(page/5) * 5 + 1; lastPage = Math.ceil(page/5) * 5; }
	else{ startPage = (page/5) * 5 - 4; lastPage = parseInt(page) };
	
	var next = true;
	
	if (lastPage >= totalPage){
		lastPage = totalPage;
		next = false;
	}
	pagination.push(totalPage, startPage, lastPage, next, parseInt(page));
	res.send({'pagination' : pagination, 'files': obj});
});

router.get('/discuss/detail/:dis_no', ensureAuthenticated, function(req, res, next) {
	var CP= 4;
	var no = req.params.dis_no;
	console.log(no);
	mysql.select('select * from cider.cid_dis_cate', function (err, data2){
		if(err){
			res.redirect('back');
		}

		mysql.select('select * from cider.cid_dis_reg where dis_no ='+no+'', function(err,data){
			if(err){
				res.redirect('back');
			}
			console.log(data);
		res.render('admin/discuss/discuss_update',{ CP:CP, discuss:data, cate:data2});
	});
  });
});


router.post('/discuss/update', ensureAuthenticated, function(req, res, next) {
	
	var CP = 1;
	
	var title = req.body.title;
	var category = req.body.category;
	var photo = req.body.photo;
	var writer = req.body.writer;
	var comt_1 = req.body.comt_1;
	var comt_2 = req.body.comt_2;
	var date = getWorldTime(+9);
	var rdate = req.body.rdate;
	var no = req.body.dis_no;

	var date = getWorldTime(+9);
	
	var sets = {dis_no : no, dis_cate : category, dis_writer : writer, dis_title:title, dis_thum:photo,dis_comt_1:comt_1, dis_comt_2:comt_2 , dis_update:date, dis_release:rdate};
	console.log(sets);
	mysql.update('update cider.cid_dis_reg set dis_cate = ?,  dis_writer = ?, dis_title = ?, dis_thum = ?,  dis_comt_1 = ?, dis_comt_2 = ?, dis_update = ? ,dis_release= ? where dis_no = ?', [category,writer,title,photo,comt_1,comt_2,date,rdate,no], function (err, data){
		
    	res.redirect('/adm/discuss');
    	
    });
});


router.get('/discuss/delete/:no', function(req, res, next) {
	
	var CP = 3;
	var no = req.params.no;
	
	mysql.del('delete from cider.cid_dis_reg where dis_no = '+ no +'', function (err, data){
		if(err){
			res.redirect('/adm/discuss');
		}else{
			res.redirect('/adm/discuss');
		}
    });
});

router.get('/discuss/askdelete/:no', function(req, res, next) {
	
	var CP = 3;
	var no = req.params.no;
	
	mysql.del('delete from cider.cid_dis_ask where disAsk_no = '+ no +'', function (err, data){
		if(err){
			res.redirect('/adm/discuss');
		}else{
			res.redirect('/adm/discuss');
		}
    });
});

router.get('/discuss/comtlist', ensureAuthenticated, function(req, res, next) {
	var CP = 4;
	//mysql.select('(SELECT dis_no,comt_no,"" as comtco_no,comt_writer,comt_regdate from cider.cid_dis_comt) UNION (SELECT "",comt_no,comtco_no as comtco_no,comtco_writer,comtco_date FROM cider.cid_dis_comt_comt)order by comt_regdate desc;', function (err, data){
	mysql.select('SELECT * from cider.cid_dis_comt order by comt_regdate desc;', function (err, data){

		var comtlist = data;

	res.render('admin/discuss/discuss_comtlist', { CP : CP, comtlist:data });
  });
});

router.get('/discuss/comtcolist', ensureAuthenticated, function(req, res, next) {
	var CP = 4;
	//mysql.select('(select dis_no,comt_no,"" as comtco_no,"" as comtco_writer, "" as comtco_text,"" as comtco_date from cider.cid_dis_comt) UNION (select "",comt_no,comtco_no,comtco_writer, comtco_text, comtco_date from cider.cid_dis_comt_comt) order by comtco_date desc;', function (err, data){
	mysql.select('SELECT * FROM cider.cid_dis_comt_comt order by comtco_date desc;', function (err, data){
		var comtlistco = data;
		console.log(comtlistco);

	res.render('admin/discuss/discuss_comtcolist', { CP : CP, comtlistco:data });
	});
 });

/* comtcolist Ajax */
router.get('/gotoComtNo/:comtco_no', function(req,res,next){
	var comtco_no = req.params.comtco_no;

	mysql.select('SELECT dis_no FROM cider.cid_dis_comt where comt_no='+comtco_no+'',function(err,data){
		console.log(data);
		res.send({disno:data});
	});

});

router.get('/discuss/comtdelete/:no', function(req, res, next) {
	
	var CP = 3;
	var no = req.params.no;
	
	mysql.del('delete from cider.cid_dis_comt where comt_no = '+ no +'', function (err, data){
		if(err){
			res.redirect('/adm/discuss/comtlist');
		}else{
			res.redirect('/adm/discuss/comtlist');
		}
    });
});

router.get('/discuss/comtcodelete/:no', function(req, res, next) {
	
	var CP = 3;
	var no = req.params.no;
	
	mysql.del('delete from cider.cid_dis_comt_comt where comtco_no = '+ no +'', function (err, data){
		if(err){
			res.redirect('/adm/discuss/comtcolist');
		}else{
			res.redirect('/adm/discuss/comtcolist');
		}
    });
});

router.get('/discuss/declarComtdelete/:no&:decno', function(req, res, next) {
	
	var CP = 3;
	var no = req.params.no;
	var decno = req.params.decno;
	
	mysql.del('delete from cider.cid_dis_comt where comt_no = '+ no +'', function (err, data){
		mysql.del('delete from cider.cid_dis_declar where disDec_no = '+ decno +'', function (err, data){
		if(err){
			res.redirect('/adm/discuss');
		}else{
			res.redirect('/adm/discuss');
		}
	  });
    });
});

router.get('/discuss/declarComtdelete2/:no&:decno', function(req, res, next) {
	
	var CP = 3;
	var no = req.params.no;
	var decno = req.params.decno;
	
	mysql.del('delete from cider.cid_dis_comt_comt where comtco_no = '+ no +'', function (err, data){
		mysql.del('delete from cider.cid_dis_declar where disDec_no = '+ decno +'', function (err, data){
		if(err){
			res.redirect('/adm/discuss');
		}else{
			res.redirect('/adm/discuss');
		}
	  });
    });
});


router.get('/discuss/declardelete/:no', function(req, res, next) {
	
	var CP = 3;
	var no = req.params.no;
	
	mysql.del('delete from cider.cid_dis_declar where disDec_no = '+ no +'', function (err, data){
		if(err){
			res.redirect('/adm/discuss');
		}else{
			res.redirect('/adm/discuss');
		}
    });
});

//설문조사 2017 4월 19일



router.get('/survey', ensureAuthenticated, function(req, res, next) {
	var CP = 5;
		mysql.select('SELECT * from cider.cid_survey order by sry_no desc;', function (err, data){
			mysql.select('SELECT count(*) as sry FROM cider.cid_survey;', function (err, data1){
			res.render('admin/survey/survey_index', { CP : CP, survey : data, sryAll:data1 });	    	
		});
	});
});

router.get('/survey/detail/:sry_no', ensureAuthenticated, function(req, res, next) {
	
	var CP = 5;
	var sry_no = req.params.sry_no;
	
	mysql.select('select * from cider.cid_survey', function (err, data2){
		if(err){
			res.redirect('back');
		}
		user = data2;
		mysql.select('select * from cider.cid_survey where sry_no = '+ sry_no +'', function (err, data){
			if(err){
				res.redirect('back');
			}
			res.render('admin/survey/survey_detail', {CP : CP, survey : data});
		});
    });
});


router.get('/survey/delete/:sry_no', function(req, res, next) {
	
	var CP = 5;
	var sry_no = req.params.sry_no;
	
	mysql.del('delete from cider.cid_survey where sry_no = '+ sry_no +'', function (err, data){
		if(err){
			res.redirect('/adm/survey');
		}else{
			res.redirect('/adm/survey');
		}
    });
});



router.get('/consulting', ensureAuthenticated, function(req, res, next) {
	var CP = 9;
	mysql.select('select * from cider.cid_consulting order by cons_no desc', function (err, data){
		 res.render('admin/consulting/consulting', { CP : CP, consulting : data });
	});
	
});

router.post('/consulting/insert',  function(req, res, next) {
	var CP = 9;
	
	var contents = req.body.contents;
	var url = req.body.url;
	var name = req.body.name;
	var photo = req.body.photo;
	var date = getWorldTime(+9);
	
	var sets = {cons_name : name, cons_img : photo, cons_site_url : url, cons_content : contents, cons_regDate : date, cons_upDate : date };
	//console.log('insert into cider.cid_consulting set ? '+sets);
	mysql.insert('insert into cider.cid_consulting set ?', sets,  function (err, data){
		
		console.log(err);
		console.log(data);
		
    	res.redirect('/adm/consulting');
    	if (err){
    		res.redirect('/adm/consulting');
    	}
    });
});

router.get('/consulting/insert', ensureAuthenticated, function(req, res, next) {
	
	var CP = 9;
	res.render('admin/consulting/insert', { CP : CP });
	
});

router.get('/consulting/detail/:no', ensureAuthenticated, function(req, res, next) {
	
	var CP = 9;
	var no = req.params.no;
	var user;
	
	mysql.select('select * from cider.cid_user where user_level="2"', function (err, data2){
		if(err){
			res.redirect('back');
		}
		user = data2;
		mysql.select('select * from cider.cid_consulting where cons_no = '+ no +'', function (err, data){
			if(err){
				res.redirect('back');
			}
			res.render('admin/consulting/update', {consulting : data, CP : CP, user: user});
		});
    });
});

router.post('/consulting/update', ensureAuthenticated, function(req, res, next) {
	
	var CP = 9;
	
	var no = req.body.no;
	var name = req.body.name;
	var contents = req.body.contents;
	var img = req.body.photo;
	var url = req.body.url;
	var date = getWorldTime(+9);
	
	var sets = {cons_no : no, cons_name : name, cons_content : contents, cons_img : img, cons_site_url : url, cons_upDate : date };
	//mysql.update('update cider.cid_consulting set cons_name = :cons_name,  cons_img = :cons_img, cons_site_url = :cons_site_url, cons_content = :cons_content,  cons_upDate = :cons_upDate where cons_no = :cons_no', sets, function (err, data){
	mysql.update('update cider.cid_consulting set cons_name = ?,  cons_img = ?, cons_site_url = ?, cons_content = ?,  cons_upDate = ? where cons_no = ?', [name,img,url,contents,date,no], function (err, data){
    	res.redirect('/adm/consulting');
    	
    });
});


router.get('/consulting/delete/:no', ensureAuthenticated, function(req, res, next) {
	
	var CP = 9;
	var no = req.params.no;
	
	mysql.del('delete from cider.cid_consulting where cons_no = '+ no +'', function (err, data){
		if(err){
			res.redirect('/adm/consulting');
		}else{
			res.redirect('/adm/consulting');
		}
    	
    });
});
function ensureAuthenticated(req, res, next) {
    // 로그인이 되어 있으면, 다음 파이프라인으로 진행
    if (req.isAuthenticated()) { return next(); }
    // 로그인이 안되어 있으면, login 페이지로 진행
    res.redirect('/adm');
}

module.exports = router;
