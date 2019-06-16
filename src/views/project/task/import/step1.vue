<template>
  <section class="import-step" v-show="visible">
    <div class="import-main">
      <div class="import-content import-scroll">
        <el-input v-model="inputValue" type="textarea" placeholder="请粘贴Excel内容"></el-input>
      </div>
      <div class="import-tips">
        <slot name="tips"/>
      </div>
    </div>
  </section>
</template>
<script>
export default {
  props: {
    visible: { type: Boolean, default: false },
    value: { type: String }
  },
  data() {
    return {
      inputValue: this.value
    }
  },
  watch: {
    inputValue: {
      immediate: true,
      handler(value) {
        this.$emit('input', value)
      }
    }
  }
}
</script>

<style lang="scss" >
.import-main {
  .el-textarea,
  .el-textarea__inner {
    height: 100%;
  }
}
</style>