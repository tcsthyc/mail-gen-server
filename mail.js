var nodemailer = require('nodemailer');
var smtpTransport = require('nodemailer-smtp-transport');
var config = require('./config.json');


/**
data param sample:
{
  type: 'text' // text & html
  content: ''  // text content or html content
}
*/

var send = function(data){
  var transporter = nodemailer.createTransport(smtpTransport(config.mailBindingOption));

  var options = config.mailOptions;
  if(data.type === 'text'){
    options.subject = 'text';
    options.text = data.content;
  }
  else if(data.type === 'html'){
    options.subject = 'html';
    options.html = data.content;
  }

  transporter.sendMail(options, function(error, info){
      if(error){
          return console.log(error);
      }
      console.log('Message sent: ' + info.response);
  });
}

exports.send = send;