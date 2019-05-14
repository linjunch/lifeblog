<template>
  <div class="Myblog" v-loading.fullscreen.lock="loading">
    <el-col :span="24">
      <div class="grid-content bg-purple-light">
        <span class="fl" @click="goBlog"><i class="el-icon-arrow-left"></i></span>
        <span class="blogTitle">{{nickname}}的个人主页</span>
        <span class="fr" @click="quit"><i class="el-icon-close"></i></span>
      </div>
    </el-col>
    <br><br><br>
    <ul>
      <li  v-for="(item,index) in blog" v-show="index>=10*page-10&&index<page*10-1" class="list">
        <info :blog="item" :page="page" :nickname="nickname" @changep="changePraise" @changecmt="changeComment"></info>
        <span class="del" @click="del(index)"><i class="el-icon-close"></i></span>
      </li>
    </ul>
    <el-pagination background layout="prev, pager, next" :total="blog.length" @current-change="goPage" class="page-list">
    </el-pagination>
  </div>
</template>

<script>
  import Info from '../../components/Info/Info'
  export default {
    name: "Myblog",
    data(){
      return{
        nickname:'',
        loading:true,
        blog:[],
        page:1
      }
    },
    methods:{
      goBlog:function () {
        this.$router.push("/Blog")
      },
      quit:function () {
        this.$messagebox.confirm('即将退出该账号，返回登录，确定？').then(() => {
          this.$axios.get('/apis/quit').then((res)=>{
            if (res.data.ok){
              this.$router.push('/Login')
            }
          })
        }).catch(()=>{});
      },
      goPage:function (x) {
        this.page=x;
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
          }
          this.$axios.post('/apis/cmt',{
            _id:_id,
            cmter:nickname,
            cmtInfo:cmtInfo,
            cmtTime:time
          })
        }
      },
      del:function (index) {
        this.$messagebox.confirm('确定删除吗?').then(() => {
          this.loading = true;
          this.$axios.post('/apis/del',{
            _id:this.blog[index]._id,
          }).then((res)=>{
            if (res.data.ok){
              this.blog.splice(index,1);
              this.loading = false;
              this.$message({
                type: 'success',
                message: '删除成功!'
              })
            }
          })
        }).catch(() => {});
      }
    },
    components:{
      Info
    },
    created(){
      this.loading = true;
      this.$axios.post('apis/getMyBlog').then( (res)=> {
        if (res.data.ok) {
          this.nickname=res.data.nickname;
          this.blog=res.data.blog;
          this.blog.reverse();
        }
        this.loading = false;
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
    overflow: hidden;
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
  .blogTitle{
    font-size: 20px;
    font-weight: 800;
    height: 36px;
    text-align: center;
    color: #FFFFFF;
  }
  .list{
    position: relative;
  }
  .del{
    position: absolute;
    right: 5px;
    top: 5px;
    font-size: 20px;
    width: 24px;
    height: 24px;
    cursor: pointer;
  }
  .page-list{
    text-align: center;
  }
</style>
