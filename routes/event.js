//事件接口
//router:/events
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
  database: 'BankManagementSystem',
  // connectionLimit: 1000
});

let returnData = {
  code: "",
  message: "",
  data: []
}


//新建事件
router.post('/addNewEvent', function (req, res, next) {
  let createTime = new Date().getFullYear() + '-' + (new Date().getMonth() + 1) + '-' + new Date().getDate();
  let obj = {
    id: uuid.v1(),
    title: req.body.title,
    description: req.body.description,
    businessCategory: req.body.businessCategory,
    priority: req.body.priority,
    creator: req.body.creator,
    department: req.body.department,
    phoneNumber: req.body.phoneNumber,
    isMSG: req.body.isMSG,
    acceptDepartment: req.body.acceptDepartment,
    acceptor: req.body.acceptor,
    filePath: req.body.filePath,
    creatorId: req.body.uid,
    acceptorId: '',
    createTime: createTime,
    status: '等待接受'
  }

  //查询受理人的ID
  pool.getConnection(async (err, connection) => {
    if (err) {
      console.log('与mysql数据库建立连接失败');
      console.error(err)
    } else {
      new Promise((resolve, reject) => {
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
        console.log('result')
        console.log(result)
        obj.acceptorId = result
      }).then(() => {
        connection.query('INSERT INTO hw_event_new_create SET ?', obj, (err, result) => {
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
          // connection.release()
          connection.release()
        });


      }).catch(err => {
        res.send(err);
        connection.release()
      })
    }
  });

});

module.exports = router;