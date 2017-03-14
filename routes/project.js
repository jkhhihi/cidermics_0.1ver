var express = require('express');
var router = express.Router();
var mysql = require("./model/mysql");




router.get('/project', function(req, res, next) {

		 res.render('front/cid_project/cid_project', { });
	});

router.get('/project/in', function(req, res, next) {

		 res.render('front/cid_project/cid_project_in', { });
	});

router.get('/project/detail', function(req, res, next) {

		 res.render('front/cid_project/cid_project_detail', { });
	});

module.exports = router;
