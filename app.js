const db=require('./model/db.js');

var bodyParser = require('body-parser');
var jsonParser = bodyParser.json();
var urlencodedParser = bodyParser.urlencoded({ extended: false });
const ObjectID = require("mongodb").ObjectId;
const md5 = require("md5");

const express=require('express');
const app=express();
// session
var session = require('express-session');
// 持久化
var NedbStore = require('nedb-session-store')( session );
app.use(session({
  secret: 'keyboard cat',
  resave: false,
  saveUninitialized: true,
  cookie:{
    maxAge:20000000
  },
  // 配置持久化
  store: new NedbStore({
    filename: 'path_to_nedb_persistence_file.db'
  })
}));



//进入注册页面获取所有已经注册的昵称，返回前端,防止重复昵称
app.post("/getInfo",jsonParser,(req,res)=>{
  db.find("blog","info",{},res,function (res1) {
    var nicknameArray=[];
    for(var i = 0;i<res1.length;i++){
      nicknameArray.push(res1[i].nickname)
    }
    res.send({
      ok:true,
      info:nicknameArray
    });
  });
});
//注册成功将数据保存至数据库
app.post("/saveInfo",jsonParser,(req,res)=>{
  var obj = {
    nickname:req.body.nickname,
    psw:md5(md5(req.body.psw)),
  };
  db.insert("blog","info",obj,res,function () {
    res.send({ok:true});
  });
});
//注册管理员
app.post("/saveAdmin",jsonParser,(req,res)=>{
  var obj = {
    admin:req.body.admin,
    psw:md5(md5(req.body.psw)),
  };
  db.insert("blog","admin",obj,res,function () {
    res.send({ok:true});
  });
});
//验证当前是否登录
app.get('/Blog',(req,res)=>{
  if(req.session.login){
    res.render('Blog')
  }else{
    res.render('Login')
  }
});
//登录验证
app.post("/login",jsonParser,(req,res)=>{
  var obj = {
    nickname:req.body.nickname,
    psw:md5(md5(req.body.psw)),
  };
  db.find("blog","info",obj,res,function (res1) {
    if(res1.length===0){
      res.send({ok:false});
    }else{
      req.session.nickname = req.body.nickname;
      req.session.login=true;
      res.send({ok:true});
    }
  });
});
//管理员登录
app.post("/login2",jsonParser,(req,res)=>{
  var obj = {
    admin:req.body.nickname,
    psw:md5(md5(req.body.psw)),
  };
  db.find("blog","admin",obj,res,function (res1) {
    if(res1.length===0){
      res.send({ok:false});
    }else{
      res.send({ok:true});
    }
  });
});
//获取全部生活趣事
app.post("/getBlog",jsonParser,(req,res)=>{
  db.find("blog","blogging",{},res,function (res1) {
    res.send({
      ok:true,
      nickname:req.session.nickname,
      blog:res1
    });
  });
});
//发布生活趣事
app.post("/blogging",jsonParser,(req,res)=>{
  var obj = {
    nickname:req.body.nickname,
    blogText:req.body.blogText,
    time:req.body.time,
    praise:[],
    comment:[]
  };
  db.insert("blog","blogging",obj,res,function (a) {
    res.send({
      ok:true,
      id:a.ops[0]._id
    });
  });
});
//更新点赞数组
app.post("/up",jsonParser,(req,res)=>{
  db.update("blog","blogging",{_id:ObjectID(req.body._id)},{$addToSet:{praise:req.body.nickname}},res);
  res.send({ok:1});
});
//更新评论数组
app.post("/cmt",jsonParser,(req,res)=>{
  db.update("blog","blogging",{_id:ObjectID(req.body._id)},{$addToSet:{comment:{
        cmter:req.body.cmter,
        cmtInfo:req.body.cmtInfo,
        cmtTime:req.body.cmtTime
      }}},res);
  res.send({
    ok:true
  })
});
//退出登录
app.get('/quit',jsonParser,(req,res)=>{
  req.session.login=false;
  res.send({
    ok:true
  })
});
//获取当前用户
app.post('/getName',jsonParser,(req,res)=>{
  res.send({
    ok:true,
    nickname:req.session.nickname,
  });
});
//更改密码
app.post('/changePsw',jsonParser,(req,res)=>{
  var obj = {
    nickname:req.body.nickname,
    psw:md5(md5(req.body.oldPsw)),
  };
  db.find("blog","info",obj,res,function (res1) {
    if(res1.length===0){
      res.send({ok:false});
    }else{
      db.update("blog","info",{nickname:obj.nickname},{$set:{psw:md5(md5(req.body.newPsw))}},res);
      res.send({ok:true});
    }
  });
});
//获取当前用户趣事
app.post("/getMyBlog",jsonParser,(req,res)=>{
  db.find("blog","blogging",{nickname:req.session.nickname},res,function (res1) {
    res.send({
      ok:true,
      nickname:req.session.nickname,
      blog:res1
    });
  });
});
//删除趣事
app.post("/del",jsonParser,(req,res)=>{
  db.delete("blog","blogging",{_id:ObjectID(req.body._id)},res);
  res.send({ok:1});
});
//根据昵称查找博客
app.post("/search",jsonParser,(req,res)=>{
  db.find("blog","blogging",{nickname:req.body.searchValue},res,function (res1) {
    if (res1.length>0){
      res.send({
        ok:true,
        blog:res1
      });
    } else {
      res.send({
        ok:false,
      });
    }

  });
});
//删除所选项
app.post("/delCheck",jsonParser, (req,res)=>{
  for(item of req.body.check){
    db.delete("blog","blogging",{_id:ObjectID(item)},res);
  }
  res.send({
    ok:true,
  })
});

app.listen(8080,"localhost",()=>{
  console.log("server is running!")
});
