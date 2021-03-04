//测试路由页 index

// var express = require('express');
// var router = express.Router();

// /* GET home page. */
// router.get('/', function(req, res, next) {
//   //原
//   // res.render('index', { title: 'Expresss' });

//   //使用绝对定位(盘符目录)打开views下面的html文件
//   // res.sendFile("/zhongxin/BankManagementSystem-Express/views/index.html" )


//   res.send("123")
// });

const express = require('express');
const router = express.Router();
const URL = require('url');
const path = require('path');
// const { v1: uuidv1 } = require('uuid');//引入uuid
const uuid = require('uuid');

let fs = require('fs');
//加载mysql模块
const mysql = require('mysql');

const multer = require('multer')

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

//SQL语句
let sql = "SELECT * FROM test";

router.get('/', function (req, res, next) {
  console.log(req.body)
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
        console.log('result')
        console.log(result)
        if (result.length == 0) {
          returnData.code = 0
          returnData.message = "数据添加失败获取数据"
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
  //解析请求参数
  // var params = res.query;
  // var addSqlParams = [params.id, params.name, params.sex];
  //查
  // connection.query(sql, function (err, result) {
  //   if (err) {
  //     console.log('[SELECT ERROR] - ', err.message);
  //     return;
  //   }
  //   if (!result) {

  //   }
  //   console.log(result);
  //   // console.log(uuid.v1());

  //   //把搜索值输出

  //   res.send(result);

  // });
});

router.get('/api', function (req, res, next) {
  //解析请求参数
  // var params = res.query;
  // var addSqlParams = [params.id, params.name, params.sex];
  //查
  connection.query(sql, function (err, result) {
    if (err) {
      console.log('[SELECT ERROR] - ', err.message);
      res.send(err.message);
          return;
    }
    console.log(result);

    //把搜索值输出

    res.send(result);
  });
});

// router.post('/post', function (req, res, next) {
//   //解析请求参数
//   // var params = res.query;
//   // var addSqlParams = [params.id, params.name, params.sex];
//   //写入
//   ///INSERT INTO test SET id=0, name='john', sex='nan'
//   connection.query('INSERT INTO test(id,name,sex) values(?,?,?)',[0,'j',20], function (err, result) {
//     if (err) {
//       console.log('[SELECT ERROR] - ', err.message);
//       return;
//     }
//     console.log(result);

//     //把搜索值输出

//     res.send(result);
//   });
// });




let upload = multer({
  storage: multer.diskStorage({
    //设置文件存储位置
    destination: function (req, file, cb) {
      let date = new Date();
      let year = date.getFullYear();
      let month = (date.getMonth() + 1).toString().padStart(2, '0');
      let day = date.getDate();
      //这里是项目目录作为根目录，之前携程../upload/所以一直测试无效
      let dir = "./public/uploads/" + year + month + day;

      //判断目录是否存在，没有则创建
      if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, {
          recursive: true
        });
      }

      //dir就是上传文件存放的目录
      cb(null, dir);
    },
    //设置文件名称
    filename: function (req, file, cb) {
      let fileName = file.fieldname + '-' + Date.now() + path.extname(file.originalname);
      //fileName就是上传文件的文件名
      cb(null, fileName);
    }
  })
});
//上传文件
router.post('/upload', upload.single('file'), function (req, res, next) {

  console.log('req.file='+req.file);
  // console.log(res.body);
  upload.single('file')(req, res, (err) => {
    if (err instanceof multer.MulterError) {
      // 发生错误
      returnData.code = 0
      returnData.message = "文件上传错误" + err
      res.send(returnData)
    } else if (err) {
      returnData.code = 0
      returnData.message = "文件上传错误" + err
      res.send(returnData)
    } else {
      returnData.code = 1
      returnData.message = "文件上传成功"
      returnData.path = req.file.path
      res.send(returnData)
      return
    }

  })
});


module.exports = router;
