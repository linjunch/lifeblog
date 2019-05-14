<template>
  <div class="changPsw" v-loading.fullscreen.lock="loading">
    <h2 class="title"><i class="el-icon-edit-outline"></i>修改密码</h2>
    <el-input type="password" placeholder="原密码" class="oldPsw" v-model="oldPsw" @blur="oldPswConfirm" @focus="hideTip"></el-input>
    <el-collapse-transition>
      <p v-show="tip===1" class="tip marginBottom10"><i class="el-icon-error"></i>原密码为空</p>
    </el-collapse-transition>
    <el-input type="password" placeholder="新密码" class="newPsw" v-model="newPsw" @blur="pswConfirm" @focus="hidePswTip"></el-input>
    <el-collapse-transition>
      <p v-show="pswTip===1" class="tip marginBottom10"><i class="el-icon-error"></i>新密码为空</p>
    </el-collapse-transition>
    <el-collapse-transition>
      <p v-show="pswTip===2" class="tip marginBottom10"><i class="el-icon-error"></i>含有空格或者非法字符！</p>
    </el-collapse-transition>
    <el-input type="password" placeholder="确认密码" class="rePsw" v-model="rePsw" @blur="rePswConfirm()" @focus="hideReTip"></el-input>
    <el-collapse-transition>
      <p v-show="reTip===1" class="tip marginBottom10"><i class="el-icon-error"></i>密码不一致</p>
    </el-collapse-transition>
    <el-button type="primary" class="btn" @click="changePsw">确认修改</el-button>
    <el-button type="primary" class="btn" @click="goBlog">返回趣事</el-button>
  </div>
</template>

<script>
  var pat=new RegExp("[^a-zA-Z0-9\_\u4e00-\u9fa5]","i");
  export default {
    name: "Changepsw",
    data(){
      return{
        oldPsw:'',
        newPsw:'',
        rePsw:'',
        nickname:'',
        tip:0,
        pswTip:0,
        reTip:0,
        loading:false
      }
    },
    methods:{
      goBlog:function () {
        this.$router.push("/Blog");
      },
      oldPswConfirm:function(){
        if(this.oldPsw.trim()===''){
          this.tip = 1;
        }
      },
      hideTip:function(){
        this.tip = 0;
      },
      pswConfirm:function(){
        if(this.newPsw.trim()===''){
          this.pswTip = 1;
        }else if(this.newPsw.indexOf(" ")>=0||pat.test(this.newPsw)){
          this.pswTip = 2;
        }
      },
      hidePswTip:function(){
        this.pswTip = 0;
      },
      rePswConfirm:function () {
        if(this.newPsw!==this.rePsw){
          this.reTip = 1;
        }
      },
      hideReTip:function () {
        this.reTip = 0;
      },
      changePsw:function () {
        var flag = true;
        if(this.oldPsw.trim()===''){
          this.tip = 1;
          flag=false;
        }
        if(this.newPsw.trim()===''){
          this.pswTip = 1;
          flag=false;
        }else if(this.newPsw.indexOf(" ")>=0||pat.test(this.newPsw)){
          this.pswTip = 2;
          flag=false;
        }
        if(this.newPsw!==this.rePsw){
          this.reTip = 1;
          flag=false;
        }
        if (flag){
          var obj = {
            nickname:this.nickname,
            oldPsw:this.oldPsw,
            newPsw:this.newPsw,
          };
          this.loading = true;
          this.$axios.post('apis/changePsw', obj).then((res)=> {
            if (res.data.ok) {
              this.$message({
                message: '修改成功！',
                type: 'success',
                duration:1000
              });
              this.loading = false;
              this.$router.push('/Login');
            }else{
              this.loading = false;
              this.$message.error("验证失败！请输入正确密码！")
            }
          });
        }
      }
    },
    created(){
      this.$axios.post('apis/getName').then( (res)=> {
        if (res.data.ok) {
          this.nickname= res.data.nickname;
        }
      });
    }
  }
</script>

<style scoped>
  .title{
    font-size: 20px;
    margin-top: 100px;
    margin-bottom: 20px;
    color: #606266;
    text-align: center;
  }
  .oldPsw,.newPsw,.rePsw{
    margin-bottom: 10px;
  }
  .btn{
    display: block;
    width: 100%;
    margin: 0;
    margin-top: 10px;
  }
  .tip{
    color: #ff5b5b;
    font-size: 14px;
    text-align: center;
  }
  .marginBottom10{
    margin-bottom: 10px;
  }
</style>
