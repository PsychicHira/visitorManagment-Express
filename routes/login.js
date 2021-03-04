//登陆接口

const express = require('express');
const router = express.Router();
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

//登录，验证账号密码
router.post('/', function (req, res, next) {
  // console.log(req.body)
  // console.log(req.body.password)
  pool.getConnection((err, connection) => {
    if (err) {
      console.log('与mysql数据库建立连接失败');
      console.error(err)
    } else {
      connection.query(`SELECT * FROM hw_users WHERE  loginName='${req.body.loginName}' AND password='${req.body.password}'`, function (err, result) {
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
        connection.release() //释放连接池
      });
    }
  })
})



module.exports = router;
