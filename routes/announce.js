//公告发布
//router:/announce
//新建事件
//手工录入事件

const express = require('express');
const router = express.Router();
const uuid = require('uuid');
//加载mysql模块
const mysql = require('mysql');
const multer = require('multer')

//创建连接
const pool = mysql.createPool({
  host: 'localhost',
  user: 'root',
  password: '123456',
  database: 'BankManagementSystem'
});

let returnData = {
  code: "",
  message: "",
  data: []
}


// 发布公告
router.post('/add', function (req, res, next) {
  console.log(req.body)
  let createTime = new Date().getFullYear() + '-' + (new Date().getMonth() + 1) + '-' + new Date().getDate();
  let obj = {
    id: uuid.v1(),
    title: req.body.title,
    content: req.body.content,
    startTime: req.body.startTime,
    endTime: req.body.endTime,
    creator: req.body.creator,
    phoneNumber: req.body.phoneNumber,
    influenceArea: req.body.influenceArea,
    isMSG: req.body.isMSG,
    filePath: req.body.filePath,
    createTime: createTime,
    creatorId: req.body.uid,
  }

  console.log(obj)

  pool.getConnection((err, connection) => {
    if (err) {
      console.log('与mysql数据库建立连接失败');
      console.error(err)
    } else {
      connection.query('INSERT INTO hw_announce SET ?', obj, function (err, result) {
        if (err) {
          console.log('[SELECT ERROR] - ', err.message);
          res.send(err.message);
          return;
        }
        if (result.affectedRows == 0) {
          returnData.code = 0
          returnData.message = "数据库无数据"
          returnData.data = result
          res.send(returnData);
        } else {
          returnData.code = 1
          returnData.message = "数据库操作成功"
          returnData.data = result
          res.send(returnData);
        }
        connection.release()
      });
    }
  })
});

//查询公告
router.get('/queryAnnounce', function (req, res, next) {
  pool.getConnection((err, connection) => {
    if (err) {
      console.log('与mysql数据库建立连接失败');
      console.error(err)
      res.send('与mysql数据库建立连接失败');
    } else {
      connection.query(`SELECT * FROM hw_announce`, function (err, result) {
        if (err) {
          console.log('[SELECT ERROR] - ', err.message);
          res.send(err.message);
          return;
        }
        if (result.length == 0) {
          returnData.code = 0
          returnData.message = "数据库无数据"
          returnData.data = result
          res.send(returnData);
        } else {
          returnData.code = 1
          returnData.message = "数据库操作成功"
          returnData.data = result
          res.send(returnData);
        }
        connection.release()
      });
    }
  })
});

module.exports = router;