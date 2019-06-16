<template>
    <el-dialog title="命名规则"  append-to-body :visible="visibleRule" class="taskDialog nameDialog " @close="closeDialogName">
      <span class="addRight" @click="addName">添加</span>
      <el-form :model="form" ref="form" :inline="true">
        <div v-for = "(itemAll,index) in itemsAll" :key="index">
          <el-form-item class="first">
            <el-select
                    style="width: 100%"
                    v-model="itemAll.ename"
                    @change="changeName(itemAll.ename)"
            >
              <el-option
                      v-for="item in items"
                      :key="item.ename"
                      :label="item.name"
                      :value="item.ename"
              ></el-option>
            </el-select>
          </el-form-item>
          <el-form-item class="end" v-show="itemAll.type==='3'">
            <el-input
                    style="width: 100%"
                    placeholder="请输入字母或数字"
                    maxlength="1"
                    v-model="itemAll.default_value"
                    :change="itemAll.ename==='default_num'?itemAll.default_value=itemAll.default_value.replace(/[^Z0-9]/g, ''):itemAll.default_value=itemAll.default_value.replace(/[^\a-zA-Z]/g, '')"
            ></el-input>
          </el-form-item>
          <el-form-item class="end" v-show="itemAll.type!=='4'">
            <el-select
                    style="width: 100%"
                    v-model="itemAll.link_char"
            >
              <el-option
                      v-for="item in itemY"
                      :key="item.id"
                      :label="item.name"
                      :value="item.id"
              ></el-option>
            </el-select>
          </el-form-item>
          <i class="el-icon-close closeName" @click="closeName(index)"></i>
        </div>
        <p class="title" v-show="titleShow">请输入对应数字或字母</p>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="closeDialogName">取 消</el-button>
        <el-button type="primary" @click="createSubmitName">保 存</el-button>
      </div>
    </el-dialog>
</template>
<script>
    import {checkNameList,checkNameInfor,ctrlNameRule,deleteNameRule} from '@/api/project/settings';
    export default {
        props: {
            visibleRule: { type: Boolean, default: false },
            projectId:{ type: String, required: false, default: ''},
            treeId:{ type: String, required: false, default: ''},
        },
        data() {
            return {
                titleShow:false,
                form: {
                    default_value: '',
                },
                deleteIds:[],
                itemsAll:[],
                // itemsForm:{
                //     name:this.itemsAll
                // },
                // 总命名对象
                items:[],
                itemY:[
                    {name:'_',id:'_'},
                    {name:'.',id:'.'},
                    {name:'无',id:''},
                ]
            }
        },
        watch:{
            visibleRule: {
                deep: true,
                immediate: true,
                handler() {
                    if (!this.visibleRule) {
                        this.itemsAll = [];
                        this.deleteIds = [];
                    }else{
                        this.init()
                    }
                }
            }
        },
        methods: {
            // 添加命名规则
            addName(){
                if(this.itemsAll.length<30){
                    if(this.itemsAll.length>0&&this.itemsAll[0].type==='4'){
                        this.$message({ type: 'warning', message: '当前已选择名称不限,无法再添加' });
                    }else{
                        this.itemsAll.push({
                            ename: this.items[0].ename,
                            link_char: "_",
                            name: this.items[0].name,
                            show_name: this.items[0].show_name,
                            type: this.items[0].type,
                            is_new:1,
                            default_value:'',
                        });
                    }
                }else{
                    this.$message({ type: 'warning', message: '超过最大限制,无法再添加' });
                }
            },
            // 删除任务
            closeName(index){
                let att = [];
                for(let i=0;i< this.itemsAll.length;i++){
                    if(index !== i){
                        att.push(this.itemsAll[i]);
                    }else{
                        if(this.itemsAll[i].id){
                            this.deleteIds.push(this.itemsAll[i].id)
                        }
                    }
                }
                this.itemsAll = att;
            },
            // 初始化
            init(){
                checkNameInfor({
                    pro_id:this.projectId,
                    folder_type:this.treeId,
                    is_file_name:2
                }).then(response => {
                    if(Array.isArray(response.data.data)&&response.data.data.length>0){
                        this.itemsAll = response.data.data;
                    }else{
                        this.itemsAll = [];
                    }
                    // 有数据查询输入框
                    checkNameList({}).then(response => {
                        this.items = response.data || [];
                    })
                });
            },
            // 切换状态
            changeName(name){
                let params = {
                    id:name,
                    type:''
                };
                // 比对选中值
                this.items.forEach(function(item){
                    if(item.ename===params.id){
                        params.type = item.type;
                        params.name = item.name;
                        params.show_name = item.show_name;
                      }
                });
                this.itemsAll.forEach(function(item){
                    if(item.ename===params.id){
                        item.type = params.type;
                        item.name = params.name;
                        item.show_name = params.show_name;
                    }
                });
                // 清除多余序列
                if(params.type==='4'){
                    this.itemsAll = this.itemsAll.filter(item => item.type==='4');
                }
            },
            closeTypes(id){
                this.nameTypes = this.nameTypes.filter(item => item.id!==id);
            },
            closeDialogName(){
                this.$emit('update:visibleRule', false);
                this.titleShow = false;
            },
            // 保存命名规则
            createSubmitName(){
                if(this.itemsAll.length>0){
                    // 校验字母或数字是否填写
                    let arr = [];
                    arr = this.itemsAll.filter(item => item.type==="3"&&!item.default_value);
                    if(arr.length>0){
                        this.titleShow = true;
                    }else{
                        this.titleShow = false;
                        let param = {};
                        let array = this.itemsAll;
                        for(let i=0; i<array.length;i++){
                            array[i].no = i+1;
                            delete array[i]['is_new'];
                            param[i+1] = array[i];
                        }
                        let params = {
                            pro_id:this.projectId,
                            folder_type:this.treeId,
                            items:JSON.stringify(param)
                        };
                        ctrlNameRule(params).then(res => {
                            if(res.code==0){
                                this.$message({ type: 'success',  message: '操作成功' });
                                if(this.deleteIds.length>0){
                                    deleteNameRule({ids:this.deleteIds.join(',')}).then(() => {});
                                }
                                this.deleteIds = [];
                                this.$emit('initTree');
                                this.$emit('update:visibleRule', false);
                            }
                        });
                    }
                }else{
                    this.$message({ type: 'warning', message: '请添加命名规则' });
                }
            },
        },
        beforeMount() {

        },
        mounted(){

        }
    }
</script>
<style lang="scss" scoped>
  .titleRow{
    padding:0 190px;
    margin-bottom:30px;
    font-size:16px;
    color:#333333;
    .el-col:nth-of-type(2){
      text-align:center;
    }
    .el-col:nth-of-type(3){
      text-align:right;
    }
  }
  .nameRules{
    width:584px;
    height:33px;
    border:1px solid rgba(216,216,216,1);
    padding-left:22px;
    li{
      float:left;
      margin-right:20px;
      line-height:35px;
      i{
        font-size:18px;
        color:#179BFF;
        cursor:pointer;
      }
    }
  }
  .nameTypes{
    margin-top: 5px;
    li{
      padding-left:10px;
      border:1px solid rgba(216,216,216,1);
      height:30px;
      width:68px;
      float:left;
      margin-right:10px;
      line-height:30px;
      font-size:14px;
      color:#333333;
      i.el-icon-close{
        float: right;
        margin: 9px 3px;
        color:rgba(216,216,216,1);
        font-weight:700;
        cursor:pointer;
      }
    }
    a{
      margin:4px 0 0 10px;
    }
  }
  .addRight{
    position: absolute;
    right: 60px;
    top: 21px;
    color:#179BFF;
    cursor:pointer;
  }
  .icon {
    display:inline-block;
    width: 24px;
    height: 24px;
    background: url('~@/assets/images/related-add.png') no-repeat 0 0;
  }
  .closeName{
    margin:14px 0 0 0;
    color:#D8D8D8;
    font-weight:700;
    cursor:pointer;
  }
  .el-form--inline .el-form-item{
    margin-right:5px;
  }
  .title{
    font-size:12px;
    color:#FF0000;
  }
</style>
