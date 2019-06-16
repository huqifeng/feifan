<template>
  <div class="design">
    <template v-if="type === 'video'">
      <!-- <video src="/trailer.mp4" autoplay controls ref="video" id="play"></video> -->
      <video
        :src="url | imageUrl"
        autoplay
        controls
        ref="video"
        :id="playId"
        controlslist="nodownload"
      ></video>
    </template>
    <template v-if="type === 'image'">
      <!-- <img src="/default.png" id="play"> -->
      <img :src="url | imageUrl" :id="playId">
    </template>
    <template v-if="type === 'multipleImage'">
      <multiple-image-preview
        class="multiple-image"
        :urls="urls"
        @change="multipleImageChange"
        ref="multipleImage"
      ></multiple-image-preview>
    </template>
    <div class="canvas-container" v-show="visible" :style="genContainerStyle">
      <canvas class="canvas" id="canvas" :width="width" :height="height"></canvas>
    </div>
    <div class="tools">
      <button
        type="button"
        class="button button-play"
        @click="play"
        v-show="visible && type === 'video'"
      >
        <i class="el-icon-caret-right"></i>
      </button>
      <button type="button" class="button" @click="drawImage">
        <i class="el-icon-edit"></i>
      </button>
    </div>
  </div>
</template>

<script>
import SimpleDrawingBoard from 'simple-drawing-board'
import MultipleImagePreview from './MultipleImagePreview'

export default {
  components: { MultipleImagePreview },
  props: {
    type: { type: String, default: 'video' },
    url: { type: String },
    urls: {
      type: Array,
      default() {
        return []
      }
    }
  },
  data() {
    return {
      playId: `play_${this.$lodash.uniqueId()}`,
      sdb: null,
      width: 0,
      height: 0,
      visible: false,
      playElement: null,
      fileLoaded: false
    }
  },
  computed: {
    genContainerStyle() {
      return {
        background: this.type === 'multipleImage' ? 'transparent' : '#23282d',
        width: this.type === 'multipleImage' ? `${this.width}px` : false,
        height: this.type === 'multipleImage' ? `${this.height}px` : false
      }
    }
  },
  methods: {
    // 初始化
    async init() {
      this.playElement = document.querySelector(`#${this.playId}`)
      switch (this.type) {
        case 'video':
          // 渲染视频
          await this.renderVideo()
          break
        case 'image':
          // 渲染图片
          await this.renderImage()
          break
        default:
          // 渲染序列帧
          await this.renderMultipleImage()
          break
      }
      // 渲染画板
      this.renderBoard()
    },
    // 渲染视频
    async renderVideo() {
      // 加载视频
      !this.fileLoaded &&
        (await new Promise(reslove => {
          this.playElement.load()
          this.playElement.onloadeddata = () => {
            this.fileLoaded = true
            reslove(this.playElement)
          }
        }))
    },
    // 渲染图片
    async renderImage() {
      // 加载图片
      !this.fileLoaded &&
        (await new Promise(reslove => {
          this.playElement.onload = () => {
            this.fileLoaded = true
            reslove(this.playElement)
          }
        }))
    },
    // 渲染序列帧
    async renderMultipleImage() {
      // 加载第一张图片
      let [url] = this.urls
      let img = new Image()
      img.src = url
      this.playElement = img
      // 加载图片
      !this.fileLoaded &&
        (await new Promise(reslove => {
          this.playElement.onload = () => {
            this.fileLoaded = true
            reslove(this.playElement)
          }
        }))
    },
    setStyle() {
      let el = this.playElement
      let partent = document.querySelector('.design')
      let width = el.width || el.videoWidth
      let height = el.height || el.videoHeight
      let ratio = height / width
      if (partent.offsetHeight / partent.offsetWidth > ratio) {
        this.width = partent.offsetWidth
        this.height = partent.offsetWidth * ratio
      } else {
        this.width = partent.offsetHeight / ratio
        this.height = partent.offsetHeight
      }
      this.playElement.width = this.width
      this.playElement.height = this.height
    },
    // 渲染画板
    renderBoard() {
      this.setStyle()
      this.sdb && this.sdb.dispose()
      this.$nextTick(function() {
        this.sdb = new SimpleDrawingBoard(document.querySelector('#canvas'), {
          lineColor: '#4a90e2',
          lineSize: 5
        })
      })
    },
    // 画图
    drawImage() {
      this.visible = true
      if (this.type === 'video') {
        // 暂停视频
        this.playElement.pause()
      }
      if (this.type === 'multipleImage') {
        // 暂停序列帧
        this.$refs.multipleImage.pause()
        // 截图
        this.$refs.multipleImage.keyFrames &&
          this.sdb.setImg(this.$refs.multipleImage.keyFrames.canvas)
      } else {
        // 截图
        this.sdb.setImg(this.playElement)
      }
      this.$emit('drawing')
    },
    play() {
      this.visible = false
      if (this.type === 'video') {
        this.playElement.play()
      }
    },
    multipleImageChange() {
      this.visible = false
    }
  },
  mounted() {
    this.init()
    window.onresize = () => {
      this.visible = false
      this.init()
    }
  },
  beforeDestroy() {
    window.onresize = null
  }
}
</script>

<style lang="scss" scoped>
video {
  width: 100%;
  height: 100%;
  background: #000;
}
.design {
  position: absolute;
  left: 0;
  top: 0;
  right: 0;
  bottom: 0;
  img,
  .multiple-image {
    position: absolute;
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%);
  }
  .multiple-image {
    margin-top: 28px;
    z-index: 101;
  }
  .canvas-container {
    position: absolute;
    left: 50%;
    top: 50%;
    width: 100%;
    height: 100%;
    z-index: 102;
    background: #23282d;
    transform: translate(-50%, -50%);
    .canvas {
      position: absolute;
      left: 50%;
      top: 50%;
      transform: translate(-50%, -50%);
    }
  }
  .tools {
    position: absolute;
    left: 0;
    right: 0;
    bottom: -56px;
    padding: 10px;
    background-color: #232a2f;
    text-align: right;
    .button {
      position: relative;
      font-size: 20px;
      width: 36px;
      height: 36px;
      border-radius: 2px;
      border: 0;
      background-color: transparent;
      cursor: pointer;
      color: #e9eaea;
      z-index: 102;
    }
    .button-play {
      float: left;
    }
    .button:hover {
      color: #5cb6ff;
      background: rgba(233, 234, 234, 0.2);
    }
  }
}
</style>

<style>
.multiple-image .controls {
  top: 100%;
}
</style>