
var koa = require('koa');
var app = koa();
var serve = require('koa-static');
var router = require('koa-router')();
var views = require("co-views");
var render = views("localFiles", { map: { html: 'swig' }});
var src_mail_templ = __dirname + '/localFiles/mail.html';
var fs = require('fs');
var bodyParser = require('koa-bodyparser');
var StringDecoder = require('string_decoder').StringDecoder;
var decoder = new StringDecoder('utf8');
var mail = require('./mail.js');


var readFileThunk = function(src) {
  return new Promise(function (resolve, reject) {
    fs.readFile(src, function (err, data) {
      if(err) return reject(err);
      var result = decoder.write(data);
      resolve(result);
    });
  });
}

var writeFileThunk = function(filePath,data){
  return new Promise(function (resolve, reject) {
    fs.writeFile(filePath, data, function (err) {
      if (err) return reject(err);
      resolve('1');
    });
  });
}

router.get('/generate',function*(next){
  var data = {
    name: "woooooooooooooorld",
    pagename: 'awesome people',
    authors: ['Paul', 'Jim', 'Jane']
  }
  var output = yield render('mail',data);
  console.log(output);
  var result = yield writeFileThunk('dest/mail.html',output);
  this.body = 'suc, plz look at dest/mail.html';
  yield next;
});

// router.get('/gen',function*(next){
//   var renderParams = {name:"hellllooooo"};
//   var data = yield readFileThunk(src_mail_templ,renderParams);
//   var result = yield writeFileThunk(data);
//   this.body = result;
//   yield next;
// })

router.post('/gen-mail',function*(next){
  console.log(this.request.body);
  if(this.request.body){
    var content = yield render('mail',this.request.body);
    yield writeFileThunk('dest/mail.html',content);
    this.body = 'suc, plz check dest/mail.html!';
    if(this.body.sendMail){
      var mailConfig = {
        type: 'html',
        content: content
      }
      mail.send(mailConfig);
    }
  }
  else{
    this.body = 'err, no data!!';
  }
  yield next;
});

router.get('/send_sample',function*(next){
  var data = {
    name: "woooooooooooooorld",
    pagename: 'awesome people',
    authors: ['Paul', 'Jim', 'Jane']
  }
  var content = yield render('mail',data);
  var mailConfig = {
      type: 'html',
      content: content
  }
  mail.send(mailConfig);  
});


app.use(bodyParser());
app.use(router.routes());
app.use(serve(__dirname+'/static-views'));


app.listen(3000);
console.log('server started');




