
var koa = require('koa');
var app = koa();
var serve = require('koa-static');
var router = require('koa-router')();
var views = require("co-views");
var render = views("localFiles", { map: { html: 'swig' }});
var src_mail_templ = __dirname + '/localFiles/mail.html';
var mustache = require('mustache');
var fs = require('fs');
var StringDecoder = require('string_decoder').StringDecoder;
var decoder = new StringDecoder('utf8');


var readFileThunk = function(src,renderParams) {
  return new Promise(function (resolve, reject) {
    fs.readFile(src, function (err, data) {
      if(err) return reject(err);
      var result = mustache.render(decoder.write(data),renderParams);
      console.log(result);
      resolve(result);
    });
  });
}

var writeFileThunk = function(data){
  return new Promise(function (resolve, reject) {
    fs.writeFile('dest/mail.html', data, function (err) {
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
  var result = yield writeFileThunk(output);
  this.body = 'suc, plz look at dest/mail.html';
  yield next;
});

router.get('/gen',function*(next){
  var renderParams = {name:"hellllooooo"};
  var data = yield readFileThunk(src_mail_templ,renderParams);
  var result = yield writeFileThunk(data);
  this.body = result;
  yield next;
})

router.post('/gen-mail',function*(){
  console.log(this.params);
  console.log(this.request.body);
  this.body = '1';
});

app.use(serve(__dirname+'/static-views'));
app.use(router.routes());

app.listen(3000);
console.log('server started');




