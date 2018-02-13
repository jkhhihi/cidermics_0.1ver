var express = require('express');
var router = express.Router();
var mysql = require("./model/mysql");

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


/* GET home page. */


router.get('/pay', function(req, res, next) {

	var subject = req.query.subject;
	var cate = req.query.cate;
	var detailCate = req.query.detailCate;
	var price = req.query.price;

	res.render('front/pay/pay_idx', {subject:subject, cate:cate, detailCate:detailCate, price:price});
});

router.get('/paygo/:ORDERNO/:PRODUCTCATE/:PRODUCTDETAILCATE/:AMOUNT', function(req,res,next){
	var ORDERNO = req.params.ORDERNO;
	var PRODUCTCATE = req.params.PRODUCTCATE;
	var PRODUCTDETAILCATE = req.params.PRODUCTDETAILCATE;
	var AMOUNT = req.params.AMOUNT;
	var date = getWorldTime(+9);

	res.render('front/pay/pay_go',{ORDERNO:ORDERNO, PRODUCTCATE:PRODUCTCATE, PRODUCTDETAILCATE:PRODUCTDETAILCATE, AMOUNT:AMOUNT, date:date });

});

router.get('/paydone/:ORDERNO/:PRODUCTCATE/:PRODUCTDETAILCATE/:AMOUNT', function(req,res,next){
	var ORDERNO = req.params.ORDERNO;
	var PRODUCTCATE = req.params.PRODUCTCATE;
	var PRODUCTDETAILCATE = req.params.PRODUCTDETAILCATE;
	var AMOUNT = req.params.AMOUNT;
	var date = getWorldTime(+9);

	res.render('front/pay/pay_done',{ORDERNO:ORDERNO, PRODUCTCATE:PRODUCTCATE, PRODUCTDETAILCATE:PRODUCTDETAILCATE, AMOUNT:AMOUNT, date:date });

});

/*router.get('/finbook_ch/:ORDERNO', function(req,res,next){
	var ORDERNO = req.params.ORDERNO;

	var date = getWorldTime(+9);
	var sets = {ORDERNO : ORDERNO, payDate:date, flag:'Y'};

	mysql.insert('insert into cider.fin_order set ?', sets,  function (err, data){
		if(err){
			res.redirect('back');
		}

	res.render('front/etc/finbook/finbook_ch_purchase',{ORDERNO:ORDERNO, date:date});
	});
});
*/

/* Nuborich */

router.get('/paynubo', function(req, res, next) {

	var subject = req.query.subject;
	var cate = req.query.cate;
	var detailCate = req.query.detailCate;
	var price = req.query.price;

	res.render('front/pay/nubo_pay_idx', {subject:subject, cate:cate, detailCate:detailCate, price:price});
});


router.get('/paygonubo/:ORDERNO/:PRODUCTCATE/:PRODUCTDETAILCATE/:AMOUNT', function(req,res,next){
	var ORDERNO = req.params.ORDERNO;
	var PRODUCTCATE = req.params.PRODUCTCATE;
	var PRODUCTDETAILCATE = req.params.PRODUCTDETAILCATE;
	var AMOUNT = req.params.AMOUNT;
	var date = getWorldTime(+9);

	res.render('front/pay/nubo_pay_go',{ORDERNO:ORDERNO, PRODUCTCATE:PRODUCTCATE, PRODUCTDETAILCATE:PRODUCTDETAILCATE, AMOUNT:AMOUNT, date:date });
});

router.get('/paydone/:ORDERNO/:PRODUCTCATE/:PRODUCTDETAILCATE/:AMOUNT', function(req,res,next){
	var ORDERNO = req.params.ORDERNO;
	var PRODUCTCATE = req.params.PRODUCTCATE;
	var PRODUCTDETAILCATE = req.params.PRODUCTDETAILCATE;
	var AMOUNT = req.params.AMOUNT;
	var date = getWorldTime(+9);

	res.render('front/pay/nubo_pay_done',{ORDERNO:ORDERNO, PRODUCTCATE:PRODUCTCATE, PRODUCTDETAILCATE:PRODUCTDETAILCATE, AMOUNT:AMOUNT, date:date });
});




module.exports = router;
