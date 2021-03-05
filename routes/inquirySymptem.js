//诊断详情
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

//增加诊断详情
router.post('/add', function (req, res, next) {
  console.log(req.body)
  let obj = {
    id: uuid.v1(),
    vid:req.body.vid,  
    title: req.body.title,  
    consultType: req.body.consultType,
    price: req.body.price,
    inquiryDate: req.body.inquiryDate,
    desc: req.body.desc,
    photoPath: req.body.photoPath,
    result: req.body.result,
    solution: req.body.solution,
    feedback: req.body.feedback ? req.body.feedback : '',
    remark: req.body.remark ? req.body.remark : '',

  }
  pool.getConnection((err, connection) => {
    if (err) {
      console.log('与mysql数据库建立连接失败');
      console.error(err)
    } else {
      connection.query('INSERT INTO inquiry_detail SET ?', obj, function (err, result) {
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

//查询诊断详情
router.get('/query', function (req, res, next) {
  console.log(req.query.id)
  pool.getConnection((err, connection) => {
    if (err) {
      console.log('与mysql数据库建立连接失败');
      console.error(err)
    } else {
      connection.query(`SELECT * FROM inquiry_detail WHERE vid='${req.query.id}'`, function (err, result) {
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
router.post('/delet', function (req, res, next) {
  pool.getConnection((err, connection) => {
    if (err) {
      console.log('与mysql数据库建立连接失败');
      console.error(err)
    } else {
      //DELETE FROM department WHERE name='市场部' AND number='qwewq'
      connection.query('DELETE FROM hw_users WHERE name=? AND sex=?', [req.body.name, req.body.sex], function (err, result) {
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

//更新所选人员
router.post('/updata', function (req, res, next) {
  console.log(req.body)
  pool.getConnection((err, connection) => {
    if (err) {
      console.log('与mysql数据库建立连接失败');
      console.error(err)
    } else {
      //UPDATE department SET departmentName='营业机构', number='018' WHERE departmentName='修改' AND number='019'
      connection.query(`UPDATE hw_users 
      SET name='${req.body.presentForm.name}',
          sex='${req.body.presentForm.sex}',
          phoneNumber='${req.body.presentForm.phoneNumber}',
          department='${req.body.presentForm.department}',
          post='${req.body.presentForm.post}',
          identification='${req.body.presentForm.identification}',
          loginName='${req.body.presentForm.loginName}',
          password='${req.body.presentForm.password}',
          employeeNumber='${req.body.presentForm.employeeNumber}'
      WHERE name='${req.body.updataForm.name}' AND sex='${req.body.updataForm.sex}'`, function (err, result) {
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
