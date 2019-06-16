<template>
  <el-dialog title="新增状态" :visible="visible" class="taskDialog" @close="closeDialogFn">
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
      <el-form-item label="状态类型" :label-width="form.formLabelWidth">
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
        <div class="colorFop" v-if="!form.type">请选择状态类型</div>
        <div v-else>
          <el-color-picker v-model="form.colors"></el-color-picker>
          <p class="colorTip">点击方框可选取颜色</p>
        </div>
      </el-form-item>
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button @click="closeDialogFn">取 消</el-button>
      <el-button type="primary" @click="createSubmit">确 定</el-button>
    </div>
  </el-dialog>
</template>
<script>
export default {
  props: {
    projectId: { type: String, required: false, default: '' },
    visible: { type: Boolean, default: true },
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
              let reg = /^[a-zA-Z\u4E00-\u9FA5\s]+$/;
              let status = reg.test(value)
              if (!status) {
                  callback(new Error('请输入中文汉字、大小写英文字母、空格'))
              } else {
                  let that = this;
                  this.createPro.forEach(function(item){
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
        colors:'',
        formLabelWidth: '130px',
        type:'',
      },
      taskEpisodes: [
          { id:'1',label:'通过'},
          { id:'2',label:'驳回'}
      ],
      rules: {
          status: [{ validator: validateEpisodes, trigger: 'blur' }],
          colors: [  { required: true, message: '请选择状态颜色', trigger: 'change' }],
          type: [  { required: true, message: '请选择状态类型', trigger: 'change' }],
      }
    }
  },
  methods: {
      createSubmit() {
      this.$refs.form.validate(valid => {
        if (valid) {
            this.$emit('addProject', this.form.status,this.form.type,this.form.colors);
            this.$emit('update:visible', false);
        }
      })
    },
      changeState(type){
          type==='2'?this.form.colors = '#FE676E':this.form.colors = '#79CEED';
      },
    closeDialogFn() {
      this.$refs.form.resetFields()
      this.$emit('update:visible', false)
    }
  },
  beforeMount() {}
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
  .colorFop{
    color:#999999;
    font-size:12px;
  }
</style>
