var _ = require('lodash');
var YouBase = require('youbase');

youbase = YouBase('http://localhost:9090');

var algoliasearch = require('algoliasearch');
var client = algoliasearch('APPID', 'APIKey');
var index = client.initIndex('symptoms');

var bodyParser = require('body-parser');
var express = require('express');
var app = express();
var port = 3000;

app.use(bodyParser.text());

app.use(express.static(__dirname + '/public'));

app.post('/index', function (req, res) {
  console.log(req.body);
  doc = youbase.document(req.body);
  doc.fetch().then(function() {
    doc.data().then(function(meta) {
      console.log('meta', meta);
      doc.children.all('meta').then(function(children) {
        index.addObject({
          pub: doc.pub,
          xpub: doc.xpub,
          meta: meta,
          children: children
        }, doc.pub, function(err, content) {
          if (err) { res.status(500).send(err);
          } else {
            res.status(201).send(content);
          }
        });
      });
    });
  });
});

app.use(function (err, req, res, next) {
  console.log(err.stack);
  res.status(500).send();
});

app.listen(port, function () {
  console.log('Seach app listening on port ' + port + '!');
});
