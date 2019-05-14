<template>
  <div>
    <el-button class="btn">临时注册页面！</el-button>
    <el-button @click="reg" type="primary" class="btn">一键注册</el-button>
    <el-button type="success" class="btn" @click="goLogin">返回登录</el-button>
  </div>
</template>

<script>
  export default {
    name: "reg",
    methods:{
      reg:function () {
        var obj ={
          admin:"cheng",
          psw:'0221'
        };
        this.$axios.post('apis/saveAdmin', obj).then(function (res) {
          if (res.data.ok) {
            alert("注册成功！快去登录吧 ！");
          }
        });
      },
      goLogin:function () {
        this.$router.push('/Login');
      }
    }
  }
</script>

<style scoped>
.btn{
  width: 100%;
  margin-top: 100px;
  margin-left: 0;
}
</style>
