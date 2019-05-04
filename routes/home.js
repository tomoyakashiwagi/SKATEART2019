var express = require('express');
var router = express.Router();
var mysql = require('mysql');



//新規作成ページへのアクセス
router.get('/', (req, res, next) => {
    var data = {
        // title: 'Hello/home',
        // content: 'new records：'
    }
    res.render('home', data);
});




module.exports = router;
console.log('start!');
