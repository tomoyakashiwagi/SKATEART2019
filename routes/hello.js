var express = require('express');
var router = express.Router();
var mysql = require('mysql');


var knex = require('knex')({
    client: 'mysql',
    connection: {
        host: '127.0.0.1',
        user: 'root',
        password: '',
        database: 'my-nodeapp-db',
        charset: 'utf8'
    }
});

var Bookshelf = require('bookshelf')(knex);
var MyData = Bookshelf.Model.extend({
    tableName: 'user'
});


var mysql_setting = {
    host: '127.0.0.1',
    user: 'root',
    password: '',
    database: 'my-nodeapp-db',
}


/* GET home page. */
router.get('/', (req, res, next) => {
    new MyData().fetchAll().then((collection) => {
        var data = {
            title: 'Helli!',
            content: collection.toArray()
        };
        res.render('hello/index', data);
    })
        .catch((error) => {
            res.status(500).json({ error: true, data: { message: err.message } });
        });
});

//新規作成ページへのアクセス
router.get('/add', (req, res, next) => {
    var data = {
        title: 'Hello/Add',
        content: 'new records：',
        form: { mail: '', language: '', country: '', address: '' }
    }
    res.render('hello/add', data);
});

// Bookshelf版
//新規作成フォーム送信の処理
router.post('/add', (req, res, next) => {
    var response = res;
    new MyData(req.body).save().then((model) => {
        response.redirect('/hello');
    });
});

// Bookshelf版検索
router.get('/find', (req, res, next) => {
    var data = {
        title: '/Hello/Find',
        content: '検索IDを入力：',
        form: { fstr: '' },
        user: null
    };
    res.render('hello/find', data);
});

router.post('/find', (req, res, next) => {
    new MyData().where('id', '=', req.body.fstr).fetch().
        then((collection) => {
            var data = {
                title: 'Hello!',
                content: '※id=' + req.body.fstr + ' の検索結果：',
                form: req.body,
                user: collection
            };
            res.render('hello/find', data);
        })
});



//指定IDのレコードを表示する
router.get('/show', (req, res, next) => {
    var id = req.query.id;

    //データベースの設定情報
    var connection = mysql.createConnection(mysql_setting);

    connection.connect();

    //データを取り出す
    connection.query('SELECT * from user where id=?', id,
        function (error, results, fields) {
            //データベースアクセス完了時の処理
            if (error == null) {
                var data = {
                    title: 'Hello/show',
                    content: 'id=' + id + 'のレコード',
                    user: results[0]
                }
                res.render('hello/show', data);
            }
        });
    connection.end();
});


//指定レコードの編集
router.get('/edit', (req, res, next) => {
    var id = req.query.id;

    //データベースの設定情報
    var connection = mysql.createConnection(mysql_setting);
    //データベースに接続
    connection.connect();

    //データを取り出す
    connection.query('SELECT * from user where id=?', id,
        function (error, results, fields) {
            if (error == null) {
                var data = {
                    title: 'Hello/edit',
                    content: 'id=' + id + 'のレコード：',
                    user: results[0]
                };
                res.render('hello/edit', data);
            }
        });
    connection.end();
});

//編集フォーム送信の編集
router.post('/edit', (req, res, next) => {
    var id = req.body.id;
    var ml = req.body.mail;
    var la = req.body.language;
    var co = req.body.country;
    var ad = req.body.address;
    var data = {
        'mail': ml, 'language': la, 'country': co, 'address': ad
    };
    //データベースの設定情報
    var connection = mysql.createConnection(mysql_setting);
    //データベースに接続
    connection.connect();
    //データを取り出す
    connection.query('UPDATE user set ? where id = ? ', [data, id],
        function (error, results, fields) {
            res.redirect('/hello');
        });
    connection.end();
});


//指定レコードを削除
router.get('/delete', (req, res, next) => {
    var id = req.query.id;
    var connection = mysql.createConnection(mysql_setting);
    connection.connect();
    connection.query('select * from user where id = ? ', id,
        function (error, results, fields) {
            if (error == null) {
                var data = {
                    title: 'Hello/delete',
                    content: 'id=' + id + 'のレコード:',
                    user: results[0]
                }
                // alert('are you sure?');
                res.render('hello/delete', data);
            }
        });
    connection.end();
});
//削除フォームの送信処理
router.post('/delete', (req, res, next) => {
    var id = req.body.id;
    var connection = mysql.createConnection(mysql_setting);
    connection.connect();
    connection.query('delete from user where id = ? ', id,
        function (error, results, fields) {
            res.redirect('/hello');
        });
    connection.end();
});


Bookshelf.plugin('pagination');  //fetchpage追加

router.get('/:page', (req, res, next) => {
    var pg = req.params.page;
    pg *= 1;
    if (pg < 1) {
        pg = 1;
    }
    new MyData().fetchPage({ page: pg, pageSize: 10 }).then((collection) => {
        var data = {
            title: 'Hello!',
            content: collection.toArray(),
            pagination: collection.pagination
        };
        console.log(collection.pagination);
        res.render('hello/index', data);
    })
        .catch((err) => {
            res.status(500).json({ error: true, data: { message: err.message } });

        });
});

module.exports = router;
console.log('start!');
