<template>
  <!-- 备注 -->
  <div class="task-item-remark">
    <remark-form @submit="onAddRemark"></remark-form>
    <div class="remark-main" ref="remarkMain">
      <remark-item v-for="item in list" :data="item" :key="item.id">
        <remark-form @submit="onAddRemark(...arguments, item.type, item.id)"></remark-form>
      </remark-item>
      <infinite-loading @infinite="loadMore" :identifier="infiniteId" ref="infiniteLoading">
        <div slot="no-more"></div>
        <div slot="no-results"></div>
      </infinite-loading>
    </div>
  </div>
</template>

<script>
// api
import * as api from '@/api/make'
// components
import InfiniteLoading from 'vue-infinite-loading'
import RemarkForm from './remarkForm'
import RemarkItem from './remarkItem'

export default {
  name: 'TaskItemRemark',
  props: { id: String, visible: Boolean },
  components: { InfiniteLoading, RemarkForm, RemarkItem },
  data() {
    return {
      list: [],
      loading: true,
      page: 1,
      infiniteId: +new Date()
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
    // 初始化
    init() {
      this.page = 1
      this.list = []
      this.infiniteId += 1
    },
    // 获取备注列表数据
    async getRemarkList() {
      this.loading = true
      const { data } = await api.getRemarkList({
        stage_id: this.id,
        nowPage: this.page
      })
      this.loading = false
      this.list = [...this.list, ...(data.data || [])]
      return data
    },
    // 备注滚动加载
    async loadMore($state) {
      const { data } = await this.getRemarkList()
      if (data.length) {
        this.page += 1
        $state.loaded()
      } else {
        $state.complete()
      }
    },
    // 添加备注
    onAddRemark(content, type = 1, pid = 0) {
      api.sendRemark({ stage_id: this.id, pid, content, type }).then(() => {
        this.init()
        // 滚动到顶部
        this.$refs.remarkMain.scrollTop = 0
      })
    }
  }
}
</script>

<style lang="scss">
.task-item-remark {
  margin: 0 5px;
  .remark-form {
    max-width: 540px;
    margin: 0 auto;
  }
}
</style>
