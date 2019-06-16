<template>
  <tbody>
    <template v-for="(row, index) in data">
      <table-tr
        :row="row"
        :key="index"
        :class="{'is-group-row': row._hasChild}"
        @click.native="clickCurrentRow(row._index, $event)"
      >
        <!-- 有子节点 -->
        <template v-if="row._hasChild">
          <td :colspan="columns.length">
            <table-expand :row="row"></table-expand>
          </td>
        </template>
        <!-- 正常行 -->
        <template v-else>
          <template v-for="(column, index1) in columns">
            <td :key="index1">
              <table-cell
                :row="row"
                :column="column"
                :checked="rowChecked(row._index)"
                :disabled="rowDisabled(row._index)"
              ></table-cell>
            </td>
          </template>
        </template>
      </table-tr>
    </template>
  </tbody>
</template>

<script>
import TableTr from './table-tr'
import TableExpand from './table-expand'
import TableCell from './table-cell'

export default {
  name: 'TableBody',
  props: { columns: Array, data: Array },
  components: { TableTr, TableExpand, TableCell },
  methods: {
    rowChecked(_index) {
      return this.data[_index] && this.data[_index]._isChecked
    },
    rowDisabled(_index) {
      return this.data[_index] && this.data[_index]._isDisabled
    },
    clickCurrentRow(_index, event) {
      this.$parent.clickCurrentRow(_index, event)
    }
  }
}
</script>
