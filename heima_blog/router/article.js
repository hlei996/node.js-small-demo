const express = require('express')

const router = express.Router();

const moment = require('moment')

const mysql = require('mysql');

const marked = require('marked');

const conn = mysql.createConnection({
    host: "localhost",
    user: 'root',
    password: 'root',
    database: 'node_day03',
    multipleStatements: true,
})

// 监听get 添加文章
router.get("/article/add.ejs", (req,res) => {
    if (!req.session.islogin) return res.redirect('/')
    res.render('./article/add.ejs', {
      user: req.session.user ,
      islogin: req.session.islogin
    })
})
// 添加文章接口
router.post('/article/add',(req,res) => {
    let body = req.body;
    // body.authorld = req.session.user.id;
    body.ctime = moment().format('YYYY-MM-DD HH:mm:ss');
    const sql = 'insert into title set ?'
    conn.query(sql,body,(err,result) => {
        if(err) return res.send({status: 501, msg:'发表文章失败'})
        console.log(result);
        if (result.affectedRows !== 1) return res.send({ msg: '发表文章失败！', status: 501 })
        res.send({status: 200, msg: '添加文章成功!',insertId: result.insertId})
    })
})

// 监听客户端发送文章详情页面的请求
router.get('/article/info/:id', (req, res) => {
    // 获取文章Id
    const id = req.params.id;
    // 根据 Id 查询文章信息
    const sql = 'select * from title where id=?'
    conn.query(sql, id, (err, result) => {
        if (err) return res.send({ msg: '获取文章详情失败！', status: 500 })
        if (result.length !== 1) return res.redirect('/')
        // 在 调用 res.render 方法之前，要先把 markdown 文本，转为 html 文本
        const html = marked(result[0].content)
        console.log(html);
        // 把转换好的 HTML 文本，赋值给 content 属性
        result[0].content = html
        console.log(result,req.session.user);
        // 渲染详情页面
        res.render('./article/info.ejs', { user: req.session.user, islogin: req.session.islogin, article: result[0] })
    })
})

// 渲染编辑页面
router.get("/article/edit/:id",(req,res) => {
    const id = req.params.id;
    console.log(id);
    const sql = "select * from title where id = ?";
    conn.query(sql,id,(err,result) => {
        if(err) return res.redirect('/');
        if(result.length !== 1) return  res.redirect('/');
        res.render('./article/edit.ejs',{user: req.session.user, islogin: req.session.islogin,article:result[0]})
    })
})

// 编辑页面保存数据请求
router.post("/article/edit",(req,res) => {
    const body = req.body
    const sql = 'update title set ? where id = ?'
    conn.query(sql,[body,body.id],(err,result) => {
        console.log(result,222);
        if(err) return res.send({msg:"修改数据失败2222",stats:501});
        console.log(result.affectedRows != 1)
        if(result.affectedRows != 1) return res.send({ msg: '修改文章失败！', status: 502});
        res.send({msg:"ok",status:200,})
    })
})


module.exports = router;


function Foo() {
    getName = function () { alert(1);}
    return this;
 }
 Foo.getName = function() { alert(2);}
 Foo.prototype.getName = function() { alert(3);}