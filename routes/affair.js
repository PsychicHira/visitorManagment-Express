//事务相关
//ruter:/affair

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
  database: 'BankManagementSystem'
});

let returnData = {
  code: "",
  message: "",
  data: []
}

//查询事务大类 
router.get('/getAffairMainClass', function (req, res, next) {
  pool.getConnection((err, connection) => {
    if (err) {
      console.log('与mysql数据库建立连接失败');
      console.error(err)
    } else {
      connection.query('SELECT * FROM hw_affair_mainclass', function (err, result) {
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
          returnData.message = "数据操作成功"
          returnData.data = result
          res.send(returnData);
        }
        connection.release()
      });
    }
  })
});

//添加事务大类 
router.post('/addAffairMainClass', function (req, res, next) {
  pool.getConnection((err, connection) => {
    if (err) {
      console.log('与mysql数据库建立连接失败');
      console.error(err)
    } else {
      connection.query('INSERT INTO hw_affair_mainclass SET ?', { id: 0, affairMainClassName: req.body.affairMainClassName }, function (err, result) {
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
          returnData.message = "数据操作成功"
          returnData.data = result
          res.send(returnData);
        }
        connection.release()
      });
    }
  })
});

//添加事务中类 
router.post('/addAffairMiddleClass', function (req, res, next) {
  pool.getConnection((err, connection) => {
    if (err) {
      console.log('与mysql数据库建立连接失败');
      console.error(err)
    } else {
      connection.query(`INSERT INTO hw_affair_middleclass SET id=0,affairMiddleClassName='${req.body.affairMiddleClassName}',affairMainClassNameId=(SELECT id FROM hw_affair_mainclass WHERE affairMainClassName='${req.body.affairMainClassName}')`, function (err, result) {
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
          returnData.message = "数据操作成功"
          returnData.data = result
          res.send(returnData);
        }
        connection.release()
      });
    }
  })
});


//根据事务大类id查询所包含的事务中类
router.get('/getAffairMiddleClassByMainClassId', function (req, res, next) {
  console.log(req.query.affairMainClassName)

  pool.getConnection((err, connection) => {
    if (err) {
      console.log('与mysql数据库建立连接失败');
      console.error(err)
    } else {
      connection.query(`SELECT id,affairMiddleClassName FROM hw_affair_middleclass WHERE affairMainClassNameId=(SELECT id FROM hw_affair_mainclass WHERE affairMainClassName='${req.query.affairMainClassName}')`, function (err, result) {
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
          returnData.message = "数据操作成功"
          returnData.data = result
          res.send(returnData);
        }
        connection.release()
      });
    }
  })
});

//添加事务（要存入事务中类id）
router.post('/addAffair', function (req, res, next) {
  pool.getConnection((err, connection) => {
    if (err) {
      console.log('与mysql数据库建立连接失败');
      console.error(err)
    } else {
      //INSERT INTO hw_affair_name SET id=0 , affairName='123' , demand='456' , isApproval=0 , number='1101E' , AffairMiddleClassNameId=1
      let obj = {
        id: 0,
        demand: req.body.demand, isApproval: req.body.isApproval,
        number: req.body.number,
        affairMiddleClassNameId: req.body.affairMiddleClassNameId,
        affairName: req.body.affairName,
        isApproval: req.body.isApproval
      }



      connection.query(`INSERT INTO hw_affair_name SET ?`, obj, function (err, result) {
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
          returnData.message = "数据操作成功"
          returnData.data = result
          res.send(returnData);
        }
        connection.release()
      });
    }
  })
});

//查询所有事务
router.get('/getAllAffair', function (req, res, next) {
  console.log(req.query.affairMainClassName)
  //查询所有事务的sql
  let sql = `SELECT hw_affair_name.number,hw_affair_name.affairName, hw_affair_name.isApproval,hw_affair_name.demand,hw_affair_middleclass.affairMiddleClassName 
  FROM hw_affair_name 
  INNER JOIN 
  hw_affair_middleclass 
  ON 
  hw_affair_middleclass.id = affairMiddleClassNameId`
  //大类存在，中类不存在，就查询大类下所有中类，所有中类里面的所有事务
  if (req.query.affairMain && !req.query.affairMiddle) {
    sql = `SELECT * FROM hw_affair_name,(SELECT id FROM hw_affair_middleclass WHERE affairMainClassNameId = ${req.query.affairMain})AS m WHERE affairMiddleClassNameId=m.id`
  }else if (req.query.affairMain && req.query.affairMiddle) {
    sql = `SELECT number,affairName, isApproval,demand,hw_affair_middleclass.affairMiddleClassName 
    FROM hw_affair_name 
    INNER JOIN hw_affair_middleclass 
    ON hw_affair_middleclass.id = affairMiddleClassNameId AND hw_affair_middleclass.id=${req.query.affairMiddle}`
  }



  pool.getConnection((err, connection) => {
    if (err) {
      console.log('与mysql数据库建立连接失败');
      console.error(err)
    } else {
      connection.query(sql, function (err, result) {
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
          returnData.message = "数据操作成功"
          returnData.data = result
          res.send(returnData);
        }
        connection.release()
      });
    }
  })
});



module.exports = router;
