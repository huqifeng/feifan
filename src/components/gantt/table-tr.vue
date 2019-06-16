<template>
  <tr v-show="row._isVisible" :class="className">
    <slot></slot>
  </tr>
</template>
<script>
export default {
  name: 'TableRow',
  props: {
    row: { type: Object }
  },
  computed: {
    className() {
      return {
        'is-group-row': this.row._hasChild
      }
    }
  }
}
</script>
<style lang="scss">
.gantt-table tr:hover > td {
  background-color: #f5f7fa;
}
</style>
