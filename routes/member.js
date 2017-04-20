var express = require('express');
var router = express.Router();
//var mysql = require("./model/mysql");

router.get('/join_step_1', function(req, res, next) {

	res.render('front/cid_member/cid_join_step_1', { });

});

router.get('/join_step_2', function(req, res, next) {

	res.render('front/cid_member/cid_join_step_2', { });

});

router.get('/join_step_3', function(req, res, next) {

	res.render('front/cid_member/cid_join_step_3', { });

});

router.get('/join', function(req, res, next) {

	res.render('front/cid_member/cid_join', { });

});

router.get('/mem_login', function(req, res, next) {

	res.render('front/cid_member/cid_login', { });

});

router.get('/psearch1', function(req, res, next) {

	res.render('front/cid_member/password_search1', { });

});

router.get('/psearch2', function(req, res, next) {

	res.render('front/cid_member/password_search2', { });

});

router.get('/psearch3', function(req, res, next) {

	res.render('front/cid_member/password_search3', { });

});

router.get('/mypage', function(req, res, next) {

	res.render('front/cid_member/mypage', { });

});

router.get('/meminfo', function(req, res, next) {

	res.render('front/cid_member/memInfo', { });

});

router.get('/memup', function(req, res, next) {

	res.render('front/cid_member/memUpdate', { });

});

router.get('/passup', function(req, res, next) {

	res.render('front/cid_member/passUpdate', { });

});

router.get('/memdel', function(req, res, next) {

	res.render('front/cid_member/memDelete', { });

});
module.exports = router;
