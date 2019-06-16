<template>
  <div class="group-table-wrapper">
    <div class="group-table-body">
      <table class="group-table">
        <table-header :columns="columns" :data="dataList"></table-header>
        <table-body :columns="columns" :data="dataList"></table-body>
      </table>
    </div>
    <div style="display:none;">
      <slot></slot>
    </div>
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
    data: {
      type: Array,
      required: true,
      default() {
        return []
      }
    },
    head: {
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
      columns: [], // 表列
      dataList: [], // 自己组装的表数据
      multipleSelection: []
    }
  },
  watch: {
    data: {
      immediate: true,
      deep: true,
      handler() {
        this.init()
      }
    },
    head: {
      immediate: true,
      deep: true,
      handler() {
        this.init()
      }
    },
    multipleSelection(value) {
      this.$emit('selection-change', value)
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
      // 数据改变，清空选中
      this.multipleSelection = []
      this.dataList = this.genTableData(this.data)
      this.$nextTick(function() {
        this.genColumns()
      })
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
    // 生成表列
    genColumns() {
      const columnComponents = this.$slots.default
        .filter(column => column.componentInstance)
        .map(column => column.componentInstance)
      this.columns = columnComponents.map(columnCom => {
        return Object.keys(columnCom.$options.props).reduce((result, prop) => {
          result[prop] = columnCom[prop]
          if (columnCom.$scopedSlots.default && this.dataList.length) {
            result.type = 'slot'
            result.renderSlot = data => columnCom.$scopedSlots.default(data)
          }
          return result
        }, {})
      })
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
    },
    // 全部选择
    selectAll(status = false) {
      this.dataList.forEach(item => {
        item._isChecked = status
      })
      this.multipleSelection = this.getSelection()
      this.$emit('select-all', this.multipleSelection)
    },
    // 切换选中状态
    toggleSelect(_index, isChecked) {
      let current = this.dataList[_index]
      if (current._isChecked === isChecked) {
        return false
      }
      this.dataList[_index]._isChecked =
        isChecked === undefined ? !current._isChecked : isChecked
      // 设置选中的数据
      this.multipleSelection = this.getSelection()
      this.$emit('select', this.multipleSelection)
    },
    // 获取选中的数据
    getSelection() {
      let selectionIndexes = this.dataList.reduce((results, item, index) => {
        if (item._isChecked && !item._hasChild) {
          results.push(index)
        }
        return results
      }, [])
      return selectionIndexes.map(index => {
        return this.rawData[index]
      })
    },
    toggleRowSelection(row, isChecked) {
      let _index = this.rawData.findIndex(item => Object.is(item, row))
      if (_index !== -1) {
        this.toggleSelect(_index, isChecked)
      }
    },
    // 右键
    headerContxtmenu() {
      this.$emit('header-contextmenu', ...arguments)
    },
    // 点击行
    clickCurrentRow(_index, event) {
      if (!this.dataList[_index].hasOwnProperty('_hasChild')) {
        this.$emit('row-click', this.rawData[_index], null, event)
      }
    }
  }
}
</script>

<style lang="scss">
.group-table-body {
  width: 100%;
  overflow-x: auto;
}
.group-table {
  width: 100%;
  border-collapse: separate;
  border-spacing: 0;
  color: #333;
}

.group-table th {
  position: relative;
  min-width: 40px;
  padding: 12px 0;
  background-color: #f9f9f9;
  text-align: center;
  box-sizing: border-box;
  border-bottom: 1px solid #ebeef5;
  cursor: default;
}
.group-table th .cell {
  font-size: 14px;
  line-height: 23px;
  font-weight: 700;
  color: #555;
  text-align: center;
}
.group-table td {
  position: relative;
  height: 40px;
  background-color: #fff;
  border-bottom: 1px solid #ebeef5;
  vertical-align: middle;
}
.group-table .is-group-row .cell {
  margin-left: 10px;
  text-align: left;
}
.group-table .cell {
  text-align: center;
  max-height: 40px;
  text-overflow: ellipsis;
  white-space: nowrap;
  overflow: hidden;
  padding-left: 10px;
  padding-right: 10px;
}
.group-table tr:hover > td {
  background-color: #f5f7fa;
}
</style>
