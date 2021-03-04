//往日事件
//router:/pastEvents

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




// 往日事件查询(根据条件)
router.get('/', function (req, res, next) {
  // console.log(req.query.uid)
  // if (!req.query.uid) return


  console.log(req.query);
  let sql_all

  let string = req.query.string ? `title LIKE BINARY '%${req.query.string}%'` : '';
  let department = req.query.department ? req.query.department : '';
  let startTime = req.query.startTime ? req.query.startTime : '';
  let endTime = req.query.endTime ? req.query.endTime : '';
  // let uid = req.query.uid ? req.query.uid : '1=1';

  let time;
  if (startTime && endTime) {
    time = `createTime  between '${startTime}' and '${endTime}'`;
  } else if (startTime) {
    time = `createTime  >= date('${startTime}')`;
  } else if (endTime) {
    time = `createTime  <= date('${endTime}')`;
  } else {
    time = '';
  }

  let status = req.query.status ? `status='${req.query.status}'` : '';

  console.log(string)
  console.log(department)
  console.log(time)
  console.log(status)

  if (string || department || time || status) {
    string = string ? 'AND ' + string : '';
    department = department ? 'AND department=' + `'${department}'` : '';
    time = time ? 'AND ' + time : '';
    status = status ? 'AND ' + status : '';
    sql_all = `SELECT id,title,acceptor,createTime,creator,status FROM hw_event_new_create WHERE 1=1 ${string} ${department} ${time} ${status}
    union all SELECT id,title,acceptor,createTime,creator,status FROM hw_event_operation WHERE 1=1 ${string} ${department} ${time} ${status}
    union all SELECT id,title,acceptor,createTime,creator,status FROM hw_manual_entry WHERE 1=1 ${string} ${department} ${time} ${status}`;
  } else {
    sql_all = `SELECT id,title,acceptor,createTime,creator,status FROM hw_event_new_create
    union all SELECT id,title,acceptor,createTime,creator,status FROM hw_event_operation
    union all SELECT id,title,acceptor,createTime,creator,status FROM hw_manual_entry`;
  }

  console.log(sql_all);

  pool.getConnection((err, connection) => {
    if (err) {
      console.log('与mysql数据库建立连接失败');
      console.error(err);
    } else {
      connection.query(sql_all, function (err, result) {
        if (err) {
          console.log('[SELECT ERROR] - ', err.message);
          res.send(err.message);
          return;
        }
        if (result.length == 0) {
          returnData.code = 0;
          returnData.message = "数据添加失败";
          returnData.data = result;
          res.send(returnData);
        } else {
          returnData.code = 1;
          returnData.message = "数据库操作成功";
          returnData.data = result;
          res.send(returnData);
        }
        connection.release();
      });
    }
  })
});

//根据事件的id查询事件的详情
router.get('/detail', function (req, res, next) {
  let go = 0
  console.log(req.query.id);

  pool.getConnection(async (err, connection) => {
    if (err) {
      console.log('与mysql数据库建立连接失败');
      console.error(err);
    } else {
      await new Promise((resolve, reject) => {
        connection.query(`SELECT * FROM hw_event_new_create WHERE id='${req.query.id}'`, (err, result) => {
          if (err) {
            console.log('[SELECT ERROR] - ', err.message);
            reject(err.message);
          }
          if (result.length == 0) {
            resolve(0);
          } else {
            resolve(result);
          }
        });
      }).then(result => {
        // console.log('result')
        // console.log(result)
        if (result == 0) {
          returnData.code = 0;
          returnData.message = "数据库无数据";
          returnData.data = [];
        } else {
          returnData.code = 1;
          returnData.message = "数据请求成功";
          returnData.data = result
          go = 1
        }
      }).catch(err => {
        // console.log('err')
        // console.log(err)
        res.send(err)
      });

      if (go == 1) {
        res.send(returnData)
        connection.release();
        return;
      }

      await new Promise((resolve, reject) => {
        connection.query(`SELECT * FROM hw_event_operation WHERE id='${req.query.id}'`, (err, result) => {
          if (err) {
            console.log('[SELECT ERROR] - ', err.message);
            reject(err.message);
          }
          if (result.length == 0) {
            resolve(0);
          } else {
            resolve(result);
          }
        });
      }).then(result => {
        // console.log('result')
        // console.log(result)
        if (result == 0) {
          returnData.code = 0;
          returnData.message = "数据库无数据";
          returnData.data = [];
        } else {
          returnData.code = 1;
          returnData.message = "数据请求成功";
          returnData.data = result
          go = 1
        }
      }).catch(err => {
        // console.log('err')
        // console.log(err)
        res.send(err)
      });
    };

    if (go == 1) {
      res.send(returnData)
      connection.release();
      return;
    }

    await new Promise((resolve, reject) => {
      connection.query(`SELECT * FROM hw_manual_entry WHERE id='${req.query.id}'`, (err, result) => {
        if (err) {
          console.log('[SELECT ERROR] - ', err.message);
          reject(err.message);
          return;
        }
        if (result.length == 0) {
          resolve(0);
        } else {
          resolve(result);
        }
      });
    }).then(result => {
      // console.log('result')
      // console.log(result)
      if (result == 0) {
        returnData.code = 0;
        returnData.message = "数据库无数据";
        returnData.data = [];
        return
      } else {
        returnData.code = 1;
        returnData.message = "数据请求成功";
        returnData.data = result
      }
    }).catch(err => {
      // console.log('err')
      // console.log(err)
      res.send(err)
    });
    console.log('end4')
    res.send(returnData)
    connection.release();
    return


  })
});
module.exports = router;