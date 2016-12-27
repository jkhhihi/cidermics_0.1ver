var express = require('express');
var router = express.Router();
var mysql = require("./model/mysql");


router.get('/quiz1', function(req, res, next) {

	res.render('front/cid_quiz/cid_quiz_test1', { });

});

router.get('/quiz2', function(req, res, next) {

	res.render('front/cid_quiz/cid_quiz_test2', { });

});

router.get('/quiz3', function(req, res, next) {
	
	//create array
	var questions = [];

	//select db quiz data
	mysql.select('select * from cider.cid_quiz', function (err, data){
	    if (err) throw err;
	    
	    
	    for (var i; i<= data.length; i++) {
	       var quiz_no = data[i].quiz_no;
	       var options = data[i].options;
	       var correctIndex = data[i].correctIndex;
	       var correctResponse = data[i].correctResponse;
	       var incorrectResponse = data[i].incorrectResponse;
	       
	       var obj = new Object();
	       
	       obj.quiz_no = quiz_no;
	       obj.options = options;
	       obj.correctIndex = correctIndex;
	       obj.correctResponse = correctResponse;
	       obj.incorrectResponse = incorrectResponse;
	       
	       questions.push(obj);
	    }
	    res.render('front/cid_quiz/cid_quiz_test3', { questions : questions});
	});
});

module.exports = router;
