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
    connection.query('SELECT * FROM event',
        //コールバック関数でデータを取得
        function (error, results) {
            if (error == null) {
                var data = { title: 'Event', content: results };
                res.render('event', data);
            };
        });

    //接続を解除する
    connection.end();
});

module.exports = router;
