const express = require("express");

const app = express();

const session = require('express-session');

const fs = require('fs');

const path = require('path')
// 注册session中间件
app.use(
    session({
        secret:'这是加密的密钥',
        resave: false,
        saveUninitialized: false
    })
)

app.set("view engine", 'ejs');
app.set('views','./views');

app.use('/public',express.static('./public'))

const bodyParser = require('body-parser');

app.use(bodyParser.urlencoded({extended:false}));

// 连接数据库
const mysql = require('mysql');
const conn = mysql.createConnection({
    host:'localhost',
    user:'root',
    password: 'root',
    database: 'node_day03',
    multipleStatements: true,
})

app.get('/',(req,res) => {
    const pagesize = 2
    const nowpage = Number(req.query.page) || 1
    console.log(nowpage,pagesize,11111111111111111111111111111111111)
    const sql = `select title.id, title.title, title.ctime, blog_users.nickname 
                from blog_users
                LEFT JOIN title
                ON title.authorld=blog_users.id
                ORDER BY title.id desc limit ${(nowpage - 1) * pagesize}, ${pagesize} ;
                select count(*) as count from title;`
    conn.query(sql, (err,result) => {
        console.log(err);
        console.log(result);
        if (err) {
            return res.render('index.ejs', {
              user: req.session.user,
              islogin: req.session.islogin,
              // 文章列表
              articles: []
            })
          }
          // 总页数
          const totalPage = Math.ceil(result[1][0].count / pagesize);
           console.log(nowpage, totalPage);
        res.render('index.ejs',{
            user: req.session.user,
            islogin: req.session.islogin,
            articles:result[0],
            // 总页数
           totalPage: totalPage,
            // 当前展示的是第几页
            nowpage: nowpage
        })
    })


})





fs.readdir(path.join(__dirname,'/router'),(err, result) => {
    if(err) return console.log('读取目录中的文件失败');
    result.forEach(fname => {
      // 每循环一次，拼接出一个完整的路由模块地址
      // 然后，使用 require 导入这个路由模块
      const router = require(path.join(__dirname, './router', fname))
      app.use(router)
    })
})

app.listen(80,() => {
    console.log('server running at http://127.0.0.1')
})