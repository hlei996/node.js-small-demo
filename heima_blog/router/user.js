const express = require('express');
const router = express.Router();

// 导入加密模块
const bcrypt = require('bcrypt')
// 定义一个 幂次
const saltRounds = 10 // 2^10;

// 导入数据库
const mysql = require('mysql');

const moment = require('moment')


const conn = mysql.createConnection({
    host:'localhost',
    user:'root',
    password: 'root',
    database: 'node_day03'
});

// 登录页面渲染
router.get("/login",(req,res) => {
    res.render('./user/login.ejs',{})
})

// 注册页面渲染
router.get("/register",(req,res) => {
    res.render('./user/register.ejs',{})
})

// 注册请求
router.post('/register',(req,res) => {
    let body = req.body;
    if(body.username.trim().lenght <=0 || body.password.trim().lenght <= 0 || body.nickname.trim().length <= 0){
        return res.send({msg:"请填写完整的表单数据后再注册!",status:501});
    }
    // 查询用户是否重复
    let sql = "select count(*) as count from blog_users where username=?"
    conn.query(sql,body.username,(err,result) => {
        if(err) return res.send({msg:"用户名查重失败",status:502});
        if(result[0].count != 0) return res.send({msg:'请更换其他用户名在注册!',status: 502});
        // 获取创建时间
        body.ctime = moment().format('YYYY-MM-DD HH:mm:ss');
        const sql2 = 'insert into blog_users set ?'
        console.log(body);
        bcrypt.hash(body.password, saltRounds, (err, pwd) => {
            // 加密失败了！！！
            if (err) return res.send({ msg: '注册用户失败！', status: 506 })
            // 把加密之后的新密码，赋值给 body.password
            body.password = pwd
            const sql2 = 'insert into blog_users set ?'
            conn.query(sql2, body, (err, result) => {
              if (err) return res.send({ msg: '注册新用户失败！', status: 504 })
              if (result.affectedRows !== 1) return res.send({ msg: '注册新用户失败！', status: 505 })
              res.send({ msg: '注册新用户成功！', status: 200 })
            })
          })
    })
// 为了保证每个模块职能的单一性
})

// 登录请求
router.post('/login',(req,res) => {
    let data = req.body;
    if(data.username.trim().length <= 0 || data.password.trim().length <= 0){
        return res.send({msg:"请输入完整的数据后,再登录!",status:501});
    }
    const sql = 'select * from blog_users where username=? and password=?'

    conn.query(sql,[data.username,data.password],(err,result) => {

        if (err) return res.send({msg:"登录失败",status: 502});
        if (result.length !== 1)  return res.send({msg:"密码或账户错误,请重新输入!",status:503});
        // 把登录成功之后的用户信息, 挂载到 session 上
        req.session.user = result[0];
        // 把用户登录成功之后的结果, 挂在到session上
        req.session.islogin = true;
        res.send({msg:'登录成功',status:200})
    })
})

// 注销请求
router.get("/logout", (req,res) => {
    req.session.destroy(function() {
        res.redirect('/')
    })
})

module.exports = router;
