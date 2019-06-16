<template>
  <el-dialog title="修改状态" :visible="visible" class="taskDialog" @close="closeDialogFn">
    <el-form :model="form" :rules="rules" ref="form">
      <el-form-item label="状态名称" :label-width="form.formLabelWidth" prop="status">
        <input
                v-model.trim="form.status"
                autocomplete="off"
                placeholder="请输入状态名称"
                class="el-input__inner"
                maxlength="20"
        >
      </el-form-item>
      <el-form-item label="状态类型" :label-width="form.formLabelWidth" v-if="modifyId.type!=='0'">
        <el-form-item prop="type">
          <el-select
                  v-model="form.type"
                  placeholder="请选择状态类型"
                  style="width: 100%"
                  @change="changeState(form.type)"
          >
            <el-option
                    v-for="item in taskEpisodes"
                    :key="item.id"
                    :label="item.label"
                    :value="item.id"
            ></el-option>
          </el-select>
        </el-form-item>
      </el-form-item>
      <el-form-item label="状态颜色" :label-width="form.formLabelWidth" prop="colors" class="colorStatus">
        <el-color-picker v-model="form.colors"></el-color-picker>
        <p class="colorTip">点击方框可选取颜色</p>
      </el-form-item>
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button @click="closeDialogFn">取 消</el-button>
      <el-button type="primary" @click="createSubmit">确 定</el-button>
    </div>
  </el-dialog>
</template>
<script>
    import { modifyStatusList} from '@/api/project/settings';
    export default {
        props: {
            visible: { type: Boolean, default: true },
            modifyId: {
                type: Object,
                default() {
                    return {}
                }
            },
            createPro: {
                type: Array,
                default() {
                    return []
                }
            },
        },
        data() {
            let validateEpisodes = (rule, value, callback) => {
                if (value === '') {
                    callback(new Error('请输入状态名称'))
                } else {
                    let reg = /^[a-zA-Z\u4E00-\u9FA5\s]+$/
                    let status = reg.test(value)
                    if (!status) {
                        callback(new Error('请输入中文汉字、大小写英文字母、空格'))
                    } else {
                        let that = this;
                        let arr = this.createPro.filter(item => item.name!==this.modifyId.name);
                        arr.forEach(function(item){
                            if(item.name===that.form.status){
                                callback(new Error('状态名称重复'))
                            }
                        })
                    }
                    callback()
                }
            };
            return {
                form: {
                    status: '',
                    colors: '',
                    formLabelWidth: '130px',
                    type: '',
                },
                taskEpisodes: [
                    { id:'1',label:'通过'},
                    { id:'2',label:'驳回'}
                ],
                rules: {
                    status: [{validator: validateEpisodes, trigger: 'blur'}],
                    colors: [  { required: true, message: '请选择状态颜色', trigger: 'change' }],
                    type: [  { required: true, message: '请选择状态类型', trigger: 'change' }],
                }
            }
        },
        watch:{
            visible: {
                deep: true,
                immediate: true,
                handler() {
                    if (this.visible) {
                        this.form.status = this.modifyId.name;
                        this.form.colors = this.modifyId.color;
                        this.form.type = this.modifyId.type;
                        this.form.no = this.modifyId.no?this.modifyId.no:null;
                    }else{
                        this.form.status = '';
                        this.form.colors = '';
                        this.form.type = '';
                        this.form.no = null;
                    }
                }
            }
        },
        methods: {
            createSubmit() {
                this.$refs.form.validate(valid => {
                    if (valid) {
                        if(this.modifyId.id){
                            // 修改
                            let params = {
                                id: this.modifyId.id,
                                name:this.form.status,
                                color:this.form.colors,
                                type:this.form.type
                            };
                            modifyStatusList(params).then(res => {
                                if (res.code == 0) {
                                    this.$message({
                                        type: 'success',
                                        message: res.msg
                                    });
                                    this.$emit('handleUpdated');
                                }else{
                                    this.$message({
                                        type: 'error',
                                        message: '修改失败'
                                    });
                                }
                            });
                        }else{
                            this.$emit('modifyProject',this.form);
                        }
                        this.$refs.form.resetFields();
                        this.$emit('update:visible', false);
                    }
                })
            },
            changeState(type){
                type==='2'?this.form.colors = '#FE676E':this.form.colors = '#79CEED';
            },
            closeDialogFn() {
                this.$refs.form.resetFields();
                this.$emit('update:visible', false)
            }
        },
        beforeMount() {

        }
    }
</script>
<style lang="scss">
  .el-color-picker{
    .el-color-picker__trigger{width:90px}
    .el-icon-close{
      display:none;
    }
  }
  .colorTip{
    color:#999999;
    font-size:12px;
    margin-top: -15px;
    line-height: 2;
  }
</style>
