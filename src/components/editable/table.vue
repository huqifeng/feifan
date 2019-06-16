<template>
  <div class="editable-table-wrapper" ref="editable">
    <slot/>
  </div>
</template>

<script>
import $ from 'jquery'
export default {
  name: 'EditableTable',
  data() {
    return {
      key: '', // 当前选中的字段
      ids: [], // 选中的ID
      isLock: false, // 锁定选中状态
      isSelected: false, // 是否选中
      startY: 0, // 开始纵坐标
      endY: 0 // 结束纵坐标
    }
  },
  methods: {
    // 设置选中状态
    setSelectedItem(target, isRemove = false) {
      if (this.isLock) {
        return false
      }
      // 设置key
      this.key = target.getAttribute('data-key')
      // 设置下标数据
      this.setSelectedIds(target.getAttribute('data-id'), isRemove)
      // 选中状态
      if (isRemove) {
        target.classList.remove('is-selected')
      } else {
        target.classList.add('is-selected')
      }
    },
    // 设置选中的下标
    setSelectedIds(id, isRemove = false) {
      if (this.isLock) {
        return false
      }
      !this.ids.includes(id) && this.ids.push(id)
      // 移除
      if (isRemove) {
        this.ids = this.ids.filter(item => item !== id)
      }
    },
    // 清除选中状态
    clearSelected() {
      // 清空data
      this.key = ''
      this.ids = []
      this.isLock = false
      // 移除is-selected class
      $('.editable-table-wrapper .is-editable').removeClass('is-selected')
    },
    // 显示编辑
    showEditable() {
      this.isLock = true
      this.$emit('show', this.key, this.ids)
    },
    // 隐藏编辑
    hideEditable() {
      this.isLock = false
      this.clearSelected()
      this.$emit('hide')
    },
    // 点击的时候
    handleClick(target) {
      let key = target.getAttribute('data-key')
      if (this.key !== '' && key !== this.key) {
        this.clearSelected()
        // return false
      }
      // 设置选中状态
      this.setSelectedItem(target, target.classList.contains('is-selected'))
    },
    // 鼠标摁下的时候
    handleMousedown(event, callback) {
      event.preventDefault()
      let target = $(event.target).parents('.is-editable')[0]
      if (
        event.ctrlKey ||
        !target ||
        $(event.target).is('.editable-cell-pencil')
      ) {
        return true
      }
      let key = target.getAttribute('data-key')
      if (this.key !== key) {
        this.clearSelected()
      }
      this.key = key
      // 保留开始下标
      this.startY = event.pageY
      callback && callback()
    },
    // 拖动的时候
    handleMove(event) {
      let moveY = event.pageY
      let editableNodeList = $(`.is-editable[data-key=${this.key}]`)
      $.each(editableNodeList, (index, element) => {
        let { top, height } = element.getBoundingClientRect()
        top =
          top + (document.documentElement.scrollTop || document.body.scrollTop)
        if (this.startY > moveY) {
          // 从下往上拖拽
          this.setSelectedItem(
            element,
            !(moveY < top + height && top < this.startY)
          )
        } else {
          // 从上往下拖拽
          this.setSelectedItem(
            element,
            !(moveY > top && top + height > this.startY)
          )
        }
      })
    },
    handleMouseup(event) {
      // 保留结束下标
      this.endY = event.pageY
      $(document).off('mousemove.move')
      $(document).off('mouseup.move')
    },
    // 事件绑定
    bindEvent() {
      let _this = this
      // 点击选择
      $('.editable-table-wrapper').on('click', '.is-editable', function(event) {
        event.ctrlKey && _this.handleClick(this)
      })
      // 拖动选择
      $('.editable-table-wrapper').on('mousedown', event => {
        _this.handleMousedown(event, () => {
          $(document).on('mousemove.move', _this.handleMove)
          $(document).on('mouseup.move', _this.handleMouseup)
        })
      })
      // 显示编辑
      $('.editable-table-wrapper').on(
        'click',
        '.editable-cell-pencil',
        function() {
          // 设置选中
          _this.setSelectedItem($(this).parents('.is-editable')[0])
          // 显示编辑
          _this.showEditable()
          return false
        }
      )
      // 取消选中
      $(document).on('mouseup', function(event) {
        // 取消选中状态
        if (
          !$('.is-editable').is(event.target) &&
          !$('.is-editable').has(event.target).length
        ) {
          !_this.isLock && _this.clearSelected()
        }
      })
    },
    removeEvent() {
      // 解绑
      $('.editable-table-wrapper').off()
      $(document).off('mouseup', '**')
    }
  },
  mounted() {
    this.bindEvent()
  },
  beforeDestroy() {
    this.removeEvent()
  }
}
</script>
<style lang="scss">
.editable-table-wrapper td {
  position: relative;
  padding: 0;
  height: 40px;
}
</style>