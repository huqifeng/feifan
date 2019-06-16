<template>
  <div class="remark-form">
    <el-form :model="form" :rules="rules" ref="form" @submit.native.prevent class>
      <el-form-item prop="content">
        <el-input
          v-model="form.content"
          :placeholder="placeholder"
          maxlength="150"
          @keyup.enter.native="onPrimary"
        >
          <el-button slot="append" type="primary" @click="onPrimary">发送</el-button>
        </el-input>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
export default {
  name: 'RemarkForm',
  props: {
    placeholder: { type: String, default: '请添加备注' }
  },
  data() {
    return {
      form: {
        content: ''
      },
      rules: {
        content: [
          { required: true, message: '请输入内容', trigger: 'change' },
          { max: 150, message: '最多输入150字符', trigger: 'blur' }
        ]
      }
    }
  },
  methods: {
    onPrimary() {
      let isPass = false
      this.$refs.form.validate(valid => {
        isPass = valid
      })
      if (!isPass) {
        return false
      }
      this.$emit('submit', this.form.content)
      // 清空数据
      this.form.content = ''
      this.$refs.form.resetFields()
    }
  }
}
</script>
<style lang="scss">
.remark-form {
  .el-input__inner {
    height: 35px;
    line-height: 35px;
    border-radius: 0;
    border: 1px solid rgba(216, 216, 216, 1);
    color: #333333;
  }
  .el-input-group__append {
    background-color: #179bff;
    color: #fff;
    border-radius: 0;
    text-align: center;
  }
  .el-form-item.is-success .el-input__inner:focus {
    border-color: #409eff;
  }
}
</style>