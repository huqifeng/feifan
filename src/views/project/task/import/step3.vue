<template>
  <section class="import-step" v-show="visible">
    <div class="import-main">
      <div
        class="import-content"
        :id="dropId"
        style="border: 1px solid #179BFF;padding:0 0 9px 9px"
      >
        <div style="text-align:right;">
          <file-upload
            style="float:right;margin-top:-40px;"
            :drop="`#${dropId}`"
            v-model="files"
            ref="uploader"
          ></file-upload>
        </div>
        <div class="import-scroll">
          <div class="file-list">
            <div class="file-item" v-for="file in files" :key="file.id">
              <div class="progress" v-if="!file.success">
                <el-progress type="circle" :percentage="parseFloat(file.progress)"></el-progress>
              </div>
              <template v-else>
                <!-- <div class="tools">
                  <i class="el-icon-circle-close" @click="removeFile(file)"></i>
                </div>-->
                <div class="pic">
                  <img :src="file.thumb">
                </div>
                <div class="content">{{file.name}}</div>
              </template>
            </div>
          </div>
        </div>
      </div>
      <div class="import-tips">
        <slot name="tips"/>
      </div>
    </div>
    <div class="tips" v-if="fileUploadSuccessTotal">{{fileUploadSuccessTotal}}张图片导入成功,等待与任务匹配</div>
  </section>
</template>
<script>
import FileUpload from '@/components/FileUpload'

export default {
  components: { FileUpload },
  props: {
    visible: { type: Boolean, default: false }
  },
  data() {
    return {
      dropId: `import_drop_${this.$lodash.uniqueId()}`,
      files: [] // 文件列表
    }
  },
  watch: {
    files: {
      immediate: true,
      deep: true,
      handler(value) {
        this.$emit('input', value)
      }
    }
  },
  computed: {
    fileUploadSuccessTotal() {
      return this.files.reduce((result, item) => {
        if (item.success) {
          result += 1
        }
        return result
      }, 0)
    }
  },
  methods: {
    // 删除文件
    removeFile(file) {
      this.$refs.uploader.upload.remove(file)
    }
  }
}
</script>

<style lang="scss" scoped>
.file-list {
  display: flex;
  flex-wrap: wrap;
}
.file-item {
  position: relative;
  width: 150px;
  height: 126px;
  border: 1px solid #ddd;
  margin-right: 10px;
  margin-top: 10px;
  padding: 8px;
  text-align: center;
  .tools {
    display: none;
    position: absolute;
    top: -10px;
    right: -10px;
    font-size: 20px;
    [class^='el-icon-'] {
      cursor: pointer;
    }
  }
  .pic {
    width: 100%;
    height: 100px;
    overflow: hidden;
    img {
      width: 100%;
      height: 100%;
      object-fit: contain;
    }
  }
  .content {
    font-size: 14px;
    color: #333333;
    height: 30px;
    line-height: 30px;
    white-space: nowrap;
    text-overflow: ellipsis;
    overflow: hidden;
  }
  .progress {
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
  }
}
.file-item:hover {
  .tools {
    display: block;
  }
}
</style>
