<template>
  <div class="cell" :style="`padding-left:${12 * row._tt_level}px;`">
    <div class="group-row_toggle" @click="toggleExpand(row._index)">
      <!-- 展开 -->
      <template v-if="row._isExpand">
        <i class="el-icon-caret-bottom"></i>
        <!-- <el-button size="mini" class="group-row__btn" @click="toggleExpand(row._index)">
        <i class="el-icon-minus"></i>
        </el-button>-->
      </template>
      <!-- 折叠 -->
      <template v-else>
        <i class="el-icon-caret-right"></i>
        <!-- <el-button size="mini" class="group-row__btn" @click="toggleExpand(row._index)">
        <i class="el-icon-plus"></i>
        </el-button>-->
      </template>
      {{row.name}}
    </div>
  </div>
</template>

<script>
export default {
  name: 'TableExpand',
  inject: ['tableRoot'],
  props: { row: Object },
  methods: {
    toggleExpand(_index) {
      this.tableRoot.toggleExpand(_index)
    }
  }
}
</script>

<style lang="scss">
.is-group-row .group-row__btn {
  padding: 0;
  margin-right: 5px;
}
.is-group-row .group-row_toggle {
  font-size: 15px;
  line-height: 40px;
  cursor: pointer;
}
.is-group-row .group-row_toggle i {
  color: #179bff;
}
</style>