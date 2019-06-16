<template>
  <el-dialog title="编辑" :visible="visible" class="taskDialog storeDialog" @close="closeDialogFn">
    <el-form :model="form" ref="form">
      <el-form-item label="文件夹" :label-width="form.formLabelWidth">
          {{nodeName}}
      </el-form-item>
      <el-form-item label="命名规则" :label-width="form.formLabelWidth">
        <div class="nameRules">
          <div class="setNames">
            <span>{{trees}}</span>
            <i class="iconfont icon-pen" @click="editOut"></i>
            <!--iconpen-->
          </div>
        </div>
      </el-form-item>
      <el-form-item label="支持格式" :label-width="form.formLabelWidth">
        <ul class="nameTypes">
          <li v-for="item in nameTypes" :key="item.name">
            .{{item.name}}
            <i class="el-icon-close" @click="closeTypes(item.name)"></i>
          </li>
          <a href="javascript:;" class="icon" @click="addOut"></a>
        </ul>
      </el-form-item>
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button @click="closeDialogFn">取 消</el-button>
      <el-button type="primary" @click="createSubmit">保 存</el-button>
    </div>
    <modify-rule
            :visibleRule.sync="addOptions.visibleName"
            append-to-body
            :projectId = 'projectId'
            :treeId = "treeId"
             @initTree = "initTree"
    ></modify-rule>
    <modify-name
            :visibleName.sync="addOptions.visibleName1"
            append-to-body
            :projectId = 'projectId'
            :treeId = "treeId"
            :nameTypes = "nameTypes"
            @checkTypes = "checkTypes"
    ></modify-name>
  </el-dialog>
</template>
<script>
    import {checkNameTypes,deleteNameTypes} from '@/api/project/settings';
    import modifyRule from './modifyRule';
    import modifyName from './modifyName';
    export default {
        props: {
            visible: { type: Boolean, default: true,required: true},
            trees:{ type: String, required: false, default: ''},
            nodeName:{ type: String, required: false, default: ''},
            projectId:{ type: String, required: false, default: ''},
            treeId:{ type: String, required: false, default: ''},
        },
        components:{
            modifyRule,
            modifyName
        },
        data() {
            return {
                deleteIds:[],
                form: {
                    status: '',
                    formLabelWidth: '125px',
                },
                addOptions:{
                    visibleName:false,
                    visibleName1:false
                },
                nameTypes:[],
            }
        },
        watch:{
            visible: {
                deep: true,
                immediate: true,
                handler() {
                    if (this.visible) {
                       this.checkTypes();
                    }
                }
            }
        },
        methods: {
            initTree(){
                this.$emit('start');
            },
            // 保存编辑规则
            createSubmit() {
                this.$refs.form.validate(valid => {
                    if (valid) {
                        if(this.deleteIds.length>0){
                            deleteNameTypes({ ids:this.deleteIds.join(',') }).then(() => {});
                        }
                        this.$refs.form.resetFields();
                        this.$emit('update:visible', false);
                    }
                })
            },
            // 编辑命名规则
            editOut(){
                this.ruleShow(true);
            },
            // 增加命名规则
            addOut(){
                this.nameShow(true);
            },
            // 删除支持格式
            closeTypes(name){
                let att = [];
                for(let type of this.nameTypes){
                    if(type.name!==name){
                        att.push(type);
                    }else{
                        if(type.id){
                            this.deleteIds.push(type.id)
                        }
                    }
                }
                this.nameTypes = att;
            },
            closeDialogFn() {
                this.$refs.form.resetFields();
                this.ruleShow(false);
                this.nameShow(false);
                this.$emit('update:visible', false);
            },
            ruleShow(a){
                this.addOptions.visibleName = a;
            },
            nameShow(a){
                this.addOptions.visibleName1 = a;
            },
            // 查询支持格式
            checkTypes(){
                checkNameTypes({
                    pro_id:this.projectId,
                    folder_type:this.treeId,
                }).then(res => {
                    if(res.code==0){
                        this.nameTypes = res.data.data?res.data.data:[];
                    }
                });

            }
        },
        beforeMount() {

        }
    }
</script>
<style lang="scss">
  .nameRules{
    line-height:32px;
    width:584px;
    height:33px;
    border:1px solid rgba(216,216,216,1);
    padding-left:20px;
    margin-top: 2px;
    i{
        font-size:18px;
        color:#179BFF;
        cursor:pointer;
        margin-left:10px;
      }
  }
  .nameTypes{
    margin-top: 5px;
    li{
      padding-left:10px;
      border:1px solid rgba(216,216,216,1);
      height:30px;
      float:left;
      margin:0 10px 10px 0;
      line-height:30px;
      font-size:14px;
      color:#333333;
      i.el-icon-close{
        float: right;
        margin: 8px 3px 9px 10px;
        color:rgba(216,216,216,1);
        font-weight:700;
        cursor:pointer;
      }
    }
    a{
      margin:4px 0 0 10px;
    }
  }
  .icon {
    display:inline-block;
    width: 24px;
    height: 24px;
    background: url('~@/assets/images/related-add.png') no-repeat 0 0;
  }
</style>
