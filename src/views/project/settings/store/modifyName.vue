<template>
  <el-dialog title="文件格式"  append-to-body :visible="visibleName" class="taskDialog nameDialog" @close="closeDialogName">
    <span class="addRight" @click="addName">添加</span>
    <el-form :model="itemsForm.name" ref="form" :inline="true">
      <div v-for = "(itemAll,index) in itemsAll" :key="index">
        <el-form-item class="first">
          <el-select
                  style="width: 100%"
                  v-model="itemAll.name"
                  @change="changeName(itemAll.name)"
          >
            <el-option
                    v-for="item in items"
                    :key="item.name"
                    :label="item.name"
                    :value="item.name"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item class="end" v-show="itemAll.type==='2'" >
          <el-input
                  style="width: 100%"
                  placeholder="请输入文件格式"
                  v-model="itemAll.default_value"
                  maxlength="10"
                  :change= "itemAll.default_value=itemAll.default_value.replace(/[^\a-zA-Z\Z0-9]/g, '')"
          ></el-input>
        </el-form-item>
        <i class="el-icon-close closeName" @click="closeName(index)"></i>
      </div>
      <!--<p class="title">请添加命名规则</p>-->
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button @click="closeDialogName">取 消</el-button>
      <el-button type="primary" @click="createSubmitName">保 存</el-button>
    </div>
  </el-dialog>
</template>
<script>
    import {checkNameWays,deleteNameTypes,ctrlNameType} from '@/api/project/settings';
    export default {
        props: {
            visibleName: { type: Boolean, required: true,default: false },
            projectId:{ type: String, required: false, default: ''},
            treeId:{ type: String, required: false, default: ''},
            nameTypes:{
                type: Array,
                default() {
                    return []
                }
            }
        },
        data() {
            return {
                form: {
                    status: '',
                },
                items:[],
                deleteIds:[],
                deleteTypes:[],
                itemsAll:[],
                itemsForm:{
                    name:this.itemsAll
                },
            }
        },
        watch:{
            visibleName: {
                deep: true,
                immediate: true,
                handler() {
                    if (!this.visibleName) {
                        this.itemsAll = [];
                        this.deleteIds = [];
                    }else{
                        this.init();
                    }
                }
            }
        },
        methods: {
            init(){
                checkNameWays({}).then(res => {
                    if(res.code==0){
                        res.data.forEach(function(item){
                            if(!item.default_value){
                                item.default_value = '';
                            }
                        });
                        this.items = res.data;
                    }
                });
            },
            // 添加命名规则
            addName(){
                if(this.itemsAll.length<50){
                    if(this.itemsAll.length>0&&this.itemsAll[0].type==='3'){
                        this.$message({ type: 'warning', message: '当前已选择格式不限,无法再添加' });
                    }else{
                        this.itemsAll.push({
                            name: this.items[0].name,
                            type:'1',
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
            // 切换状态
            changeName(name){
                // 比对选中值
                let params = {
                    id:name,
                    type:''
                };
                this.items.forEach(function(item){
                    if(item.name===params.id){
                        params.type = item.type;
                    }
                });
                this.itemsAll.forEach(function(item){
                    if(item.name===params.id){
                        item.type = params.type;
                    }
                });
                // 清除多余序列
                if(params.type==='3'){
                    this.itemsAll = this.itemsAll.filter(item => item.type==='3');
                }
            },
            closeDialogName(){
                this.$emit('update:visibleName', false);
            },
            // 保存文件格式
            createSubmitName(){
                if(this.itemsAll.length>0){
                    let array = [];
                    let that = this;
                    array = this.itemsAll.filter(function(a) {
                        let num = 0;
                        that.nameTypes.forEach(function(b) {
                            if (b.name !== a.name) {
                                num++
                            }
                        });
                        return num === that.nameTypes.length
                    });
                    // 去重的添加序列
                    if(array.length>0){
                        let param = {};
                        for(let arr of array){
                            if(arr.type==='2'){
                                arr.name = arr.default_value;
                                param[arr.name] = arr;
                            }else{
                                param[arr.name] = arr;
                            }
                        }
                        let params = {
                            pro_id:this.projectId,
                            folder_type:this.treeId,
                            items:JSON.stringify(param)
                        };
                        ctrlNameType(params).then(res => {
                            if(res.code==0){
                                this.$message({ type: 'success', message: '操作成功' });
                                console.log(array)
                                // 是否是格式不限
                                if(array[0].type === '3'){
                                    deleteNameTypes({ids:Array.from(new Set(
                                        this.deleteIds.concat(
                                            this.nameTypes.filter(item => item.type!=='3').map(item => item.id)
                                        ))).join(',')}
                                   ).then(() => {});
                                }else{
                                    let typeArray = Array.from(new Set(
                                        this.deleteIds.concat(
                                            this.nameTypes.filter(item => item.type==='3').map(item => item.id)
                                        ))).join(',');
                                    if(typeArray){
                                        deleteNameTypes({ids:typeArray}).then(() => {});
                                    }
                                }
                                this.deleteIds = [];
                                this.$emit('update:visibleName', false);
                                this.$emit('checkTypes');
                            }
                        });
                    }else{
                        this.$message({ type: 'success',  message: '操作成功' });
                        this.deleteIds = [];
                        this.$emit('update:visibleName', false);
                        this.$emit('checkTypes');
                    }
                }else{
                    this.$message({ type: 'warning', message: '请输入文件格式' });
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
  .nameDialog{
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
  }

</style>
