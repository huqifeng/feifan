<template>
  <div class="task-upload" v-loading="loading">
    <upload
      :params="{file_name: form.file_name, file_remark: form.file_remark}"
      @file-added="onFileAdded"
      @file-progress="onFileProgress"
      @file-success="onFileSuccess"
      @file-error="onFileError"
      @complete="onComplete"
      @cancel="onCancel"
      ref="uploader"
    ></upload>
    <el-dialog title="上传文件" :visible.sync="dialogVisible" append-to-body class="uploadDialog">
      <el-form :rules="rules" :model="form" label-width="130px" ref="form">
        <el-form-item label="文件名称" prop="version">
          <span style="margin-right:12px;">{{fileName}}</span>
          <!-- {{projectName}}-{{taskName}} -->
          <el-input
            v-model="form.version"
            :maxlength="4"
            placeholder="版本号"
            size="mini"
            style="display:inline-block;width:100px;"
          />
          <span style="margin-left:10px;">.{{form.suffix}}</span>
        </el-form-item>
        <el-form-item label="备注">
          <el-input type="textarea" class="textarea" v-model="form.file_remark" :maxlength="50"/>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="onCancel">取消</el-button>
        <el-button type="primary" @click="onPrimary">确定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import Upload from '@/components/Upload'
import { addTaskFile } from '@/api/make'
export default {
  name: 'TaskUpload',
  props: {
    // 项目ID
    data: {
      type: Object,
      default() {
        return {}
      }
    },
    // 文件目录
    directory: { type: String, default: 'input' },
    type: { type: Number, default: 1 },
    pid: { type: String, default: '' },
    fileName: { type: String, default: '' }
  },
  components: { Upload },
  data() {
    return {
      loading: false,
      projectName: '系统默认项目名',
      taskName: '任务名',
      dialogVisible: false,
      form: {
        version: '',
        stage_id: this.data.id,
        type: this.type,
        pid: this.pid,
        file_name: '',
        file_remark: '',
        directory: this.directory,
        path: '',
        size: '',
        md5: '',
        suffix: '',
        mime_type: ''
      },
      file: null,
      rules: {
        version: [
          { required: true, message: '版本不能为空', trigger: 'blur' },
          {
            pattern: /^\d{4}$/,
            message: '版本号必须为4位数值',
            trigger: 'blur'
          }
        ]
      }
    }
  },
  computed: {
    uploader() {
      return this.$refs.uploader.uploader
    }
  },
  methods: {
    onFileAdded(file) {
      // 暂停上传
      file.pause()
      this.showDialog()
      this.file = file
      this.form.size = file.size
      this.form.mime_type = file.fileType
      this.form.suffix = file.name.split('.').pop()
      this.form.md5 = file.uniqueIdentifier
    },
    onFileProgress() {
      this.$emit('file-progress', ...arguments)
    },
    onFileSuccess(rootFile, file, response, chunk) {
      let res = JSON.parse(response)
      this.form.path = res.data.file_path
      this.form.file_name = res.data.file_name
      this.loading = true
      addTaskFile(this.form)
        .then(response => {
          this.loading = false
          this.$message({
            message: '上传成功',
            type: 'success'
          })
          this.$emit('file-success', rootFile, file, response, chunk)
        })
        .catch(() => {
          this.loading = false
          this.$emit('file-error', ...arguments)
        })
    },
    onFileError() {
      this.$emit('file-error', ...arguments)
    },
    onComplete() {
      this.$emit('complete', ...arguments)
    },
    showDialog() {
      this.form = {
        version: '',
        stage_id: this.data.id,
        pid: this.pid,
        type: this.type,
        file_name: '',
        file_remark: '',
        directory: this.directory,
        path: '',
        size: '',
        md5: '',
        suffix: '',
        mime_type: ''
      }
      this.projectName = this.data.projectname || this.projectName
      this.taskName = this.data.task_name || this.taskName
      this.dialogVisible = true
    },
    hideDialog() {
      // 清空表单
      this.$refs.form.resetFields()
      this.dialogVisible = false
    },
    onCancel() {
      this.hideDialog()
      // 取消上传
      this.file.cancel()
      this.$emit('cancel')
    },
    onPrimary() {
      this.form.file_name = `${this.fileName}${this.form.version}.${
        this.form.suffix
      }`
      this.$refs.form.validate().then(valid => {
        if (valid) {
          this.hideDialog()
          // 继续上传
          this.file.resume()
          this.$emit('start')
        }
      })
    }
  }
}
</script>

<style>
.task-upload {
  width: 100%;
  height: 220px;
}
</style>