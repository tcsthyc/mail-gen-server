var nodemailer = require('nodemailer');
var smtpTransport = require('nodemailer-smtp-transport');


/**
data param sample:
{
  type: 'text' // text & html
  content: ''  // text content or html content
}
*/

var send = function(data){
  var transporter = nodemailer.createTransport(smtpTransport({
      port: 465,
      host: 'smtp.qq.com',
      secure: true,
      auth: {
          user: '245292529',
          pass: 'XXX'
      }
  }));

  var mailOptions;
  if(data.type === 'text'){
    mailOptions = {
      from: '245292529@qq.com', // sender address 
      to: 'vikings825@gmail.com', // list of receivers 
      subject: 'text', // Subject line 
      text: data.content // plaintext body 
    };
  }
  else if(data.type === 'html'){
    mailOptions = {
      from: '245292529@qq.com', // sender address 
      to: 'vikings825@gmail.com', // list of receivers  
      subject: 'html', // Subject line 
      // text: 'Hello world teteteteteasddsads✔' // plaintext body 
      html: data.content // html body 
    };
  }
  transporter.sendMail(mailOptions, function(error, info){
      if(error){
          return console.log(error);
      }
      console.log('Message sent: ' + info.response);
   
  });
}

exports.send = send;