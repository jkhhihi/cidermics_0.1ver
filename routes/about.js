var express = require('express');
var router = express.Router();
//var mysql = require("./model/mysql");

router.get('/contact', function(req, res, next) {

	res.render('front/cid_about/cid_contact', { });

});

router.get('/our_company', function(req, res, next) {

	res.render('front/cid_about/cid_our_company', { });

});

router.get('/our_team', function(req, res, next) {

	res.render('front/cid_about/cid_our_team', { });

});


module.exports = router;
