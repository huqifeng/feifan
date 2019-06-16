<template>
  <div class="cell">
    <template v-if="renderType === 'selection'">
      <el-checkbox :value="checked" :disabled="disabled" @change="toggleSelect" @click.native.stop></el-checkbox>
    </template>
    <table-slot v-else-if="renderType === 'slot'" :row="row" :column="column"></table-slot>
    <template v-else>
      <span>{{row[column.prop]}}</span>
    </template>
  </div>
</template>

<script>
import tableSlot from './slot'
export default {
  name: 'TableCell',
  inject: ['tableRoot'],
  props: {
    row: Object,
    column: Object,
    checked: Boolean,
    disabled: Boolean
  },
  components: { tableSlot },
  computed: {
    renderType() {
      return this.column.type
    }
  },
  methods: {
    toggleSelect() {
      this.tableRoot.toggleSelect(this.row._index)
    }
  }
}
</script>
