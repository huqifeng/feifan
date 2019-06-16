<template>
  <section class="import-step" v-show="visible">
    <div class="import-main">
      <div class="import-content import-scroll">
        <table class="import-table" v-if="table.thead.length">
          <!-- 表头 -->
          <tr>
            <th>序号</th>
            <th v-for="(item, index) in table.thead" :key="`th_${index}`">{{item.comment}}</th>
          </tr>
          <!-- 数据类型选择 -->
          <tr>
            <td></td>
            <td v-for="(item, index) in table.thead" :key="`td_field_${index}`">
              <el-select
                v-model="item.value"
                placeholder="请选择"
                style="width:100%;min-width:105px;"
                class="importSelect"
              >
                <el-option
                  v-for="item in filedList"
                  :key="item.filed_name"
                  :label="item.comment"
                  :value="item.filed_name"
                ></el-option>
              </el-select>
            </td>
          </tr>
          <tr v-for="(tr, index) in table.tbody" :key="`td_${index}`">
            <td>{{index + 1}}</td>
            <td v-for="(th, index) in table.thead" :key="`td_field_${index}`">{{tr[index] || ''}}</td>
          </tr>
        </table>
      </div>
      <div class="import-tips">
        <slot name="tips"/>
      </div>
    </div>
    <div class="tips" v-if="tips" style="color:#f00;">粘贴数据过多，系统将自动导入前{{maxLength}}条数据，如需修改，请返回上一步；</div>
  </section>
</template>
<script>
import * as api from '@/api/project/task'
export default {
  props: {
    visible: { type: Boolean, default: false },
    value: { type: String },
    pid: { type: String }, // 项目ID
    fields: {
      type: Array,
      default() {
        return []
      }
    }
  },
  data() {
    return {
      filedList: this.fields, // 字段列表
      table: { thead: [], tbody: [] }, // table数据
      tips: false,
      maxLength: 1000 // 最多导入多少条
    }
  },
  watch: {
    visible: {
      immediate: true,
      handler(value) {
        value && this.init()
      }
    },
    fields: {
      immediate: true,
      handler(value) {
        this.filedList = value
      }
    },
    // 解析后的数据
    parseData: {
      immediate: true,
      deep: true,
      handler(data) {
        let { thead, tbody } = data
        thead = thead.map(item => ({ comment: item, value: '' }))
        this.table = {
          thead,
          tbody: tbody.slice(0, this.maxLength)
        }
        this.tips = tbody.length > this.maxLength
      }
    },
    // table数据
    table: {
      immediate: true,
      deep: true,
      handler(value) {
        this.$emit('output', value)
      }
    }
  },
  computed: {
    // 解析数据
    parseData() {
      return this.parseExcel(this.value)
    }
  },
  methods: {
    init() {
      this.matchHeader()
    },
    // 解析excel
    parseExcel(value = '') {
      let result = {
        thead: [],
        tbody: []
      }
      if (!value.trim()) {
        return result
      }
      // 获取行\并删除空行
      let cell = value.split('\n').reduce((result, item) => {
        if (item.trim()) {
          result.push(item.split(/\t/))
        }
        return result
      }, [])
      let [first, ...later] = cell
      // 结果
      result = { thead: first, tbody: later }
      return result
    },
    // 匹配表头
    matchHeader() {
      this.$emit('load', true)
      api
        .matchTableHeader({
          project_id: this.pid,
          mate_array: this.parseData.thead
        })
        .then(response => {
          let thead = response.data.map(item => {
            if (!item.hasOwnProperty('value')) {
              item.value = ''
            }
            return item
          })
          this.table.thead = thead
          this.$emit('load', false)
        })
        .catch(() => {
          this.$emit('load', false)
        })
    }
  }
}
</script>

<style lang="scss" scoped>
.import-table {
  width: 100%;
  border-collapse: collapse;
  border-spacing: 0;
}
.import-table td,
.import-table th {
  padding: 8px 14px;
  border: 1px solid #e4e7ed;
  font-size: 14px;
  line-height: 24px;
  text-align: center;
  max-width: 200px;
  white-space: nowrap;
  text-overflow: ellipsis;
  overflow: hidden;
}

.import-table tr:nth-of-type(2) td {
  padding: 0 14px;
}
.import-scroll {
  border: 1px solid #179bff;
}
/*.import-table tr:hover td {*/
/*background: #f5f7fa;*/
/*}*/
</style>
