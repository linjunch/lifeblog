<template>
  <div class="info">
    <h2 class='nickName'>{{blog.nickname}}:</h2>
    <p class="time">{{blog.time}}</p>
    <p class="text">{{blog.blogText}}</p>
    <el-button @click="up" class="btn" size="mini"><i class="iconfont icon-dianzan"></i>({{blog.praise.length}})</el-button><el-button @click="toggleShow" class="btn" size="mini"><i class="iconfont icon-xiaoxi"></i>({{blog.comment.length}})</el-button>
    <el-collapse-transition>
      <div class="comment-wrapper" v-show="show">
        <el-row >
          <el-col :span="20">
            <el-input type="text" placeholder="评论" v-model="cmtInfo" class="cmtText" ></el-input>
          </el-col>
          <el-col :span="4">
            <el-button :disabled="cmtInfo===''" @click="cmt" class="cmtBtn" type="primary" >评论</el-button>
          </el-col>
        </el-row>
        <ul>
          <li v-for="(item,index) in blog.comment" class="cm-list">
            <span class="cmter">{{item.cmter}}:</span>
            <span class="cm-info">{{item.cmtInfo}}</span>
          </li>
        </ul>
      </div>
    </el-collapse-transition>
  </div>
</template>

<script>
  export default {
    name: "Info",
    props:{
      blog:{
        type:Object
      },
      nickname:{
        type:String
      }
    },
    data(){
      return{
        show:false,
        cmtInfo:''
      }
    },
    methods:{
      toggleShow:function () {
        this.show=!this.show;
      },
      up:function () {
        if (this.blog.praise.indexOf(this.nickname)>=0) {
          this.$message({
            message:"你已经点赞过了！",
            type:'warning'
          })
        }else{
          this.$emit("changep",this.blog._id,this.nickname)
        }
      },
      cmt:function () {
        var date = new Date();
        var month =(date.getMonth()+1)<10?'0'+(date.getMonth()+1):(date.getMonth()+1);
        var day = date.getDay()<10?'0'+date.getDay():date.getDay();
        var hour = date.getHours()<10?'0'+date.getHours():date.getHours();
        var minute = date.getMinutes()<10?'0'+date.getMinutes():date.getMinutes();
        var second = date.getSeconds()<10?'0'+date.getSeconds():date.getSeconds();
        var str = date.getFullYear() + '/' + month + '/' + day + '  ' + hour + ':' + minute +':'+second;
        this.$emit("changecmt",this.blog._id,this.nickname,this.cmtInfo,str);
        this.cmtInfo='';
      }
    }
  }
</script>

<style scoped>
  .info{
    margin-bottom: 10px;
    border: 1px solid #ccc;
    border-radius: 2px;
    padding: 5px;
  }
  .nickName{
    font-size: 14px;
    font-weight: 700;
    color:#333;
    margin-bottom: 5px;
  }
  .time{
    font-size: 12px;
    color: #808080;
    margin-bottom: 5px;
  }
  .text{
    padding: 1px 0 3px;
    overflow: hidden;
    line-height: 18px;
    word-wrap: break-word;
    color:#333;
    font-size: 14px;
  }
  .btn{
    width: 50%;
    margin:0;
    box-sizing: border-box;
  }
  .cmtText,.cmtBtn{
    width: 100%;
  }
  .cmtBtn{
    margin-left: 2px;
    padding-left: 10px;
  }
  .comment-wrapper{
    margin-top: 5px;
    padding: 5px;
  }
  .cm-list{
    margin: 5px 5px 0 5px;
  }
  .cm-info{
    font-size: 12px;
    color: #808080;
  }
  .cmter{
    font-size: 14px;
    font-weight: 700;
  }
</style>
