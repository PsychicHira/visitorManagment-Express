//选项查询
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
  database: 'visitormanagment'
});

let returnData = {
  code: "",
  message: "",
  data: []
}







//录入运维事件
router.post('/', function (req, res, next) {
  let createTime = new Date().getFullYear() + '-' + (new Date().getMonth() + 1) + '-' + new Date().getDate();
  let obj = {
    id: uuid.v1(),
    department: req.body.department,
    creator: req.body.creator,
    phoneNumber: req.body.phoneNumber,
    address: req.body.address,
    title: req.body.title,
    description: req.body.description,
    problemType: req.body.problemType,
    problemGrade: req.body.problemGrade,
    opinion: req.body.opinion,
    informationSource: req.body.informationSource,
    transferWay: '',
    acceptDepartment: req.body.acceptDepartment,
    acceptor: req.body.acceptor,
    createTime: createTime,
    status: '等待接受',
    creatorId: req.body.uid,
    acceptorId: '',
  }
  console.log(obj)


  // 查询流转方式-运维事件
  pool.getConnection(async (err, connection) => {
    if (err) {
      console.log('与mysql数据库建立连接失败');
      console.error(err)
    } else {
      await new Promise((resolve, reject) => {
        connection.query(`SELECT id FROM hw_transfer_way WHERE transferWay="${req.body.transferWay}" AND influence="运维事件"`, function (err, result) {
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
            reject(result)
            return
          } else {
            // console.log("result="+result)
            // console.log(result[0].id)
            // console.log(req.body.transferWay)
            // obj.transferWay = result[0].id
            resolve(result[0].id)
          }
          // connection.release()
        })
      }).then(result => {
        obj.transferWay = result
      })

      //查询受理人id
      await new Promise((resolve, reject) => {
        connection.query(`SELECT hw_users.id FROM hw_users WHERE departmentName='${req.body.acceptDepartment}' AND name='${req.body.acceptor}'`, function (err, result) {
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
        obj.acceptorId = result
      })



      connection.query('INSERT INTO hw_event_operation SET ?', obj, function (err, result) {
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

module.exports = router;