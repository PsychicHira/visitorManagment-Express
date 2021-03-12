//访客增删改查
const express = require('express');
const router = express.Router();
const URL = require('url');
// const { v1: uuidv1 } = require('uuid');//引入uuid
const uuid = require('uuid');

//加载mysql模块
const mysql = require('mysql');

//创建连接
const pool = mysql.createPool({
  host: 'localhost',
  user: 'root',
  password: '123456',
  database: 'visitormanagment'
});

let returnData = {
  code: "",
  message: "",
  data: []
}

//增加人员
router.post('/add', function (req, res, next) {
  console.log(req.body)
  let obj = {
    id: uuid.v1(),
    name: req.body.name,
    sex: req.body.sex,
    visitorSource: req.body.visitorSource,
    bornDate: req.body.bornDate,
    visitDate: req.body.visitDate,
    province: req.body.province,
    city: req.body.city,
  }
  pool.getConnection((err, connection) => {
    if (err) {
      console.log('与mysql数据库建立连接失败');
      console.error(err)
    } else {
      connection.query('INSERT INTO visitor SET ?', obj, function (err, result) {
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

//查询所有人员
router.get('/query', function (req, res, next) {
  pool.getConnection((err, connection) => {
    if (err) {
      console.log('与mysql数据库建立连接失败');
      console.error(err)
    } else {
      connection.query('SELECT * FROM visitor ORDER BY visitDate DESC', function (err, result) {
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

//删除所选人员
router.post('/delete', function (req, res, next) {
  pool.getConnection((err, connection) => {
    if (err) {
      console.log('与mysql数据库建立连接失败');
      console.error(err)
    } else {
      //DELETE FROM department WHERE name='市场部' AND number='qwewq'
      connection.query(`DELETE FROM visitor WHERE id='${req.body.id}'`, function (err, result) {
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

//更新所选人员
router.post('/updata', function (req, res, next) {
  console.log(req.body)
  pool.getConnection((err, connection) => {
    if (err) {
      console.log('与mysql数据库建立连接失败');
      console.error(err)
    } else {
      //UPDATE department SET departmentName='营业机构', number='018' WHERE departmentName='修改' AND number='019'
      connection.query(`UPDATE visitor 
      SET name='${req.body.name}',
          sex='${req.body.sex}',
          visitorSource='${req.body.visitorSource}',
          bornDate='${req.body.bornDate}',
          visitDate='${req.body.visitDate}',
          province='${req.body.province}',
          city='${req.body.city}'
      WHERE id='${req.body.id}'`, function (err, result) {
        if (err) {
          console.log('[SELECT ERROR] - ', err.message);
          res.send(err.message);
          return;
        }
        if (result.affectedRows == 0) {
          returnData.code = 0
          returnData.message = "数据添加失败"
          returnData.data = result
          res.send(returnData);
        } else {
          console.error(result)
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
