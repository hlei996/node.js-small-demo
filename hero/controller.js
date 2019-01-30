const mysql = require('mysql');

// 创建sql的连接对象
const conn = mysql.createConnection({
    host:'localhost',
    user: 'root',
    password: 'root',
    database: 'node_day03',
})

module.exports = {
    text(req,res){
        res.send('请求后台API接口成功!')
    },
    getAllHero(req,res){
        const sqlStr1 = 'select * from heros' ;
        conn.query(sqlStr1,(err,result) => {
            if(err) return res.send({status: 500,msg: err.message,data:null})
            res.send({status: 200, msg: 'ok', data: result})
        })
    },
    addHero(req,res){
        const hero = req.body
        var time = new Date();
        var y = time.getFullYear();
        var m = (time.getMonth() + 1).toString().padStart(2,'0');
        var d = time.getDay().toString().padStart(2,'0');
        var h = time.getHours().toString().padStart(2, '0');
        var mm = time.getMinutes().toString().padStart(2, '0');
        var s = time.getSeconds().toString().padStart(2, '0');
    
        hero.ctime = y + '-' + m + '-' + d + ' ' + h + ':' + mm + ":" + s
        const sql = 'insert into heros set ?'
        conn.query(sql,hero,(err,result) => {
            if(err) return res.send({status:'500',msg:err.message,data:null});
            res.send({status:200,msg:'ok',data:null})
        })
    },
    getHero(req,res){
        let id = req.params.id;
        const sql = 'select * from heros where id = ?';
        conn.query(sql,id,(err,result) => {
            if(err) return console.log({status:500,msg:err.message,data:null})
            console.log(result);
            res.send({status:200,msg:'ok',data:result})
        })
    },
    updateHero(req,res){
        let id = req.params.id;
        let hero = req.body;
        const sql = 'update heros set ? where id = ?';
        conn.query(sql,[hero,id],(err,result) => {
            if(err) return console.log({status:500,msg:err.message,data:null})
            res.send({status:200,msg:'ok',data: null})
        })
    
    },
    deleteHero(req,res){
        let id = req.params.id;
        const sql = 'update heros set isdel = 1 where id = ?'
        conn.query(sql,id,(err,result) => {
            if(err) return console.log({staus: 500, msg: err.message, data: null});
            res.send({status: 200, msg: 'ok', data: result})
        })
    }
}