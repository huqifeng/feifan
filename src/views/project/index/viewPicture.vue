<template>
  <el-dialog
    title
    :visible.sync="picDialogVisible"
    @close="handleClose"
    custom-class="view-pic-dialog"
  >
    <div class="box">
      <img :src="src | imageUrl(`${publicPath}images/project-defalut.jpg`)">
    </div>
  </el-dialog>
</template>
<script>
export default {
  props: {
    value: { type: Boolean, required: true, default: false },
    src: { type: String, required: true, default: '' }
  },
  data() {
    return {
      picDialogVisible: false,
      publicPath: process.env.BASE_URL
    }
  },
  watch: {
    value: {
      immediate: true,
      handler(value) {
        this.picDialogVisible = value
      }
    }
  },
  methods: {
    handleClose() {
      this.picDialogVisible = false
      this.$emit('hide')
    }
  }
}
</script>
<style lang="scss">
.view-pic-dialog {
  background: none;
  box-shadow: none;
  .el-dialog__body {
    max-height: 500px;
    padding: 0px;
  }
  .el-dialog__headerbtn {
    top: auto;
    bottom: -84px;
    right: auto;
    left: 50%;
    margin-left: -12px;
  }
  .box {
    display: flex;
    justify-content: center;
    align-items: center;
    > img {
      max-width: 100%;
      max-height: 100%;
    }
  }
}
</style>
