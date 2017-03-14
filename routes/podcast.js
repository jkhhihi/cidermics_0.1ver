var express = require('express');
var router = express.Router();
var mysql = require("./model/mysql");




router.get('/podcast', function(req, res, next) {

		 res.render('front/cid_podcast/cid_podcast', { });
	});


module.exports = router;
