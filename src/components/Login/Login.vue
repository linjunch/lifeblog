<template>
  <div class="login" v-loading.fullscreen.lock="loading">
    <h1 class="title"><i class="el-icon-edit"></i>登录 <span v-show="radio==='1'">生活趣事</span><span v-show="radio==='2'">管理系统</span></h1>
    <div class="login-wrapper">
      <el-input type="text" :placeholder="radio==='1'?'昵称':'管理员'" v-model="nickname" @focus="inputFocus" class="nickname"></el-input>
      <el-collapse-transition>
        <p v-show="nicknameTip" class="tip"><i class="el-icon-error"></i>昵称不能为空</p>
      </el-collapse-transition>
      <el-input type="password" placeholder="密码" v-model="psw" @focus="inputFocus" class="psw"></el-input>
      <el-collapse-transition>
        <p v-show="pswTip" class="tip"><i class="el-icon-error"></i>密码不能为空</p>
      </el-collapse-transition>
      <div class="check">
        <el-input type="text" placeholder="验证码" v-model="checkValue" @focus="inputFocus" class="check-ipt" ></el-input>
        <el-button type="info" class="check-btn" @click="changeCheckCode" plain>{{this.checkCode}}</el-button>
      </div>
      <el-collapse-transition>
        <p v-show="checkTip===1" class="tip"><i class="el-icon-error"></i>验证码不能为空</p>
      </el-collapse-transition>
      <el-collapse-transition>
        <p v-show="checkTip===2" class="tip"><i class="el-icon-error"></i>验证码错误</p>
      </el-collapse-transition>
      <div class="user-type">
        <el-radio v-model="radio" label="1">用户</el-radio>
        <el-radio v-model="radio" label="2">管理员</el-radio>
      </div>
      <el-button @click="login" type="primary"  class="block100 ">立即登录</el-button>
      <el-button type="primary" plain @click="goRegister" class="block100 margin0">前往注册</el-button>
    </div>
  </div>
</template>

<script>
  export default {
    name: "Login",
    data(){
      return {
        nickname:'',
        nicknameTip:0,
        psw:'',
        pswTip:0,
        radio:'1',
        loading:false,
        checkCode:'',
        checkValue:'',
        checkTip:0
      }
    },
    methods:{
      inputFocus:function () {
        this.nicknameTip = 0;
        this.pswTip = 0;
        this.checkTip=0;
      },
      login:function () {
        let flag=true;
        if(this.nickname===''){
          this.nicknameTip = 1;
          flag = false;
        }
        if(this.psw===''){
          this.pswTip = 1;
          flag = false;
        }
        if(this.checkValue===''){
          this.checkTip = 1;
          flag = false;
        }else if(this.checkValue!==this.checkCode){
          this.checkTip = 2;
          this.checkValue= '';
          this.changeCheckCode();
          flag = false;
        }
        if (flag) {
          let info ={
            nickname:this.nickname,
            psw:this.psw
          };
          if(this.radio==='1'){
            this.loading=true;
            this.$axios.post('apis/login', info).then((res)=> {
              if (res.data.ok) {
                this.$message({
                  message: '验证通过！',
                  type: 'success',
                  duration:1000
                });
                this.loading=false;
                this.$router.push('/Blog');
              }else{
                this.$message.error("验证失败！请输入正确的昵称和密码！");
                this.checkValue = '';
                this.changeCheckCode();
                this.loading=false;
              }
            });
          }else if(this.radio==='2'){
            this.loading=true;
            this.$axios.post('apis/login2', info).then( (res)=> {
              if (res.data.ok) {
                this.$message({
                  message: '验证通过！',
                  type: 'success',
                  duration:1000
                });
                this.loading=false;
                this.$router.push('/Admin');
              }else{
                this.loading=false;
                this.checkValue = '';
                this.changeCheckCode();
                this.$message.error("验证失败！请输入正确的昵称和密码！")
              }
            });
          }
        }
      },
      goRegister:function () {
        this.$router.push("/Register")
      },
      changeCheckCode:function () {
        this.checkCode = Math.floor(Math.random()*(9999)) ;
        if(this.checkCode<10){
          this.checkCode = '000'+this.checkCode;
        }else if(this.checkCode<100){
          this.checkCode = '00'+this.checkCode;
        }else if(this.checkCode<1000){
          this.checkCode = '0'+this.checkCode;
        }else{
          this.checkCode = ''+this.checkCode;
        }
      }
    },
    created(){
      this.changeCheckCode();
    }
  }
</script>

<style scoped>
  .login-wrapper{
    text-align: center;
  }
  .nickname,.psw{
    margin-bottom: 20px;
  }
  .block100{
    display: block;
    width: 100%;
    margin-bottom: 10px;
  }
  .margin0{
    margin-left: 0px;
  }
  .title{
    font-size: 20px;
    margin-top: 100px;
    margin-bottom: 20px;
    color: #606266;
    text-align: center;
  }
  .tip{
    color: #ff5b5b;
    font-size: 14px;
    margin-bottom: 20px;
  }
  .user-type{
    margin-bottom: 20px;
  }
  .check{
    display: flex;
    margin-bottom: 20px;
  }
  .check-btn{
    width: 30%;
  }
  .check-ipt{
    flex: 1;
  }
</style>
