<template>
  <div class="gantt-table-wrapper">
    <table class="gantt-table">
      <table-header :columns="columns"></table-header>
      <table-body :columns="columns" :data="dataList"></table-body>
    </table>
  </div>
</template>
<script>
import TableHeader from './table-header'
import TableBody from './table-body'
let _index = 0
export default {
  name: 'Table',
  provide() {
    return {
      tableRoot: this
    }
  },
  components: { TableHeader, TableBody },
  props: {
    columns: {
      type: Array,
      default() {
        return []
      }
    },
    data: {
      type: Array,
      default() {
        return []
      }
    },
    // 默认展开全部
    defaultExpandAll: { type: Boolean, default: false }
  },
  data() {
    return {
      dataList: [] // 自己组装的表数据
    }
  },
  watch: {
    data: {
      immediate: true,
      deep: true,
      handler() {
        this.init()
      }
    }
  },
  computed: {
    // 扁平化后的原始数据
    rawData() {
      return this.flatten(this.data)
    }
  },
  methods: {
    init() {
      _index = 0
      this.dataList = this.genTableData(this.data)
    },
    // 扁平化数据
    flatten(arr = []) {
      let output = []
      arr.forEach(item => {
        if (item.children) {
          output.push({ name: item.name })
          output = [...output, ...this.flatten(item.children)]
        } else {
          output.push(item)
        }
      })
      return output
    },
    // 生成表数据
    genTableData(arr = [], ttParentId = null, ttLevel = 0) {
      let output = []
      arr.forEach((item, index) => {
        let ttId = ttParentId ? `${ttParentId}-${index + 1}` : index + 1
        let temp = {
          _index,
          _tt_id: ttId,
          _tt_parent_id: ttParentId,
          _tt_level: ttLevel,
          _isChecked: false,
          _isVisible: ttLevel === 0 || this.defaultExpandAll
        }
        _index += 1
        if (item.children) {
          output.push(
            Object.assign({}, temp, {
              name: item.name,
              _hasChild: true,
              _isExpand: this.defaultExpandAll
            })
          )
          output = [
            ...output,
            ...this.genTableData(item.children, ttId, ttLevel + 1)
          ]
        } else {
          output.push(Object.assign({}, item, temp))
        }
      })
      return output
    },
    // 获取子数据
    getChildren(id) {
      return this.dataList.filter(item => {
        let reg = new RegExp(`^${id}-`, 'g')
        return reg.test(item._tt_id) && item
      })
    },
    // 展开、折叠
    toggleExpand(_index, isTrigger = true) {
      let current = this.dataList[_index]
      let status = current._isExpand
      // 当前按钮展开状态
      this.dataList[_index]._isExpand = !status
      // 子节点显示隐藏
      status
        ? this.handleGroupHide(current._tt_id)
        : this.handleGroupShow(current._tt_id)
      isTrigger && this.$emit('toggle-expand', _index)
    },
    // 展开
    handleGroupShow(_id) {
      // 获取子节点
      let children = this.dataList.filter(item => item._tt_parent_id === _id)
      children.forEach(child => {
        this.dataList.forEach(item => {
          if (item._tt_id === child._tt_id) {
            item._isVisible = true
          }
        })
      })
    },
    // 折叠
    handleGroupHide(_id) {
      // 获取所有子节点
      let children = this.getChildren(_id)
      children.forEach(child => {
        this.dataList.forEach(item => {
          if (item._tt_id === child._tt_id) {
            // 子节点隐藏
            item._isVisible = false
            // 子菜单变成折叠状态
            if (item._hasChild) {
              item._isExpand = false
            }
          }
        })
      })
    }
  }
}
</script>

<style lang="scss">
.gantt-table {
  width: 100%;
  border-collapse: separate;
  border-spacing: 0;

  .is-weekday {
    background: #f9f9f9;
  }
}
</style>
