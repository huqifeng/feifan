<template>
  <div class="project-settings">
    <div class="sidebar">
      <h3>系统中状态</h3>
      <draggable
              v-model="createTask.list"
              :move="getdata"
              class="stateStart"
              @change="datadragChange"
              @end = "datadragEnd"
              v-loading="leftLoading"
              :options="{group:'state',animation:150}"
      >
        <transition-group>
            <div v-for="item in createTask.list" :key="item.id" class="clearfix dragStart">
              <div>{{item.name}}</div>
              <div :style="'background:'+item.color"></div>
            </div>
        </transition-group>
      </draggable>
    </div>
    <div class="main">
      <h3>项目中状态</h3>
      <draggable
              v-model="createPro"
              class="stateStart"
              v-loading="rightLoading"
              :options="{group:'state',animation:150,filter: '.unDrag'}"
      >
          <div v-for="(item,index) in createPro" :key="index" class="clearfix dragStart unDrag">
            <div class="itemRight" :title="item.name">{{item.name}}</div>
            <div :style="'background:'+item.color"></div>
            <span v-if="item.type!=='3'&&item.type!=='4'" class="stateMotor" @click="deleteState(item.id,item.name,item.sys_id)"><i class="iconfont icon-delete"></i></span>
            <span v-if="item.type!=='3'&&item.type!=='4'" class="stateMotor" @click="editState(item)"><i class="iconfont icon-pen"></i></span>
            <!--icon-pen--><!--icon-delete-->
          </div>
      </draggable>
      <div class="buttons">
        <el-button type="primary" class="uploadButton"  @click="onPrimary">保存</el-button>
      </div>
      <a href="javascript:;" class="icon" @click="openDialogFn()">新增</a>
    </div>
    <!--新增状态-->
    <create-status
            :visible.sync="addOptions.visible"
            :projectId="projectId"
            :createPro = "createPro"
            ref="creCtrl"
            @addProject="addProject"
    ></create-status>
    <modify-status
            :visible.sync="modifyOptions.visible"
            :modifyId="modifyId"
            :createPro = "createPro"
            ref="modCtrl"
            @handleUpdated="handleUpdated"
            @modifyProject="modifyProject"
    ></modify-status>
  </div>
</template>

<script>
import draggable from 'vuedraggable'
import { systemStatusList,projectStatusList,addStatusList,deleteStatusList} from '@/api/project/settings';
import createStatus from './createStatus';
import modifyStatus from './modifyStatus';
export default {
  components:{
      createStatus,
      modifyStatus,
      draggable
  },
  data() {
    return {
        createTask:{},
        oldNumber:null,
        numMessage:true,
        projectId:null,
        modifyId:{},
        leftLoading:false,
        rightLoading:false,
        createPro:[],
        singlePro:[],
        prePro:[],
        addOptions:{
            visible:false
        },
        addArray:[],
        modifyOptions:{
            visible:false
        }
    }
  },
  methods: {
      init(){
          this.leftLoading = true;
          systemStatusList({}).then(res => {
              if (res.code == 0) {
                  this.oldNumber = res.data.list?res.data.list.length:0;
                  this.createTask = res.data;
                  // this.createTask.list.forEach(function(item){
                  //     item.sys_id = 0;
                  // });
                  this.leftLoading = false;
              }
          })
      },
      handleUpdated(){
          this.rightLoading = true;
          let params = {
              pro_id:this.projectId
          };
          projectStatusList(params).then(res => {
              if (res.code == 0) {
                  if(this.prePro.length>0){
                      this.createPro = Array.from(res.data).concat(this.prePro)
                  }else{
                      this.createPro = Array.from(res.data);
                  }
                  this.rightLoading = false;
              }
          })
      },
      // 拖动
      getdata () {},
      // 左侧拖动复位
      datadragChange (evt) {
          // 左侧减少
          if(this.createTask.list.length!==this.oldNumber){
              let element = evt.removed.element;
              // 左侧保持不变
              this.createTask.list.push(element);
              // 去除右侧重复
              let num = 0;
              let arr = [];
              this.singlePro = this.createPro.filter(item => item.sys_id!==0&&item.name===element.name);
              this.createPro.forEach(function(item){
                  if(item.name===element.name){
                      num++;
                  }
              });
              if(num===2){
                  for(let pro of this.createPro){
                      if(pro!==this.singlePro[0]){
                         arr.push(pro)
                      }
                  }
                  this.createPro = arr;
              }else{
                  // 保存变量
                  this.addProjectDrag(element.name, element.type, element.color,element.id);
              }
              this.createPro.forEach(function(item){
                  if(!item.sys_id){
                      item.sys_id = 0;
                  }
              });
              this.createPro = Array.from(new Set(this.createPro));
          }
      },
      datadragEnd(){},
      // 新增
      openDialogFn(){
          this.addOptions.visible = true;
      },
      // 拖拽新增项目状态
      addProjectDrag(a,b,c,d){
          this.prePro.push({ name:a,color:c,type:b,no:this.createPro.length+1})
          this.addArray.push({
              "no":this.createPro.length,
              "sys_id":d,
              "pro_id":this.projectId,
              "name":a,
              "color":'%23'+c.slice(1),
              "type":b
          });
      },
      // 新增项目状态
      addProject(a,b,c){
          this.prePro.push({ name:a,color:c,type:b,no:this.createPro.length+1})
          if(this.createPro){
              this.createPro = Array.from(new Set(this.createPro.concat(this.prePro)))
          }else{
              this.createPro = [];
              this.createPro.push({ name:a,color:c,type:b,no:this.createPro.length})
          }
          this.addArray.push({
              "no":this.createPro.length,
              "sys_id":0,
              "pro_id":this.projectId,
              "name":a,
              "color":'%23'+c.slice(1),
              "type":b
          });
          this.numMessage = true;
      },
      // 确认修改
      modifyProject(form){
        // 全部展示
        this.createPro.forEach(function(item){
            if(item.no===form.no){
                item.name = form.status;
                item.color = form.colors;
                item.type = form.type
            }
        });
        // 修改未保存状态
        let that = this;
        this.addArray.forEach(function(b) {
            that.createPro.forEach(function(a) {
                if (b.no === a.no) {
                    b.name = a.name;
                    b.color = '%23'+a.color.slice(1);
                    b.type = a.type;
                    b.no = a.no;
                }
            });
        });
        this.numMessage = true;
      },
      //修改
      editState(item){
          this.$nextTick(function() {
              this.modifyId = item;
              item.type=='3'||item.type=='4'?this.$message({
                  type: 'warning',
                  message: '此状态不允许修改'
              }):this.modifyOptions.visible = true;
          })
      },
      //删除
      deleteState(id,name,crs){
          this.$confirm('当前状态可能正在使用中,删除不会影响已创建任务的状态,确定进行删除操作吗?', {
              confirmButtonText: '确定',
              cancelButtonText: '取消',
              type: 'warning'
          }).then(() => {
              if(crs&&crs!==0) {
                  deleteStatusList({ids: id}).then(res => {
                      if (res.code == 0) {
                          this.$message({
                              type: 'success',
                              message: '操作成功'
                          });
                          this.handleUpdated();
                      } else {
                          this.$message({
                              type: 'error',
                              message: '删除失败'
                          });
                      }
                  })
              }else{
                  // 前端删除
                  this.createPro = this.createPro.filter(item => item.name!==name);
                  // 删除预存序列
                  this.prePro = this.prePro.filter(item => item.name!==name);
                  this.addArray = this.addArray.filter(item => item.name!==name);
              }
              this.numMessage = true;
          })
      },
      // 保存
      onPrimary(){
          if(this.addArray.length>0){
              let params = {
                  pro_id:this.projectId,
                  items:JSON.stringify(Array.from(new Set(this.addArray)))
              };
              addStatusList(params).then(res => {
                  if (res.code == 0) {
                      this.$message({
                          type: 'success',
                          message: '操作成功'
                      });
                      this.handleUpdated();
                      this.prePro = [];
                      this.addArray = [];
                  }else{
                      this.$message({
                          type: 'error',
                          message: '保存失败'
                      });
                  }
              });
              this.numMessage = true;
          }else{
              if(this.numMessage){
                  this.$message({
                      type: 'warning',
                      message: '没有需要保存的项目中状态'
                  });
                  this.numMessage = false;
              }
          }
      }
  },
  created() {
      this.projectId = this.$route.query.projectid;
      Array.prototype['remove'] = function(val) {
          var index = this.indexOf(val);
          if (index > -1) {
              this.splice(index, 1);
          }
      };
  },
  mounted(){
      this.init();
      this.handleUpdated();
  }
}
</script>
<style lang="scss">
  .project-settings {
    display: flex;
    position: relative;
    min-height: 100%;
    .sidebar {
      // align-self: flex-start;
      position: relative;
      width: 300px;
      background: #fff;
      /*min-height:600px;*/
      padding:20px;
      // max-height: 100%;
      // overflow: auto;
      >h3{
        font-size:18px;
        color:#333333;
        font-weight:700;
      }
      .stateStart{
        margin-top:20px;
        padding:0 30px;
        clear:both;
        min-height:600px;
        .dragStart{
          margin-bottom:10px;
          display:block;
          height:37px;
          >div{
            float:left;
          }
          >div:first-of-type{
            font-size:16px;
            color:#333333;
            margin-right:30px;
            width:64px;
            text-align:center;
            height: 35px;
            line-height: 35px;
          }
          >div:last-of-type{
            width:90px;
            height:35px;
          }
        }
      }
    }
    .main {
      min-height:600px;
      position: relative;
      flex: 1;
      margin-left: 20px;
      background:#fff;
      padding:20px;
      >h3{
        font-size:18px;
        color:#333333;
        font-weight:700;
      }
      .stateStart{
        margin-top:20px;
        padding:0 30px;
        clear:both;
        min-height:600px;
        .itemRight{
          white-space: nowrap;
          text-overflow:ellipsis;
          overflow:hidden;
        }
        >span{
          display:block;
          min-height:600px;
        }
        .dragStart{
          margin-bottom:10px;
          display:block;
          height:37px;
          .stateMotor{
            float:right;
            margin-right:20px;
            cursor:pointer;
            margin-top:8px;
            i{
              font-size:18px;
              color:#179BFF;
              /*font-weight:700;*/
            }
          }
          >div{
            float:left;
          }
          >div:first-of-type{
            font-size:16px;
            color:#333333;
            margin-right:30px;
            width:160px;
            text-align:right;
            height: 35px;
            line-height: 35px;
          }
          >div:last-of-type{
            width:90px;
            height:35px;
          }
        }
      }
    }
    .icon {
      position: absolute;
      right: 20px;
      top: 20px;
      width: 24px;
      height: 24px;
      text-indent: -9999px;
      background: url('~@/assets/images/related-add.png') no-repeat 0 0;
    }
    .buttons {
      text-align: right;
      padding: 40px 0;
      margin-right:10px;
    }
  }
</style>