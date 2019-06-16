<template>
  <thead>
    <tr>
      <th
        v-for="(column, index) in columns"
        :key="`group-table-th_${index}`"
        @contextmenu="headerContxtmenu(column, $event)"
      >
        <div class="cell">
          <template v-if="column.type === 'selection'">
            <el-checkbox :value="isSelectAll " @change="selectAll"></el-checkbox>
          </template>
          <template v-else>{{column.label}}</template>
        </div>
      </th>
    </tr>
  </thead>
</template>

<script>
export default {
  props: {
    columns: { type: Array, required: true },
    data: Array
  },
  computed: {
    // checkbox全选状态
    isSelectAll() {
      let isSelectAll = true
      if (!this.data.length) {
        isSelectAll = false
      }
      for (let i = 0; i < this.data.length; i++) {
        if (!this.data[i]._hasChild) {
          if (!this.data[i]._isChecked) {
            isSelectAll = false
            break
          }
        }
      }
      return isSelectAll
    }
  },
  methods: {
    selectAll() {
      const status = !this.isSelectAll
      this.$parent.selectAll(status)
    },
    headerContxtmenu() {
      this.$parent.headerContxtmenu(...arguments)
    }
  }
}
</script>
