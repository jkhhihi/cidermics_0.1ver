var nodemailer = require('nodemailer');

var smtpTransport = nodemailer.createTransport({  
    service: 'Gmail',
    auth: {
        user: 'JeongKH91@gmail.com',
        pass: 'rlgnsdlek2'
    }
});

var mailOptions = {  
    from: 'jeongkh91@gmail.com',
    to: 'cidermics@naver.com',
    subject: 'Nodemailer 테스트 김의현이당',
    text: '평문 보내기 테스트 흐아아앙 '
};

smtpTransport.sendMail(mailOptions, function(error, response){

    if (error){
        console.log(error);
    } else {
        console.log("Message sent : " + response.message);
    }
    smtpTransport.close();
});