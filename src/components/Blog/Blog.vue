<template>
  <div class="blog" v-loading.fullscreen.lock="loading">
    <div class="seting-list" v-show="bgsetting" >
      <el-button class="changPsw" type="primary" @click="changPsw">修改密码</el-button>
      <el-button class="myBlog" type="primary" @click="goMyBlog">我的趣事</el-button>
      <el-button class="cancelBtn" type="primary" @click="bgSetting">取消</el-button>
    </div>
    <el-row>
      <el-col :span="24">
        <div class="grid-content bg-purple-light">
          <span class="fl" @click="bgSetting"><i class="el-icon-setting"></i></span>
          <span class="blogTitle">欢迎, {{nickname}}</span>
          <span class="fr" @click="quit"><i class="el-icon-close"></i></span>
        </div>
      </el-col>
    </el-row>
    <div class="text-wrapper">
      <el-input v-model="blogText" title="写出你所想" class="blogText" type="textarea" rows="3"></el-input>
    </div>
    <div>
      <el-button type="primary"  @click="blogging" :disabled="blogText===''" class="blogbtn">发布</el-button>
    </div>
    <div>
      <ul>
        <li  v-for="(item,index) in blog" v-show="index>=10*page-10&&index<page*10-1">
          <info :blog="item" :page="page" :nickname="nickname" @changep="changePraise" @changecmt="changeComment"></info>
        </li>
      </ul>
      <el-pagination
        background
        layout="prev, pager, next"
        :total="blog.length"
        @current-change="goPage"
        class="page-list"
      >
      </el-pagination>
    </div>
  </div>
</template>

<script>
  import Info from '../../components/Info/Info'
  export default {
    name: "Blog",
    components:{
      Info,
    },
    data(){
      return{
        loading:true,
        page:1,
        nickname:"",
        blogText:'',
        blog:[],
        bgsetting:false
      }
    },
    methods:{
      goPage:function (x) {
        this.page=x;
      },
      bgSetting:function(){
        this.bgsetting=!this.bgsetting;
      },
      blogging:function () {
        var date = new Date();
        var month =(date.getMonth()+1)<10?'0'+(date.getMonth()+1):(date.getMonth()+1);
        var day = date.getDate()<10?'0'+date.getDate():date.getDate();
        var hour = date.getHours()<10?'0'+date.getHours():date.getHours();
        var minute = date.getMinutes()<10?'0'+date.getMinutes():date.getMinutes();
        var second = date.getSeconds()<10?'0'+date.getSeconds():date.getSeconds();
        var str = date.getFullYear() + '/' + month + '/' + day + '  ' + hour + ':' + minute +':'+second;
        var obj = {
          nickname: this.nickname,
          time:str,
          blogText:this.blogText,
          praise:[],
          comment:[]
        };
        this.loading=true;
        this.$axios.post('apis/blogging', obj).then( (res)=> {
          if (res.data.ok) {
            obj._id=res.data.id;
            this.blog.unshift(obj);
            this.blogText='';
            this.loading=false;
            this.$message({
              message: '发布成功！',
              type: 'success'
            });
          }else{
            this.loading=false;
            this.$message.error('发布失败！');
          }
        });
      },
      changePraise:function (_id,nickname) {
        for (var i = 0;i<this.blog.length;i++){
          if(this.blog[i]._id===_id){
            this.blog[i].praise.push(nickname)
          }
        }
        this.$axios.post('/apis/up',{
          _id:_id,
          nickname:nickname
        })

      },
      changeComment:function (_id,nickname,cmtInfo,time) {
        for (var i = 0;i<this.blog.length;i++){
          if(this.blog[i]._id===_id){
            this.blog[i].comment.push({
              cmter:nickname,
              cmtInfo:cmtInfo,
              cmtTime:time
            })
          }}
          this.$axios.post('/apis/cmt',{
            _id:_id,
            cmter:nickname,
            cmtInfo:cmtInfo,
            cmtTime:time
          })
      },
      goMyBlog:function(){
        this.$router.push('/Myblog');
      },
      changPsw:function(){
        this.$router.push('/Changepsw');
      },
      quit:function () {
        this.$messagebox.confirm('确定退出登录?').then(() => {
          this.$axios.get('/apis/quit').then((res)=>{
                if (res.data.ok){
                  this.$router.push('/Login')
                }
              })
        }).catch(() => {});
      }
    },
    created(){
      var that =this;
      this.loading = true;
      this.$axios.post('apis/getBlog').then(function (res) {
        if (res.data.ok) {
          that.nickname=res.data.nickname;
          that.blog=res.data.blog;
          that.blog.reverse();
        }
        that.loading = false;
      });
    }
  }
</script>

<style scoped>
  .bg-purple-light {
    background: #A0CFFF;
  }
  .grid-content {
    height: 36px;
    line-height: 36px;
    font-size: 20px;
    position: relative;
    margin-bottom: 5px;
    text-align: center;
  }
  .fl{
    position: absolute;
    width: 36px;
    height: 36px;
    font-size: 30px;
    left: 5px;
    color: #FFF;
  }
  .fr{
    position: absolute;
    width: 36px;
    height: 36px;
    font-size: 30px;
    right: 5px;
    color: #FFF;
  }
  .page li{
    float: left;
    margin-right: 5px;
  }
  .blogTitle{
    font-size: 20px;
    font-weight: 800;
    text-align: center;
    color: #FFFFFF;
  }
  .blogbtn{
    width: 100%;
    margin-top: 2px;
    margin-bottom: 10px;
  }
  .seting-list{
    position: fixed;
    width: 100%;
    height: 100%;
    background-color:#000;
    filter:Alpha(Opacity=80);
    opacity:0.8;
    text-align: center;
    padding-top: 200px;
    z-index: 99;
  }
  .myBlog,.changPsw,.cancelBtn{
    width: 60%;
    margin:0;
    margin-top: 20px;
  }
  .page-list{
    text-align: center;
  }

</style>
