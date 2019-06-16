<template>
  <div class="updateNew">
    <input type="file" @change="selectFile">
    <button @click="cencel">暂停</button>
    <button @click="resumeUpload">继续上传</button>
  </div>
</template>

<script>
import http from '@/libs/http'
// let OSS = require('ali-oss');
import OSS from 'ali-oss'
import { async } from 'q'
let Base64 = require('js-base64').Base64

export default {
  name: 'UploadNew',
  data() {
    return {
      client: '',
      tempCheckpoint: '',
      resumeclient: '',
      ossConfig: {},
      fileObj: '',
      ls: '',
      storeAs: 'huqifeng/0024.zip'
    }
  },
  mounted() {
    this.ls = window.localStorage
    console.log(this.ls.getItem('upload'))
    console.log(this.ls.getItem('fileobj'))

    this.initConfig() // 调用后台接口获取阿里云上传下载通行证
  },
  methods: {
    initConfig() {
      this.getTmpKey({}).then(response => {
        let data = response.data
        console.log(response)
        this.client = new OSS({
          region: 'oss-cn-beijing',
          accessKeyId: data.accessKeyId,
          accessKeySecret: data.accessKeySecret,
          stsToken: data.securityToken,
          bucket: 'feelfine-wms'
        })
        this.ossConfig = {
          region: 'oss-cn-beijing',
          accessKeyId: data.accessKeyId,
          accessKeySecret: data.accessKeySecret,
          stsToken: data.securityToken,
          bucket: 'feelfine-wms'
        }
      })
    },
    getTmpKey(data) {
      return http({
        url: 'api/Osssts/getTmpKey',
        method: 'get',
        data
      })
    },
    selectFile(e) {
      console.log(e.target.files[0])
      console.log(e.target.files[0].size / 1024 / 1024)
      this.fileObj = e.target.files[0]

      //文件大小
      let fileSize = e.target.files[0].size / 1024 / 1024
      // return

      if (fileSize > 100) {
        //
        this.pushFileMul(e.target.files[0])
      } else {
        this.pushFile(e.target.files[0])
      }
    },
    pushFileMul: async function(file) {
      let that = this
      let _file = file

      that.client = new OSS(this.ossConfig)
      // 调用上传方法
      that.client
        .multipartUpload(that.storeAs, _file, {
          parallel: 10,
          partSize: 10 * 1020 * 1024,
          progress: function(percentage, checkpoint) {
            let fileloadingNum = Math.ceil(percentage * 100) + '%'
            console.log(fileloadingNum) // 上传文件进度
            that.tempCheckpoint = checkpoint
            console.log(checkpoint)
          }
        })
        .then(function(result) {
          // 调用后台添加文件的接口
          console.log(result)
        })
        .catch(function(err) {
          // 上传失败,弹出上传失败的消息
          console.log(err)
        })
    },
    pushFile: async function(file) {
      let that = this
      let _file = file

      that.client = new OSS(this.ossConfig)
      that.client
        .put(that.storeAs, _file, {
          progress: async function(percentage) {
            let fileloadingNum = Math.ceil(percentage * 100) + '%'
            console.log(fileloadingNum) // 上传文件进度
          }
        })
        .then(function(result) {
          console.log(result)
        })
        .catch(function(err) {
          console.log(err)
        })
    },
    resumeUpload: async function() {
      let that = this
      that.resumeclient = new OSS(that.ossConfig)
      that.resumeclient
        .multipartUpload(that.storeAs, that.fileObj, {
          parallel: 10,
          partSize: 10 * 1020 * 1024,
          progress: function(percentage, checkpoint) {
            let fileloadingNum = Math.ceil(percentage * 100) + '%'
            console.log(fileloadingNum) // 上传文件进度
            that.tempCheckpoint = checkpoint
          },
          checkpoint: that.tempCheckpoint
        })
        .then(res => {
          console.log(res)
        })
        .catch(err => {
          console.lo(err)
        })
    },
    cencel: function() {
      // console.log(JSON)
      this.client.cancel()
      this.resumeclient.cancel()
    }
  }
}
</script>

<style>
</style>