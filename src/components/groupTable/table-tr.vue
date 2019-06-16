<template>
  <tr v-show="row._isVisible">
    <slot></slot>
  </tr>
</template>
<script>
export default {
  name: 'TableRow',
  props: {
    row: { type: Object }
  },
  computed: {}
}
</script>
