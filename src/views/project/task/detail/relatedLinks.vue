<template>
  <div>
    <section class="el-card isShadow">
      <h1>
        {{linkTitle}}
        <a href="javascript:;" class="icon" @click="openDialogFn(type)">新增</a>
      </h1>
      <el-tree :data="stream" :props="defaultProps"></el-tree>
    </section>
  </div>
</template>
<script>
export default {
  props: {
    linkTitle: { type: String, default: '上游环节' },
    type: { type: String, default: '' },
    visible: { type: Boolean, default: false },
    stream: {
      type: Array,
      default() {
        return []
      }
    }
  },
  data() {
    return {
      defaultProps: {
        children: 'children',
        label: 'label'
      }
    }
  },
  methods: {
    openDialogFn(type) {
      this.$emit('update:visible', true)
      this.$emit('updateType', type)
    }
  }
}
</script>
<style lang="scss" scoped>
.el-tree {
  max-height: 300px;
  overflow-y: auto;
}
section {
  background: #fff;
  padding: 20px 20px;
  margin-bottom: 20px;

  h1 {
    height: 30px;
    font-size: 16px;
  }
  .icon {
    width: 24px;
    height: 24px;
    float: right;
    text-indent: -9999px;
    background: url('~@/assets/images/related-add.png') no-repeat 0 0;
  }
}
</style>

