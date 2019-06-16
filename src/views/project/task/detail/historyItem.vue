<template>
  <div class="history-item">
    <div class="history-item__hd" @click="toggleExpand">
      <div class="buttons">
        <!-- 展开 -->
        <template v-if="currentVisible">
          <i class="el-icon-caret-bottom"></i>
        </template>
        <!-- 折叠 -->
        <template v-else>
          <i class="el-icon-caret-top"></i>
        </template>
      </div>
      <span class="time">{{timestamp}}</span>
    </div>
    <div class="history-item__bd" v-show="currentVisible">
      <ul class="timeline">
        <li class="timeline-item" v-for="(item, index) in data" :key="index">
          <div class="timeline-item__line"></div>
          <div class="timeline-item__dot"></div>
          <div class="timeline-item__hd">
            <span class="name">{{item.realname}}</span>
            <span class="time">{{item.create_time}}</span>
          </div>
          <div class="timeline-item__bd">
            <p>{{item.remarks}}</p>
          </div>
        </li>
      </ul>
    </div>
  </div>
</template>

<script>
export default {
  name: 'HistoryItem',
  props: {
    visible: { type: Boolean, default: true },
    timestamp: { type: String },
    data: {
      type: Array,
      default() {
        return []
      }
    }
  },
  data() {
    return {
      currentVisible: this.visible
    }
  },
  methods: {
    toggleExpand() {
      this.currentVisible = !this.currentVisible
    }
  }
}
</script>

<style lang="scss">
.history-item {
  margin: 10px;
}
.history-item__hd {
  display: flex;
  padding: 0 20px;
  align-items: center;
  height: 45px;
  box-shadow: 0px 0px 5px 0px rgba(23, 155, 255, 0.3);
  cursor: pointer;

  .buttons {
    flex: 1;
    font-size: 20px;
    color: #179bff;
  }
  .time {
    font-size: 16px;
    color: #179bff;
  }
}
.history-item__bd {
  .timeline-item {
    position: relative;
    padding-top: 12px;
    padding-bottom: 64px;
    padding-left: 94px;
  }
  .timeline-item__dot {
    position: absolute;
    left: 50px;
    width: 24px;
    height: 24px;
    background: rgba(23, 155, 255, 1);
    border: 2px solid rgba(255, 255, 255, 1);
    box-shadow: 0px 0px 6px 2px rgba(23, 155, 255, 0.3);
    border-radius: 50%;
    z-index: 1;
  }
  .timeline-item__line {
    position: absolute;
    left: 64px;
    width: 2px;
    height: 100%;
    background: #179bff;
  }
  .timeline-item__hd {
    margin-bottom: 8px;

    .name {
      font-size: 16px;
      margin-right: 20px;
    }
    .time {
      font-size: 12px;
      color: #999;
    }
  }
  .timeline-item__bd {
    font-size: 14px;
    color: #179bff;
  }

  .timeline-item:last-child {
    padding-bottom: 10px;
    .timeline-item__line {
      display: none;
    }
  }
}
</style>
