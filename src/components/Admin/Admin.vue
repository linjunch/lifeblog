<template>
  <div class="admin" v-loading.fullscreen.lock="loading">
    <el-row>
      <el-col :span="24">
        <div class="grid-content bg-purple-light">
          <span class="fl" @click="toggleSearch"><i class="el-icon-search"></i></span>
          <span class="fr" @click="goLogin"><i class="el-icon-close"></i></span>
        </div>
      </el-col>
    </el-row>
    <el-collapse-transition>
    <div class="search" v-show="search"><el-input type="text" class="search-text" v-model="searchValue" placeholder="请输入昵称查找相关信息"></el-input><el-button class="search-btn" @click="handleSearch" type="success" plain>查找</el-button></div>
      </el-collapse-transition>
    <el-button
      type="danger"
      style="width: 100%"
      plain
      @click="delCheckItem"
    >删除勾选项</el-button>
    <el-table
      :data="blog.slice((page-1)*10,page*10-1)"
      style="width: 100%"
      stripe border
      @selection-change="changeBox">
      <el-table-column type="expand" >
        <template slot-scope="props">
          <el-form label-position="left" inline class="demo-table-expand" >
            <el-form-item label="评论列表：" class="hide" v-show="props.row.comment.length>0">
              <div v-for="(item,index) in props.row.comment"><div class="cmter">{{ item.cmter}}:</div>{{item.cmtInfo}}</div>
            </el-form-item>
            <div v-show="props.row.comment.length<=0">无人评论</div>
          </el-form>
        </template>
      </el-table-column>
      <el-table-column type="selection" width="55"></el-table-column>
      <el-table-column prop="nickname" label="昵称" width="80"></el-table-column>
      <el-table-column prop="blogText" label="趣事" width="600"></el-table-column>
      <el-table-column prop="time" label="日期" width="200"></el-table-column>
      <el-table-column prop="comment.length" label="评论" width="100"></el-table-column>
      <el-table-column prop="praise.length" label="点赞" width="100"></el-table-column>
      <el-table-column fixed="right" label="操作" width="80">
        <template slot-scope="scope">
          <el-button size="mini" type="danger" @click="del(scope.$index)" plain>删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-pagination
      background
      layout="prev, pager, next"
      :total="blog.length"
      @current-change="goPage"
      class="page-list"
    >
    </el-pagination>
  </div>
</template>

<script>
  export default {
    name: "Admin",
    data(){
      return{
        loading:true,
        blog:[],
        page:1,
        search:false,
        searchValue:'',
        box:[]
      }
    },
    methods:{
      goLogin:function () {
        this.$messagebox.confirm('确定退出吗?').then(()=>{
          this.$router.push('/Login')}
        ).catch(()=>{})
      },
      changeBox:function(x){
        this.box = [];
        x.map((item)=>{
          if(this.box.indexOf(item)<0){
            this.box.push(item._id)
          }
        });
        // console.log(this.box);
      },
      toggleSearch:function(){
        this.search=!this.search;
      },
      handleSearch:function(){
        this.loading = true;
        this.$axios.post('/apis/search',{
          searchValue:this.searchValue
        }).then((res)=>{
          this.loading = false;
          if (res.data.ok){
            this.blog = res.data.blog.reverse()
          }else {
            this.$message({
              type: 'danger',
              message: '查找失败'
            })
          }
        })
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
      },
      goPage:function (x) {
        this.page=x;
      },
      delCheckItem:function () {
        if (this.box.length>0){
          this.$messagebox.confirm('确定删除吗?').then(() => {
            this.loading = true;
            this.$axios.post('/apis/delCheck',{check:this.box}).then(()=>{
              this.$axios.post('apis/getBlog').then( (res)=> {
                if (res.data.ok) {
                  this.blog=res.data.blog.reverse();
                }
                this.loading = false;
              });
            })
          }).catch(() => {});
        }else{
          this.$message({
            type: 'warning',
            message: '您未选择任何数据，请至少选择一条数据！!'
          });
        }
      }
    },
    created(){
      this.loading = true;
      this.$axios.post('apis/getBlog').then( (res)=> {
        if (res.data.ok) {
          this.blog=res.data.blog.reverse();
        }
        this.loading = false;
      });
    }
  }
</script>

<style scoped>
  .cmter{
    font-weight: 700;
  }
  .search{
    display: flex;
  }
  .search-btn{
    width: 20%;
    margin: 0;
  }
  .search-text{
    flex: 1;
  }
  .bg-purple-light {
    background: #A0CFFF;
  }
  .grid-content {
    height: 36px;
    line-height: 36px;
    font-size: 20px;
    position: relative;
    text-align: center;
  }
  .fl{
    position: absolute;
    width: 36px;
    height: 36px;
    font-size: 30px;
    left: 5px;
    color: #FFF;
    cursor: pointer;
  }
  .fr{
    position: absolute;
    width: 36px;
    height: 36px;
    font-size: 30px;
    right: 5px;
    color: #FFF;
    cursor: pointer;
  }
  .page-list{
    text-align: center;
  }
</style>
