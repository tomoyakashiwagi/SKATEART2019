var express = require('express');
var router = express.Router();
var mysql = require('mysql');

var mysql_setting = {
  host: '127.0.0.1',
  user: 'root',
  password: '',
  database: 'my-nodeapp-db',
}

/* GET home page. */
router.get('/', function (req, res, next) {
  res.render('index', { title: 'Express', content: 'ようこそ' });
});

module.exports = router;
