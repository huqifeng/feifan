<template>
  <div>
    <file-upload
      name="myfile"
      post-action="/api/v2.0/Upload/fileUpload"
      :input-id="`upload_${$lodash.uniqueId()}`"
      :data="{fileids: fileIds}"
      :headers="options.headers"
      extensions="gif,jpg,jpeg,png,webp"
      accept="image/png, image/gif, image/jpeg, image/webp"
      :multiple="multiple"
      @input="updatetValue"
      @input-filter="inputFilter"
      @input-file="inputFile"
      v-bind="$attrs"
      ref="upload"
    >
      <slot>
        <el-button size="small" type="primary" class="uploadButton">上传</el-button>
      </slot>
    </file-upload>
  </div>
</template>

<script>
import VueUploadComponent from 'vue-upload-component'
export default {
  components: {
    'file-upload': VueUploadComponent
  },
  props: {
    value: {
      type: Array,
      default() {
        return []
      }
    },
    multiple: { type: Boolean, default: true },
    autoUpload: { type: Boolean, default: true }
  },
  data() {
    return {
      options: {
        headers: { Authorization: this.$store.state.token }
      },
      files: this.value
    }
  },
  computed: {
    upload() {
      return this.$refs.upload
    },
    fileIds() {
      return this.files
        .reduce((results, file) => {
          if (file.success && file.response && file.response.code === 0) {
            results.push(file.response.data.file_id)
          }
          return results
        }, [])
        .join(',')
    }
  },
  methods: {
    updatetValue(files) {
      this.files = files
      this.$emit('input', files)
    },
    inputFilter(newFile, oldFile, prevent) {
      if (newFile && oldFile) {
        // 上传错误
        if (newFile.error !== oldFile.error) {
          let errorOptions = {
            extension: '该文件格式尚未支持',
            size: '文件太大了'
          }
          this.$message({
            type: 'error',
            message: errorOptions[newFile.error] || '上传失败'
          })
          this.upload.remove(newFile)
          return prevent()
        }
      }
      if (newFile && (!oldFile || newFile.file !== oldFile.file)) {
        // Create a blob field
        // 创建 blob 字段
        newFile.blob = ''
        let URL = window.URL || window.webkitURL
        if (URL && URL.createObjectURL) {
          newFile.blob = URL.createObjectURL(newFile.file)
        }
        // Thumbnails
        // 缩略图
        newFile.thumb = ''
        if (newFile.blob && newFile.type.substr(0, 6) === 'image/') {
          newFile.thumb = newFile.blob
        }
      }
    },
    inputFile(newFile, oldFile) {
      // 自动上传
      if (
        Boolean(newFile) !== Boolean(oldFile) ||
        oldFile.error !== newFile.error
      ) {
        if (this.autoUpload && !this.$refs.upload.active) {
          this.$refs.upload.active = true
        }
      }
      if (newFile && oldFile) {
        // Remove file
        // Automatically delete files on the server
        if (newFile.success && newFile.response.code !== 0) {
          this.$message({ type: 'error', message: newFile.response.msg })
          this.$refs.upload.remove(newFile)
        }
      }
    }
  }
}
</script>

<style lang="scss">
.file-uploads label {
  cursor: pointer;
}
</style>
