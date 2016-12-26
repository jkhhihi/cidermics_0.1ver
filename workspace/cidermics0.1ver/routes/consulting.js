var express = require('express');
var router = express.Router();
var mysql = require("./model/mysql");

router.get('/consulting', function(req, res, next) {
	var row;
	mysql.select('select cons_no, cons_img, cons_name, cons_site_url from cider.cid_consulting order by cons_no desc limit 0,12', function (err, data){
		
		if (err) {
			res.redirect('/consulting');
		};
		 
		 row = data;
		 res.render('front/cid_consulting/cid_consulting', { consulting : row });
	});
	
});


router.get('/consulting/detail/:no', function(req, res, next) {
	var no = req.params.no;
	
	mysql.select('select * from cider.cid_consulting where cons_no = '+no+'', function (err, data){
		
		 if (err) {
			 res.redirect('/consulting');
		 };
		 
		 res.render('front/cid_consulting/cid_consulting_detail', { consulting : data });
	});
	

});

module.exports = router;
