<template>
  <div class="settings">
    <div class="sidebar">
        <div>
            <el-tree
                    :data="fileTree"
                    node-key="id"
                    :default-expand-all="true"
                    :props="defaultProps"
                    @node-click="fileClick"
            >
            </el-tree>
        </div>
    </div>
    <div class="main">
      <div class="mainTop">
        <h3>文件名称</h3>
        <div class="clearfix setNames">
            <span @click="iShow=true">{{trees}}</span>
            <i class="iconfont icon-pen" @click="editOut"></i>
            <!--iconpen-->
        </div>
      </div>
      <div class="mainDown">
        <h3>文件存储</h3>
      </div>
    </div>
    <modify-store
            :visible.sync="addOptions.visible"
            ref="modCtrl"
            @handleUpdated="handleUpdated"
            :trees = "trees"
            :nodeName = "nodeName"
            :projectId = "projectId"
            :treeId = "treeId"
            @start = "init"
    ></modify-store>
  </div>
</template>

<script>
import modifyStore from './modifyStore';
import {checkNameInfor} from '@/api/project/settings';
export default {
  components:{
      modifyStore
  },
  data() {
    return {
        treeId:'input',
        nodeName:'',
        projectId:null,
        iShow:false,
        addOptions:{
            visible:false,
        },
        fileTree:[
                {id:'',nodeName:'文件夹',children:[
                {id:'input',nodeName:"输入\\输出文件夹"},
                {id:'engineering',nodeName:'工程文件夹'},
                {id:'reference',nodeName:'参考文件夹'},
            ]},
        ],
        defaultProps:{
            children: "children",
            label: "nodeName",
            id:"id"
        },
        trees:''
    }
  },
  methods: {
      init(){
          checkNameInfor({
              pro_id:this.projectId,
              folder_type:this.treeId,
              is_file_name:1
          }).then(response => {
              this.trees = response.data || '';
          });
      },
      editOut(){
          this.addOptions.visible = true;
      },
      handleUpdated(){

      },
      // 点击文件夹
      fileClick(data){
          if(data.id){
              this.treeId = data.id;
              this.nodeName = data.nodeName;
              this.init();
          }
      },
  },
  created() {
      this.projectId = this.$route.query.projectid;

  },
  mounted(){
      this.init();
      this.nodeName = this.fileTree[0].children[0].nodeName;
  }
}
</script>
<style lang="scss">
  .settings {
    display: flex;
    position: relative;
    min-height: 100%;
    .sidebar {
      position: relative;
      width: 300px;
      background: #fff;
      min-height:600px;
      padding:13px 11px;
      >h3{
        font-size:18px;
        color:#333333;
        font-weight:700;
      }
        .el-tree{
            >div>div{
                margin-bottom:15px;
                >.el-tree-node__label{
                    font-size: 18px;
                    color: #333333;
                    font-weight: 700;
                }
            }
        }
    }
    .main {
      position: relative;
      flex: 1;
      margin-left: 20px;
      h3{
        font-size:18px;
        color:#333333;
        font-weight:700;
      }
      .mainTop{
        height:150px;
        background:#fff;
        margin-bottom:20px;
        padding:20px;
        .setNames{
          margin-top:23px;
            span{
                cursor:pointer;
            }
            i{
                font-size:18px;
                color:#179BFF;
                cursor:pointer;
                margin-left:10px;
            }
        }
      }
      .mainDown{
        background:#fff;
        min-height:600px;
        padding:20px;
      }
    }
  }
</style>