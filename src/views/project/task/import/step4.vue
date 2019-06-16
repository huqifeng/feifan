<template>
  <section class="import-step" v-show="visible">
    <div class="import-main">
      <div class="import-content import-scroll">
        <el-table border :data="table.tbody" style="width: 100%" class="comTable">
          <el-table-column type="index" label="序号" v-if="table.thead.length"></el-table-column>
          <el-table-column
            v-for="item in table.thead"
            :prop="item.filed_name"
            :label="item.comment"
            :key="item.filed_name"
            :width="120"
          >
            <template slot-scope="scope">
              <template v-if="item.filed_name === 'task_image'">
                <a
                  v-if="scope.row[item.filed_name]"
                  :href="scope.row[item.filed_name] | imageUrl"
                  target="_blank"
                >
                  <img :src="scope.row[item.filed_name] | imageUrl" width="100%" height="100%">
                </a>
              </template>
              <template v-else>{{scope.row[item.filed_name]}}</template>
            </template>
          </el-table-column>
        </el-table>
      </div>
      <div class="import-tips">
        <slot name="tips"/>
      </div>
    </div>
    <div class="tips">
      <template v-if="isUpdate">
        <p>
          <span style="color:red;">{{resultTotal.success}}</span>条数据，
          <span style="color:red;">{{resultTotal.imageSuccess}}</span>张缩略图匹配成功&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
          <span
            style="color:red;"
          >{{resultTotal.errorDataNumber}}</span>条数据匹配失败；
        </p>
      </template>
      <template
        v-else
      >{{files.length - resultTotal.fileIds.length}}张缩略图与系统内{{resultTotal.success}}条任务匹配成功，点击“完成”导入系统</template>
    </div>
  </section>
</template>
<script>
import * as api from '@/api/project/task'
export default {
  props: {
    visible: { type: Boolean, default: false },
    fields: {
      type: Array,
      default() {
        return []
      }
    },
    pid: { type: String }, // 项目ID
    files: {
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
    }
  },
  data() {
    return {
      table: {
        thead: [],
        tbody: []
      },
      resultTotal: {
        errorDataNumber: 0,
        success: 0,
        imageSuccess: 0,
        fileIds: []
      }
    }
  },
  watch: {
    visible: {
      immediate: true,
      handler(value) {
        value && this.init()
      }
    }
  },
  computed: {
    isUpdate() {
      return !!this.data.length
    }
    // 失败数量统计
    // errorTotalCount() {
    //   let { repeat = 0, stage_name = 0, stage_type = 0 } = this.tips
    //   return repeat + stage_name + stage_type
    // }
  },
  methods: {
    // 初始化
    init() {
      this.matchImage()
    },
    // 匹配图片
    matchImage() {
      this.$emit('load', true)
      // 缩略图数据整理
      let fileIds = this.files.reduce((results, file) => {
        if (file.success && file.response.code === 0) {
          results.push(file.response.data.file_id)
        }
        return results
      }, [])
      // 匹配结果
      api
        .matchImage({
          project_id: this.pid,
          file_ids: fileIds,
          data: JSON.stringify(this.data)
        })
        .then(response => {
          let {
            data: tbody,
            errorDataNumber,
            success,
            image_success: imageSuccess,
            fileIds = []
          } = response.data
          let [first = {}] = tbody
          let thead = this.fields.reduce((results, item) => {
            if (first.hasOwnProperty(item.filed_name)) {
              results.push(item)
            }
            return results
          }, [])
          // 结果数据
          this.table = { thead, tbody }
          this.resultTotal = { errorDataNumber, success, imageSuccess, fileIds }
          this.$emit('output', { table: { thead, tbody }, fileIds })
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
.import-scroll {
  border: 1px solid #179bff;
}
.task-import .tips {
  padding-top: 20px;
  margin-bottom: -45px;
}
</style>