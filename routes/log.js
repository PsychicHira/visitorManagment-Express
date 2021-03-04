//日志接口
//router:/log 
//新建日志

const express = require('express');
const router = express.Router();
const uuid = require('uuid');
//加载mysql模块
const mysql = require('mysql');

//创建连接
const pool = mysql.createPool({
  host: 'localhost',
  user: 'root',
  password: '123456',
  database: 'BankManagementSystem',
  // connectionLimit: 1000
});

let returnData = {
  code: "",
  message: "",
  data: []
}


//录入日志
router.post('/add', function (req, res, next) {
  let createTime = new Date().getFullYear() + '-' + (new Date().getMonth() + 1) + '-' + new Date().getDate();
  console.log(req.body.isImportant)
  let obj = {
    id: uuid.v1(),
    creator: req.body.creator,
    department: req.body.department,
    creatorID: req.body.uid,
    createTime: createTime,
    affairMain: req.body.affairMain,
    affairMiddle: req.body.affairMiddle,
    affair: req.body.affair,
    isCooperation: req.body.isCooperation,
    isImportant: req.body.isImportant,
    keyWords: req.body.keyWords,
    finishTime: req.body.finishTime,
    content: req.body.content,
    status: req.body.status,
    completionOfProcess: req.body.completionOfProcess,
    partner: req.body.partner,
    partnerID: req.body.partnerID,
    partnerDepartment: req.body.partnerDepartment,
    divideProportion: req.body.divideProportion,
  }
  pool.getConnection(async (err, connection) => {
    if (err) {
      console.log('与mysql数据库建立连接失败');
      console.error(err)
    } else {
      //查询受理人id
      await new Promise((resolve, reject) => {
        connection.query(`SELECT hw_users.id FROM hw_users WHERE department='${req.body.partnerDepartment}' AND name='${req.body.partner}'`, function (err, result) {
          if (err) {
            console.log('[SELECT ERROR] - ', err.message);
            res.send(err.message);
            return;
          }
          if (result.length == 0) {
            returnData.code = 0
            returnData.message = "数据库无数据"
            returnData.data = result
            // res.send(returnData);
            reject(returnData)
            return
          } else {
            resolve(result[0].id)
            // obj.acceptorId = result[0].id
            // console.log('result[0].id')
            // console.log(result[0].id)
          }
          //标注，这里没有释放 所以10次链接就pending
          // connection.release()
        })
      }).then(result => {
        obj.partnerID = result
      }).catch(err => {
        console.log(returnData)
      })


      connection.query('INSERT INTO hw_log_create SET ?', obj, function (err, result) {
        if (err) {
          console.log('[SELECT ERROR] - ', err.message);
          res.send(err.message);
          return;
        }
        if (result.affectedRows == 0) {
          returnData.code = 0
          returnData.message = "数据添加失败"
          returnData.data = result
          res.send(returnData)
        } else {
          returnData.code = 1
          returnData.message = "数据添加成功"
          returnData.data = result
          res.send(returnData)
        }
        connection.release()
      });
    }

  })
});

//往日未完成工作
router.get('/pastLogs', function (req, res, next) {
  let createTime = new Date().getFullYear() + '-' + (new Date().getMonth() + 1) + '-' + new Date().getDate();

  pool.getConnection((err, connection) => {
    if (err) {
      console.log('与mysql数据库建立连接失败');
      console.error(err)
      res.send('与mysql数据库建立连接失败');
    } else {
      connection.query(`SELECT * FROM hw_log_create WHERE createTime<date('${createTime}') AND status='未完成'`, function (err, result) {
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

//今日发布的工作
router.get('/todayLogs', function (req, res, next) {
  let createTime = new Date().getFullYear() + '-' + (new Date().getMonth() + 1) + '-' + new Date().getDate();
  console.log(createTime)
  pool.getConnection((err, connection) => {
    if (err) {
      console.log('与mysql数据库建立连接失败');
      console.error(err)
      res.send('与mysql数据库建立连接失败');
    } else {
      connection.query(`SELECT * FROM hw_log_create WHERE createTime = '${createTime}'`, function (err, result) {
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

//已分派未完成工作
router.get('/divedeLogs', function (req, res, next) {
  pool.getConnection((err, connection) => {
    if (err) {
      console.log('与mysql数据库建立连接失败');
      console.error(err)
      res.send('与mysql数据库建立连接失败');
    } else {
      connection.query(`SELECT * FROM hw_log_create WHERE partner!='' AND status="未完成"`, function (err, result) {
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

//查询用户发布过的所有日志（使用用户id查）
router.get('/queryLogs', function (req, res, next) {
  pool.getConnection((err, connection) => {
    if (err) {
      console.log('与mysql数据库建立连接失败');
      console.error(err)
      res.send('与mysql数据库建立连接失败');
    } else {
      connection.query(`SELECT * FROM hw_log_create WHERE creatorID='${req.query.uid}'`, function (err, result) {
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

//查询用户所在部门发布过的所有日志（使用用户的所在部门查）
router.get('/queryLogsByDepartment', function (req, res, next) {
  pool.getConnection((err, connection) => {
    if (err) {
      console.log('与mysql数据库建立连接失败');
      console.error(err)
      res.send('与mysql数据库建立连接失败');
    } else {
      connection.query(`SELECT * FROM hw_log_create WHERE department='${req.query.department}'`, function (err, result) {
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

//更新所选日志
router.post('/updataLog', function (req, res, next) {
  console.log(req.body)
  pool.getConnection((err, connection) => {
    if (err) {
      console.log('与mysql数据库建立连接失败');
      console.error(err)
    } else {
      connection.query(`UPDATE hw_log_create 
      SET 
      keyWords='${req.body.keyWords}',
      finishTime='${req.body.finishTime}',
      isCoorperation='${req.body.isCoorperation}',
      isImportant='${req.body.isImportant}',
      content='${req.body.content}',
      status='${req.body.status}',
      completionOfProcess='${req.body.completionOfProcess}',
      partnerDepartment='${req.body.partnerDepartment}',
      partner='${req.body.partner}',
      divideProportion='${req.body.divideProportion}'
      WHERE 
      id='${req.body.id}'`, function (err, result) {
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