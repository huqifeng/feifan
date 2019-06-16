<template>
  <el-dialog
    title="导入任务和修改缩略图"
    :visible.sync="dialogVisible"
    width="80%"
    :before-close="handleClose"
    :close-on-click-modal="false"
    :close-on-press-escape="false"
    @click.stop
    class="task-import importDialog importTab"
  >
    <el-tabs v-model="activeName" type="card">
      <!-- 添加 -->
      <el-tab-pane label="批量导入" name="task" v-loading="add.loading">
        <!-- 第一步 -->
        <step-1 v-model="add.inputValue" :visible="add.active === 0">
          <template v-slot:tips>
            <p>
              <span>第1步：提供导入数据</span>
            </p>
            <p>批量导入允许您一次创建不超过1000个镜头，超过部分将无法被导入。</p>
            <p>您必须将制表符分隔的数据粘贴到文本区域中。最简单的方法是从Excel复制和粘贴。</p>
            <p>确保列名称位于第一行，并在以下行中包含要导入的数据。删除所有空白行。</p>
            <p>您可以让Movtile为您导入的每一行创建新记录，或者更新现有任务的缩略图。要更新现有记录，您需要点击批量修改上传图片。</p>
          </template>
        </step-1>
        <!-- 第二步 -->
        <step-2
          :value="add.inputValue"
          :visible="add.active === 1"
          :pid="pid"
          :fields="fields"
          @output="outputTable"
          @load="load('add', ...arguments)"
        >
          <template v-slot:tips>
            <p>
              <span>第2步：映射列</span>
            </p>
            <p>将我们在数据中找到的列标题与正确的Movtile列匹配。或者您可以选择忽略一些列以进行此导入。</p>
          </template>
        </step-2>
        <!-- 第三步 -->
        <step-3 v-model="add.files" :visible="add.active === 2">
          <template v-slot:tips>
            <p>
              <span>第3步：上传缩略图</span>
            </p>
            <p>您可以在粘贴数据表格后导入一些图片，Movtile会过滤掉名称重复的图片，并将名称正确的图片与导入表格中的数据根据“镜头号”字段进行匹配，会在下一步呈现匹配结果</p>
            <p>系统支持图片格式为JPG.JPEG.GIF.PNG，且图片小于5M，超过则无法上传。</p>
          </template>
        </step-3>
        <!-- 第四步 -->
        <step-4
          :visible="add.active === 3"
          :pid="pid"
          :fields="fields"
          :files="add.files"
          :data="tableData"
          @output="outputImportData"
          @load="load('add', ...arguments)"
        >
          <template v-slot:tips>
            <p>
              <span>第4步：图片与任务匹配</span>
            </p>
            <p>请确认需要导入的数据和图片，如果您想添加图片可以返回上一步继续选择；</p>
          </template>
        </step-4>
        <div class="footer-buttons">
          <el-button
            style="border:none; font-size: 16px;color: #409eff;"
            size="small"
            @click="prev('add')"
            v-show="add.active !== 0"
          >上一步</el-button>
          <el-button
            size="small"
            :disabled="add.disabled"
            @click="next('add')"
            v-show="add.active !== 3"
            style="border:none;font-size: 16px;color: #409eff;"
          >下一步</el-button>
          <el-button
            type="primary"
            size="small"
            class="uploadButton"
            @click="primary('insert')"
            v-show="add.active === 3"
          >完成</el-button>
        </div>
      </el-tab-pane>
      <!-- 修改 -->
      <el-tab-pane label="批量修改" name="picture" v-loading="update.loading">
        <!-- 第一步 -->
        <step-3 v-model="update.files" :visible="update.active === 0">
          <template v-slot:tips>
            <p>
              <span>第1步：上传缩略图</span>
            </p>
            <p>您可以直接导入一些图片，Movtile会过滤掉名称重复的图片，并将名称正确的图片与系统中的镜头任务根据“镜头号”字段进行匹配，会在下一步呈现匹配结果</p>
            <p>系统支持图片格式为JPG.JPEG.GIF.PNG，且图片小于5M，超过则无法上传。</p>
          </template>
        </step-3>
        <!-- 第二步 -->
        <step-4
          :visible="update.active === 1"
          :pid="pid"
          :fields="fields"
          :files="update.files"
          @output="outputImportData"
          @load="load('update', ...arguments)"
        >
          <template v-slot:tips>
            <p>
              <span>第2步：图片与任务匹配</span>
            </p>
            <p>请确认需要导入的缩略图，如果您想添加图片可以返回上一步继续选择；</p>
            <p>系统支持图片格式为JPG.JPEG.GIF.PNG，且图片小于5M，超过则无法上传。</p>
          </template>
        </step-4>
        <div class="footer-buttons">
          <el-button
            style="border:none;color:#179BFF;font-size: 16px;"
            size="small"
            @click="prev('update')"
            v-show="update.active !== 0"
          >上一步</el-button>
          <el-button
            style="border:none;font-size: 16px;color: #409eff;"
            size="small"
            @click="next('update')"
            v-show="update.active !== 1"
          >下一步</el-button>
          <el-button
            type="primary"
            size="small"
            @click="primary('update')"
            v-show="update.active === 1"
          >完成</el-button>
        </div>
      </el-tab-pane>
    </el-tabs>
  </el-dialog>
</template>

<script>
import * as api from '@/api/project/task'
import step1 from './step1'
import step2 from './step2'
import step3 from './step3'
import step4 from './step4'

export default {
  components: { step1, step2, step3, step4 },
  props: {
    visible: { type: Boolean, default: false },
    // 项目ID
    pid: { type: String, default: '' },
    // 版本ID
    versionId: { type: String, required: true, default: '' }
  },
  data() {
    return {
      dialogVisible: this.visible,
      activeName: 'task',
      // 批量导入
      add: {
        active: 0,
        loading: false,
        inputValue: '',
        files: [],
        disabled: true
      },
      // 批量修改
      update: {
        active: 0,
        loading: false,
        files: []
      },
      // 字段列表
      fields: [],
      // 输入整理后的数据
      table: {
        thead: [],
        tbody: []
      },
      // 匹配后可以导入的数据
      importData: { table: { thead: [], body: [] }, fileIds: [] }
    }
  },
  watch: {
    visible: {
      immediate: true,
      handler(value) {
        this.dialogVisible = value
      }
    },
    'add.inputValue'(value) {
      this.add.disabled = !value.trim()
    }
  },
  computed: {
    // table数据整理
    tableData() {
      return this.table.tbody.reduce((results, tr) => {
        let item = {}
        this.table.thead.forEach((th, index) => {
          let key = th.value
          if (key && !item.hasOwnProperty(key)) {
            item[key] = tr[index]
          }
        })
        if (!this.$lodash.isEmpty(item)) {
          results.push(item)
        }
        return results
      }, [])
    },
    fileUploadSuccessTotal() {
      // 上传成功的图片减去重复的图片数量
      return (
        this.update.files.reduce((result, item) => {
          if (item.success) {
            result += 1
          }
          return result
        }, 0) - this.importData.fileIds.length
      )
    }
  },
  methods: {
    // 初始化
    init() {
      this.getTableHeader()
    },
    // 上一步
    prev(activeName) {
      this[activeName].active -= 1
    },
    // 下一步
    next(activeName) {
      if (!this.check(activeName)) {
        return false
      }
      this[activeName].active += 1
    },
    check(activeName) {
      // 必须上传缩略图
      if (
        (activeName === 'add' && this[activeName].active === 2) ||
        (activeName === 'update' && this[activeName].active === 0)
      ) {
        // 缩略图数据整理
        let fileIds = this[activeName].files.reduce((results, file) => {
          if (file.success && file.response.code === 0) {
            results.push(file.response.data.file_id)
          }
          return results
        }, [])
        if (!fileIds.length) {
          this.$message({ type: 'error', message: '请上传缩略图' })
          return false
        }
      }
      if (activeName === 'add') {
        if (this.add.active === 1 && !this.tableData.length) {
          this.$message({ type: 'error', message: '没有可以导入的数据' })
          return false
        }
      } else {
        // 修改的下一步
      }
      return true
    },
    // 完成
    primary(type) {
      if (!this.importData.table.tbody.length) {
        this.$message({ type: 'error', message: '没有可以导入的数据' })
        return false
      }
      let customize = this.importData.table.thead.reduce((results, item) => {
        if (item.is_customize) {
          results.push(item.filed_name)
        }
        return results
      }, [])
      api
        .importTask({
          type,
          project_id: this.pid,
          version_id: this.versionId,
          data: JSON.stringify(this.importData.table.tbody),
          fileIds: JSON.stringify(this.importData.fileIds),
          customize
        })
        .then(response => {
          let tips = ''
          if (this.activeName === 'task') {
            tips = `<p>${response.data.success}条数据导入成功；</p><p>${
              response.data.error
            }条数据导入失败；</p>`
          } else {
            tips = `<p>${this.fileUploadSuccessTotal}张缩略图导入成功；</p><p>${
              response.data.success
            }条任务修改成功；${response.data.error}条任务修改失败；</p>`
          }
          this.$alert(tips, '导入提示', {
            dangerouslyUseHTMLString: true,
            callback: () => {
              this.handleClose()
              this.$emit('updated')
            }
          })
        })
    },
    // 关闭模态框
    handleClose() {
      this.dialogVisible = false
      this.$emit('update:visible', false)
    },
    // 获取表头
    getTableHeader() {
      api.projectTableHeader({ project_id: this.pid }).then(response => {
        this.fields = [{ comment: '不导入', filed_name: '' }, ...response.data]
      })
    },
    // 第二步编辑后输出的table数据
    outputTable(table) {
      this.table = table
    },
    // 可导入输出的table数据
    outputImportData(data) {
      this.importData = data
    },
    load(activeName, loading) {
      this[activeName].loading = loading
    }
  },
  beforeMount() {
    this.init()
  }
}
</script>

<style lang="scss" >
.task-import {
  .import-main {
    display: flex;
  }
  .import-content {
    flex: 1;
  }
  .import-scroll {
    height: 63vh;
    overflow: auto;
  }
  .import-tips {
    width: 288px;
    background: #f2f2f2;
    padding: 60px 36px;
    margin-left: 50px;
    margin-top: -70px;
    p {
      line-height: 24px;
      margin-bottom: 10px;
    }
  }
  .footer-buttons {
    text-align: right;
    padding-top: 20px;
    padding-right: 396px;
  }
  .tips {
    padding-top: 10px;
    line-height: 24px;
  }
}
</style>