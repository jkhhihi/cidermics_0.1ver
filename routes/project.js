var express = require('express');
var router = express.Router();
var mysql = require("./model/mysql");




router.get('/project', function(req, res, next) {

		 res.render('front/cid_project/cid_project', { });
	});


module.exports = router;
