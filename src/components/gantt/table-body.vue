<template>
  <tbody class="gantt-table-tbody">
    <template v-for="(row, index) in data">
      <table-tr :row="row" :key="index">
        <!-- 有子节点 -->
        <template v-if="row._hasChild">
          <td :colspan="columns.length + 1">
            <table-expand :row="row"></table-expand>
          </td>
        </template>
        <!-- 正常行 -->
        <template v-else>
          <table-cell class="task-name" :title="row.title">{{row.title}}</table-cell>
          <template v-for="(column, index1) in columns">
            <table-cell :row="row" :column="column" :key="index1"></table-cell>
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
  components: { TableTr, TableExpand, TableCell }
}
</script>
