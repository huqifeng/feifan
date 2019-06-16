<template>
  <section class="related-wrapper">
    <div class="related-header">
      <slot name="header"></slot>
    </div>
    <div class="related-main">
      <slot></slot>
    </div>
    <div class="related-footer">
      <slot name="footer">
        <el-button round size="medium" @click="handleCancel">取消</el-button>
        <el-button round type="primary" size="medium" @click="handlePrimary">确认</el-button>
      </slot>
    </div>
  </section>
</template>

<script>
export default {
  data() {
    return {}
  },
  methods: {
    // 确认
    handlePrimary() {
      this.$emit('primary')
    },
    // 取消
    handleCancel() {
      this.$emit('cancel')
      // 后退一步
      this.$router.back()
    }
  }
}
</script>

<style lang="scss">
.related-wrapper {
  position: relative;
  display: flex;
  flex-direction: column;
  min-height: 100vh;
  .el-table th {
    background-color: #f9f9f9;
  }
  .el-table .cell {
    white-space: nowrap;
  }
  .group-table th {
    padding: 12px 33px;
  }
  .related-header {
    padding: 0 90px;
    background-color: #fff;
    .el-button {
      height: 40px;
      border-radius: 0;
      border: 0;
    }
  }
  .related-main {
    flex: 1;
    margin: 20px 90px;
    background-color: #fff;
    .title {
      padding: 10px;
      font-size: 18px;
      line-height: 30px;
    }
  }
  .related-footer {
    padding: 60px 90px;
    text-align: right;
  }
  .list-pagination {
    padding: 20px;
    text-align: center;
  }
  .row {
    display: flex;
    margin-left: -10px;
    margin-right: -10px;
  }
  .col {
    flex: 1;
    overflow: auto;
    padding: 0 10px;
  }
  .scroll-content {
    max-height: 800px;
    overflow: auto;
  }
}
</style>
