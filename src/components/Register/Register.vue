<template>
  <div class="Register" v-loading.fullscreen.lock="loading">
    <div class="register-wrapper">
      <h2 class="title"><i class="el-icon-mobile-phone"></i>欢迎注册</h2>
      <el-input type="text" placeholder="昵称" v-model="nickname" @blur="nicknameBlur()" @focus="nicknameFocus()" class="nickname" ></el-input>
      <el-collapse-transition>
        <p v-show="nicknameTip===1" class="tip"><i class="el-icon-error"></i>昵称不能为空</p>
      </el-collapse-transition>
      <el-collapse-transition>
        <p v-show="nicknameTip===2" class="tip"><i class="el-icon-error"></i>昵称已有人使用</p>
      </el-collapse-transition>
      <el-collapse-transition>
        <p v-show="nicknameTip===3" class="tip"><i class="el-icon-error"></i>不要使用空格和非法字符！</p>
      </el-collapse-transition>
      <el-input type="password" placeholder="密码" v-model="psw" @blur="pswBlur()" @focus="pswFocus()" class="psw"></el-input>
      <el-collapse-transition>
        <p v-show="pswTip===1" class="tip"><i class="el-icon-error"></i>密码不能为空</p>
      </el-collapse-transition>
      <el-collapse-transition>
        <p v-show="pswTip===2" class="tip"><i class="el-icon-error"></i>不要使用空格和非法字符！</p>
      </el-collapse-transition>
      <el-input type="password" placeholder="确认密码" v-model="pswConfirm" @blur="pswConfirmBlur()" @focus="pswConfirmFocus()" class="repsw"></el-input>
      <el-collapse-transition>
        <p v-show="pswConfirmTip" class="tip"><i class="el-icon-error"></i>密码不一致</p>
      </el-collapse-transition>
      <div class="check">
        <el-input type="text" placeholder="验证码" v-model="checkValue" @focus="checkFocus" @blur="checkBlur" class="check-ipt" ></el-input>
        <el-button type="info" class="check-btn" @click="changeCheckCode" plain>{{this.checkCode}}</el-button>
      </div>
      <el-collapse-transition>
        <p v-show="checkTip===1" class="tip"><i class="el-icon-error"></i>验证码不能为空</p>
      </el-collapse-transition>
      <el-collapse-transition>
        <p v-show="checkTip===2" class="tip"><i class="el-icon-error"></i>验证码错误</p>
      </el-collapse-transition>
      <el-button type="primary"   @click="register()" class="block100">立即注册</el-button>
      <el-button type="primary" plain class="block100  margin0" @click="goLogin">返回登录</el-button>
    </div>
  </div>
</template>

<script>
  var pat=new RegExp("[^a-zA-Z0-9\_\u4e00-\u9fa5]","i");
  export default {
    name: "Register",
    data(){
      return {
        nickname:'',
        nicknameTip:0,
        psw:'',
        pswTip:0,
        pswConfirm:'',
        pswConfirmTip:0,
        nicknameArray:[],
        loading:false,
        checkCode:'',
        checkValue:'',
        checkTip:0
      }
    },
    methods:{
      nicknameBlur:function () {
        if(this.nickname.trim()===''){
          this.nicknameTip = 1;
        }else if(this.nicknameArray.indexOf(this.nickname)>=0){
          this.nicknameTip = 2;
        }else if(this.nickname.indexOf(" ")>=0||pat.test(this.nickname)){
          this.nicknameTip = 3;
        }
      },
      nicknameFocus:function () {
        this.nicknameTip = 0;
      },
      pswBlur:function () {
        if(this.psw.trim()===''){
          this.pswTip = 1;
        }else if(this.psw.indexOf(" ")>=0||pat.test(this.psw)){
          this.pswTip = 2;
        }
      },
      pswFocus:function () {
        this.pswTip = 0;
      },
      pswConfirmBlur:function () {
        if(this.psw!==this.pswConfirm){
          this.pswConfirmTip = 1;
        }
      },
      pswConfirmFocus:function () {
        this.pswConfirmTip = 0;
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
      },
      checkBlur:function(){
        if(this.checkValue===''){
          this.checkTip = 1;
        }else if(this.checkValue!==this.checkCode){
          this.checkTip = 2;
          this.checkValue= '';
          this.changeCheckCode();
        }
      },
      checkFocus:function(){
        this.checkTip=0;
      },
      register:function () {
        var flag=true;
        if(this.nickname.trim()===''){
          this.nicknameTip = 1;
          flag = false;
        }else if(this.nicknameArray.indexOf(this.nickname)>=0){
          this.nicknameTip = 2;
          flag = false;
        }else if(this.nickname.indexOf(" ")>=0||pat.test(this.nickname)){
          this.nicknameTip = 3;
          flag = false;
        }
        if(this.psw.trim()===''){
          this.pswTip = 1;
          flag = false;
        }else if(this.psw.indexOf(" ")>=0||pat.test(this.psw)){
          this.pswTip = 2;
          flag = false;
        }
        if(this.psw!==this.pswConfirm){
          this.pswConfirmTip = 1;
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
        if(flag){
          var info={
            nickname: this.nickname,
            psw:this.psw
          };
          this.loading = true;
          this.$axios.post('apis/saveInfo', info).then( (res)=> {
            if (res.data.ok) {
              this.loading = false;
              this.$message({
                message: '注册成功！快去登录吧！',
                type: 'success',
                duration:1000
              });
              this.$router.push('/Login');
            }
          });
        }
      },
      goLogin:function () {
        this.$router.push('/Login')
      }
    },
    created(){
      var that = this;
      this.changeCheckCode();
      this.$axios.post('apis/getInfo').then(function (res) {
        if (res.data.ok) {
          that.nicknameArray=res.data.info;
        }
      });
    }
  }
</script>

<style scoped>
  .register-wrapper{
    text-align: center;
  }
  .nickname,.psw,.repsw{
    margin-bottom: 10px;
  }
  .block100{
    display: block;
    width: 100%;
    margin-bottom: 10px;
  }
  .margin0{
    margin-left: 0;
  }
  .tip{
    color: #ff5b5b;
    font-size: 14px;
    margin-bottom: 10px;
  }
  .title{
    font-size: 20px;
    margin-top: 100px;
    margin-bottom: 20px;
    color: #606266;
  }
  .check{
    display: flex;
    margin-bottom: 10px;
  }
  .check-btn{
    width: 30%;
  }
  .check-ipt{
    flex: 1;
  }
</style>
