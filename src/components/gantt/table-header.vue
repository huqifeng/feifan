<template>
  <thead class="gantt-table-thead">
    <tr>
      <th rowspan="2">任务名称</th>
      <template v-for="date in columns">
        <th :key="date.value" :colspan="7" v-if="date.day === 1">{{date.value | formatDate}}</th>
      </template>
    </tr>
    <tr>
      <template v-for="date in columns">
        <th :key="date.value" :class="genClass(date)">
          {{date.week}}
          <div class="is-today" v-if="date.isToday"></div>
        </th>
      </template>
    </tr>
  </thead>
</template>

<script>
import dayjs from 'dayjs'

export default {
  props: { columns: Array },
  filters: {
    formatDate(value) {
      return dayjs(value).format('YYYY年MM月DD日')
    }
  },
  methods: {
    genClass(date) {
      return {
        'is-weekday': date.day === 0 || date.day === 6
      }
    }
  }
}
</script>

<style lang="scss">
.gantt-table-thead {
  th {
    height: 40px;
    font-size: 14px;
    font-weight: normal;
    line-height: 40px;
    text-align: center;
    min-width: 40px;
    background-color: #f9f9f9;
    border-bottom: 1px solid #ebeef5;
    border-left: 1px solid #ebeef5;
  }
  .is-today {
    position: absolute;
    top: 82px;
    bottom: 0;
    width: 1px;
    margin-left: -1px;
    background-color: #f75c4c;
    z-index: 100;
  }
  .is-today::before {
    content: '';
    position: absolute;
    left: -2px;
    top: -5px;
    width: 3px;
    height: 3px;
    border-radius: 50%;
    overflow: hidden;
    border: 1px solid #f75c4c;
    color: #f75c4c;
  }
}
</style>
