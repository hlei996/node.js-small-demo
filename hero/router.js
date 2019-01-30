const express = require('express');

const router = express.Router();

const str = require('./controller.js')

router.get('/',str.text)

// 对外暴露getAllHero 接口
router.get("/getallhero",str.getAllHero)

// 对外暴露添加英雄的接口
router.post('/addhero',str.addHero)


// 根据id获取英雄信息
router.get('/gethero/:id',str.getHero)

// 根据id更新英雄数据
router.post('/updatehero/:id',str.updateHero)


// 根据Id软删除英雄数据
router.get("/deletehero/:id",str.deleteHero)


module.exports = router;