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
router.get('/', (req, res, next) => {

    var connection = mysql.createConnection(mysql_setting);
    //データベースに接続する
    connection.connect();
    //データを取り出す
    connection.query('SELECT * FROM user',
        //コールバック関数でデータを取得
        function (error, results) {
            if (error == null) {
                var data = { title: 'user', content: results };
                res.json(data);
                res.render('hello', data);
            };
        });
    //接続を解除する
    connection.end();
});

router.get('/add', (req, res, next) => {
    var data = {
        title: 'hello/add',
        content: 'new records.'
    };
    res.render('hello/add', data);
});
router.post('/add', (req, res, next) => {
    var ar = req.body.artist;
    var pro = req.body.profile;
    var pl = req.body.place;
    var data = {
        'artist': ar,
        'mail': pro,
        'age': pl,
    };
    var connection = mysql.createConnection(mysql_setting);
    connection.connect();
    //データを取り出す
    connection.query('insert into artist set ?', data,

        function (error, results, fields) {
            res.render('/hello', data);
        });
    //接続を解除する
    connection.end();
});

module.exports = router;
console.log('start!')