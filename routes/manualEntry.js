//手工录入
//router:/manualEntry
//新建事件
//手工录入事件

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
  database: 'BankManagementSystem'
});

let returnData = {
  code: "",
  message: "",
  data: []
}


//新建事件
router.post('/add', function (req, res, next) {
  let createTime = new Date().getFullYear() + '-' + (new Date().getMonth() + 1) + '-' + new Date().getDate();
  let obj = {
    id: uuid.v1(),
    department: req.body.department,
    creator: req.body.creator,
    phoneNumber: req.body.phoneNumber,
    address: req.body.address,
    title: req.body.title,
    description: req.body.description,
    filePath: req.body.filePath,
    businessCategory: req.body.businessCategory,
    priority: req.body.priority,
    opinion: req.body.opinion,
    informationSourse: req.body.informationSourse,
    transferWay: req.body.transferWay,
    acceptDepartment: req.body.acceptDepartment,
    acceptor: req.body.acceptor,
    quantityGrade: req.body.quantityGrade,
    knowledge: req.body.knowledge,
    status: '等待接受',
    createTime: createTime,
    creatorId: req.body.uid,
    acceptorId: '',
  }


  pool.getConnection(async (err, connection) => {
    if (err) {
      console.log('与mysql数据库建立连接失败');
      console.error(err)
    } else {
      //查询流转方式id
      await new Promise((resolve, reject) => {
        connection.query(`SELECT id FROM hw_transfer_way WHERE transferWay="${req.body.transferWay}" AND influence="手工录入"`, function (err, result) {
          if (err) {
            console.log('[SELECT ERROR] - ', err.message);
            res.send(err.message);
          return;
          }
          if (result.length == 0) {
            returnData.code = 0
            returnData.message = "数据库无数据"
            returnData.data = result
            reject(result)
            res.send(result)
            return
          } else {
            resolve(result[0].id)
          }
        })
      }).then(result => {
        obj.transferWay = result
      }).catch(err => {
        res.send(err)
      })

      //查询受理人id
      await new Promise((resolve, reject) => {
        connection.query(`SELECT users.id FROM departments,users WHERE departmentName='${req.body.acceptDepartment}' AND name='${req.body.acceptor}'`, function (err, result) {
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
      }).catch(err => {
        res.send(err)
      })


      connection.query('INSERT INTO hw_manual_entry SET ?', obj, function (err, result) {
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
  });
});

module.exports = router;