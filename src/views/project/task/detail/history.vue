<template>
  <!-- 历史操作 -->
  <div class="task-item-history">
    <template v-for="(item, key) in list">
      <history-item :timestamp="key" :data="item" :key="key"></history-item>
    </template>
  </div>
</template>

<script>
// api
import * as api from '@/api/make'
// components
import HistoryItem from './historyItem'
export default {
  name: 'TaskItemHistory',
  props: { id: String, visible: Boolean },
  components: { HistoryItem },
  data() {
    return {
      list: []
    }
  },
  watch: {
    id: {
      immediate: true,
      handler() {
        this.init()
      }
    },
    visible(value) {
      value && this.init()
    }
  },
  methods: {
    init() {
      this.getHistoryList()
    },
    // 获取历史操作列表数据
    async getHistoryList() {
      const { data = [] } = await api.getHistoryList({ stage_id: this.id })
      this.list = data
    }
  }
}
</script>
