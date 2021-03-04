//优先级、问题类型、问题级别、信息来源、业务分类列表、运维事件——流传方式、状态、手工录入——流传方式
//ruter:/miniOptions

const express = require('express');
const router = express.Router();
//加载mysql模块
const mysql = require('mysql');

const uuid = require('uuid');
//创建连接
const pool = mysql.createPool({
  host: 'localhost',
  user: 'root',
  password: '123456',
  database: 'visitormanagment',
  multipleStatements: true
});

let returnData = {
  code: "",
  message: "",
  data: []
}

// -----------------------------------------------查事类型-------------------------------------------------------------------


//查询查事类型
router.get('/queryConsultType', function (req, res, next) {
  pool.getConnection((err, connection) => {
    if (err) {
      console.log('与mysql数据库建立连接失败');
      console.error(err)
    } else {
      connection.query(`SELECT consultType FROM consult_type ORDER BY \`id\` ASC`, function (err, result) {
        if (err) {
          console.log('[SELECT ERROR] - ', err.message);
          returnData.code = 2
          returnData.message = err.message
          returnData.data = result
          res.send(returnData);
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

//删除查事类型
router.post('/deleteConsultType', function (req, res, next) {
  pool.getConnection((err, connection) => {
    if (err) {
      console.log('与mysql数据库建立连接失败');
      console.error(err)
    } else {
      connection.query(`DELETE FROM consult_type WHERE consultType='${req.body.consultType}';`, function (err, result) {
        console.log(result.affectedRows)
        if (err) {
          console.log('[SELECT ERROR] - ', err.message);
          returnData.code = 2
          returnData.message = err.message
          returnData.data = result
          res.send(returnData);
          return;
        }
        if (result.affectedRows == 0) {
          returnData.code = 0
          returnData.message = "数据删除失败"
          returnData.data = result
          res.send(returnData);
        } else {
          // connection.query('ALTER TABLE  `consult_type` DROP `id`;ALTER TABLE `consult_type` ADD `id` int(3) PRIMARY KEY NOT NULL AUTO_INCREMENT FIRST;')
          returnData.code = 1
          returnData.message = "数据删除成功"
          returnData.data = result
          res.send(returnData);
        }
        connection.release()
      });
    }
  })
});

//增加查事类型
router.post('/addConsultType', function (req, res, next) {
  pool.getConnection((err, connection) => {
    if (err) {
      console.log('与mysql数据库建立连接失败');
      console.error(err)
    } else {
      connection.query(`INSERT INTO consult_type SET ?`, { id: 0, consultType: req.body.consultType }, function (err, result) {
        if (err) {
          console.log('[SELECT ERROR] - ', err.message);
          returnData.code = 2
          returnData.message = err.message
          returnData.data = result
          res.send(returnData);
          return;
        }
        if (result.affectedRows == 0) {
          returnData.code = 0
          returnData.message = "数据添加失败"
          returnData.data = result
          res.send(returnData);
        } else {
          returnData.code = 1
          returnData.message = "数据添加成功"
          returnData.data = result
          res.send(returnData);
        }
        connection.release()
      });
    }
  })
});

// -----------------------------------------------访客来源-------------------------------------------------------------------

//查询访客来源
router.get('/queryVisitorSource', function (req, res, next) {
  pool.getConnection((err, connection) => {
    if (err) {
      console.log('与mysql数据库建立连接失败');
      console.error(err)
    } else {
      connection.query(`SELECT visitorSource FROM visitor_source ORDER BY \`id\` ASC`, function (err, result) {
        if (err) {
          console.log('[SELECT ERROR] - ', err.message);
          returnData.code = 2
          returnData.message = err.message
          returnData.data = result
          res.send(returnData);
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

//删除访客来源
router.post('/deleteVisitorSource', function (req, res, next) {
  pool.getConnection((err, connection) => {
    if (err) {
      console.log('与mysql数据库建立连接失败');
      console.error(err)
    } else {
      connection.query(`DELETE FROM visitor_source WHERE visitorSource='${req.body.visitorSource}';`, function (err, result) {
        console.log(result.affectedRows)
        if (err) {
          console.log('[SELECT ERROR] - ', err.message);
          returnData.code = 2
          returnData.message = err.message
          returnData.data = result
          res.send(returnData);
          return;
        }
        if (result.affectedRows == 0) {
          returnData.code = 0
          returnData.message = "数据删除失败"
          returnData.data = result
          res.send(returnData);
        } else {
          // connection.query('ALTER TABLE  `visitor_source` DROP `id`;ALTER TABLE `visitor_source` ADD `id` int(3) PRIMARY KEY NOT NULL AUTO_INCREMENT FIRST;')
          returnData.code = 1
          returnData.message = "数据删除成功"
          returnData.data = result
          res.send(returnData);
        }
        connection.release()
      });
    }
  })
});

//增加访客来源
router.post('/addVisitorSource', function (req, res, next) {
  pool.getConnection((err, connection) => {
    if (err) {
      console.log('与mysql数据库建立连接失败');
      console.error(err)
    } else {
      connection.query(`INSERT INTO visitor_source SET ?`, { id: 0, visitorSource: req.body.visitorSource }, function (err, result) {
        if (err) {
          console.log('[SELECT ERROR] - ', err.message);
          returnData.code = 2
          returnData.message = err.message
          returnData.data = result
          res.send(returnData);
          return;
        }
        if (result.affectedRows == 0) {
          returnData.code = 0
          returnData.message = "数据添加失败"
          returnData.data = result
          res.send(returnData);
        } else {
          returnData.code = 1
          returnData.message = "数据添加成功"
          returnData.data = result
          res.send(returnData);
        }
        connection.release()
      });
    }
  })
});


module.exports = router;
