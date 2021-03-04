//待办事件查询(自己是受理人)
//router:/todo

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

// 待办事件查询(自己是受理人)
router.get('/', function (req, res, next) {
  console.log(req.query.uid);
  
    let sql = `SELECT id,title,acceptor,createTime,creator,department FROM hw_event_new_create WHERE acceptorId="${req.query.uid}"
    UNION ALL SELECT id,title,acceptor,createTime,creator,department FROM hw_event_operation WHERE acceptorId="${req.query.uid}"
    UNION ALL SELECT id,title,acceptor,createTime,creator,department FROM hw_manual_entry WHERE acceptorId="${req.query.uid}"`;

  pool.getConnection((err, connection) => {
    if (err) {
      console.log('与mysql数据库建立连接失败');
      console.error(err);
    } else {
      connection.query(sql, function (err, result) {
        if (err) {
          console.log('[SELECT ERROR] - ', err.message);
          res.send(err.message);
          return;
        }
        if (result.length == 0) {
          returnData.code = 0;
          returnData.message = "暂无数据";
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
// router.get('/detail', function (req, res, next) {
//   console.log(req.query.id);

//   pool.getConnection(async (err, connection) => {
//     if (err) {
//       console.log('与mysql数据库建立连接失败');
//       console.error(err);
//     } else {
//       await new Promise((resolve, reject) => {
//         connection.query(`SELECT * FROM new_event WHERE id='${req.query.id}'`, (err, result) => {
//           if (err) {
//             console.log('[SELECT ERROR] - ', err.message);
//             reject(err.message);
//           }
//           if (result.length == 0) {
//             resolve(0);
//           } else {
//             resolve(result);
//           }
//         });
//       }).then(result => {
//         // console.log('result')
//         // console.log(result)
//         if (result == 0) {
//           returnData.code = 0;
//           returnData.message = "数据库无数据";
//           returnData.data = [];
//         } else {
//           returnData.code = 1;
//           returnData.message = "数据请求成功";
//           returnData.data = result

//           res.send(returnData)
//           console.log('end')
//           connection.release();
//           return
//         }
//       }).catch(err => {
//         // console.log('err')
//         // console.log(err)
//         res.send(err)
//       });


//       await new Promise((resolve, reject) => {
//         connection.query(`SELECT * FROM operation WHERE id='${req.query.id}'`, (err, result) => {
//           if (err) {
//             console.log('[SELECT ERROR] - ', err.message);
//             reject(err.message);
//           }
//           if (result.length == 0) {
//             resolve(0);
//           } else {
//             resolve(result);
//           }
//         });
//       }).then(result => {
//         // console.log('result')
//         // console.log(result)
//         if (result == 0) {
//           returnData.code = 0;
//           returnData.message = "数据库无数据";
//           returnData.data = [];
//         } else {
//           returnData.code = 1;
//           returnData.message = "数据请求成功";
//           returnData.data = result

//           res.send(returnData)
//           console.log('end')
//           connection.release();
//           return
//         }
//       }).catch(err => {
//         // console.log('err')
//         // console.log(err)
//         res.send(err)
//       });
//     };

//     await new Promise((resolve, reject) => {
//       connection.query(`SELECT * FROM manual_entry WHERE id='${req.query.id}'`, (err, result) => {
//         if (err) {
//           console.log('[SELECT ERROR] - ', err.message);
//           reject(err.message);
//           return;
//         }
//         if (result.length == 0) {
//           resolve(0);
//         } else {
//           resolve(result);
//         }
//       });
//     }).then(result => {
//       // console.log('result')
//       // console.log(result)
//       if (result == 0) {
//         returnData.code = 0;
//         returnData.message = "数据库无数据";
//         returnData.data = [];

//         res.send(returnData)
//         console.log('end')
//         connection.release();
//         return
//       } else {
//         returnData.code = 1;
//         returnData.message = "数据请求成功";
//         returnData.data = result

//         res.send(returnData)
//         console.log('end')
//         connection.release();
//         return
//       }
//     }).catch(err => {
//       // console.log('err')
//       // console.log(err)
//       res.send(err)
//     });


//   })
// });
module.exports = router;