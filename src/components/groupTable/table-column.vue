<template>
  <div>
    <slot :row="row" :column="column"></slot>
  </div>
</template>

<script>
export default {
  props: {
    row: {
      type: Object,
      default() {
        return {}
      }
    },
    type: { type: String, default: '' },
    prop: { type: String, default: '' },
    label: { type: String, default: '' }
  },
  computed: {
    column() {
      return {
        type: this.type,
        prop: this.prop,
        label: this.lable
      }
    }
  }
}
</script>
