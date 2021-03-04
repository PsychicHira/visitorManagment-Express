//主入口

const createError = require('http-errors');//错误处理中间件
const express = require('express');//加载express模块
const path = require('path');//路径模块
const cookieParser = require('cookie-parser');//这就是一个解析Cookie的工具。通过req.cookies可以取到传过来的cookie，并把它们转成对象。
const logger = require('morgan');//morgan的用途就是记录http通信时的操作日志


// const bodyParser = require('body-parser')
// 路由信息（接口地址），存放在routes的根目录
let index = require('./routes/index');  //测试
let visitor = require('./routes/visitor');  //新增访客
let options = require('./routes/options');  //一些options在这里





//创建一个新的express应用程序
let app = express();

// 模板开始
// view engine setup
app.set('views', path.join(__dirname, 'views'));  //设置视图根目录
app.set('view engine', 'jade'); //设置视图格式（本人不太喜欢用jade，接下来会交大家使用html格式的文件）


app.all("*", function (req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Methods", "PUT,POST,GET,DELETE,OPTIONS");
  res.header("Access-Control-Allow-Headers", "X-Requested-With");
  res.header('Access-Control-Allow-Headers', 'Content-Type');
  next();
});


// 载入中间件
app.use(logger('dev'));//打印到控制台(不确定)
//如果想把日志打印到指定文件，如下
//var accessLog = fs.createWriteStream('../access.log', {flags : 'a'});   //创建一个写文件流，并且保存在当前文件夹的access.log文件中
//app.use(logger('combined', {stream : accessLog}));  //设置开启文件流，并且指明文件流的对象
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
// app.use(express.static(path.join(__dirname, 'public')));  // 访问静态资源
app.use(express.static(__dirname));  // 访问静态资源

// app.use(bodyParser.json());// 解析 application/json
// app.use(bodyParser.urlencoded({ extended: false }));// 解析 application/x-www-form-urlencoded

//配置路由，（'自定义路径'，上面设置的接口地址）
app.use('/', index);
app.use('/visitor', visitor);
app.use('/options', options);






// 错误处理
// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});



module.exports = app;
