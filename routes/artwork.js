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
    connection.query('SELECT * FROM artwork',
        //コールバック関数でデータを取得
        function (error, results) {
            if (error == null) {
                var data = { title: 'Artwork', content: results };
                res.render('artwork', data);
            }
        });
    //接続を解除する
    connection.end();
});

module.exports = router;
