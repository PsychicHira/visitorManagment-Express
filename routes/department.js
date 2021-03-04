//部门管理接口
  //router:/department
  //部门增删改查
  //根据某一部门查所属人员


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
  database: 'BankManagementSystem'
});

let returnData = {
  code: "",
  message: "",
  data: []
}

//增加部门
router.post('/add', function (req, res, next) {
  pool.getConnection((err, connection) => {
    if (err) {
      console.log('与mysql数据库建立连接失败');
      console.error(err)
    } else {
      connection.query('INSERT INTO hw_departments SET ?', { id: 0, departmentName: req.body.departmentName, number: req.body.number }, function (err, result) {
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

//查询所有部门
router.get('/query', function (req, res, next) {
  pool.getConnection((err, connection) => {
    if (err) {
      console.log('与mysql数据库建立连接失败');
      console.error(err)
      res.send('与mysql数据库建立连接失败');
    } else {
      connection.query('SELECT * FROM hw_departments', function (err, result) {
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

//删除所选部门
router.post('/delet', function (req, res, next) {
  pool.getConnection((err, connection) => {
    if (err) {
      console.log('与mysql数据库建立连接失败');
      console.error(err)
    } else {
      //DELETE FROM department WHERE name='市场部' AND number='qwewq'
      connection.query('DELETE FROM hw_departments WHERE departmentName=? AND number=?', [req.body.departmentName, req.body.number], function (err, result) {
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

//更新所选部门
router.post('/updata', function (req, res, next) {
  console.log(req.body)
  pool.getConnection((err, connection) => {
    if (err) {
      console.log('与mysql数据库建立连接失败');
      console.error(err)
    } else {
      //UPDATE department SET departmentName='营业机构', number='018' WHERE departmentName='修改' AND number='019'
      connection.query(`UPDATE hw_departments SET departmentName='${req.body.presentForm.departmentName}', number='${req.body.presentForm.number}' WHERE departmentName='${req.body.updataForm.departmentName}' AND number='${req.body.updataForm.number}'`, function (err, result) {
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

//根据部门查下面的人员
router.get('/queryPersonnnel', function (req, res, next) {
  //获取get参数是req.requery
  // console.log(req.query)
  let department = req.query.department
  pool.getConnection((err, connection) => {
    if (err) {
      console.log('与mysql数据库建立连接失败');
      console.error(err)
    } else {
      connection.query(`select hw_users.\`name\`,hw_users.\`id\` from hw_departments,hw_users where departmentName= '${department}' AND department= '${department}'`, function (err, result) {
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
