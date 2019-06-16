<template>
  <div class="multiple-image-preview" :class="playId">
    <div :id="playId" :style="genStyle"></div>
    <div class="controls" v-if="urls.length">
      <button type="button" class="button" @click="prev">
        <i class="el-icon-caret-left"></i>
      </button>
      <button type="button" class="button" @click="play" v-show="state === 'stop'">
        <i class="el-icon-video-play"></i>
      </button>
      <button type="button" class="button" @click="pause" v-show="state === 'play'">
        <i class="el-icon-video-pause"></i>
      </button>
      <button type="button" class="button" @click="next">
        <i class="el-icon-caret-right"></i>
      </button>
    </div>
  </div>
</template>

<script>
import CanvasKeyFrames from 'canvaskeyframes'
export default {
  props: {
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
      width: 0, // 宽
      height: 0, // 高
      keyFrames: null, // 序列帧
      playElement: null, // 第一张图片，获取图片宽高
      state: 'stop'
    }
  },
  watch: {
    urls: {
      immediate: true,
      handler() {
        this.renderInit()
      }
    }
  },
  computed: {
    genStyle() {
      return { width: `${this.width}px`, height: `${this.height}px` }
    }
  },
  methods: {
    // 初始化渲染
    async renderInit() {
      // let imgs = ['/E001S001C0001.jpg', '/E001S001C0002.jpg', '/E001S001C0003.jpg']
      let pAll = this.urls.map(url => this.loadImage(url))
      await Promise.all(pAll).then(imgArr => {
        let [first] = imgArr
        this.playElement = first
        this.setStyle()
        this.keyFrames && this.destroy()
        this.keyFrames = new CanvasKeyFrames(
          document.querySelector(`#${this.playId}`),
          'array',
          imgArr,
          { fps: 24, width: this.width, height: this.height }
        )
      })
    },
    play() {
      this.keyFrames && this.keyFrames.play()
      this.state = 'play'
      this.$emit('change')
    },
    pause() {
      this.keyFrames && this.keyFrames.pause()
      this.state = 'stop'
    },
    goto(n) {
      this.keyFrames && this.keyFrames.goto(n)
    },
    prev() {
      this.stop()
      this.keyFrames && this.keyFrames.prev()
      this.$emit('change')
    },
    next() {
      this.stop()
      this.keyFrames && this.keyFrames.next()
      this.$emit('change')
    },
    stop() {
      this.keyFrames && this.keyFrames.stop()
      this.state = 'stop'
    },
    destroy() {
      this.keyFrames && this.keyFrames.destroy()
      this.state = 'stop'
    },
    loadImage(url) {
      let img = new Image()
      img.src = url
      let p = new Promise(resolve => {
        img.onload = function() {
          resolve(img)
        }
        img.onerror = function() {
          resolve(img)
        }
      })
      return p
    },
    setStyle() {
      let el = this.playElement
      let partent = document.querySelector(`.${this.playId}`).parentNode
      let width = el.width
      let height = el.height
      let ratio = height / width
      if (partent.offsetHeight / partent.offsetWidth > ratio) {
        this.width = partent.offsetWidth
        this.height = partent.offsetWidth * ratio
      } else {
        this.width = partent.offsetHeight / ratio
        this.height = partent.offsetHeight
      }
    }
  },
  mounted() {
    this.renderInit()
    window.addEventListener('resize', this.renderInit)
  },
  beforeDestroy() {
    this.destroy()
    window.removeEventListener('resize', this.renderInit)
  }
}
</script>

<style lang="scss" scoped>
.multiple-image-preview {
  position: relative;
  .controls {
    position: relative;
    padding: 10px;
    background-color: #232a2f;
    text-align: center;
    .button {
      font-size: 20px;
      width: 36px;
      height: 36px;
      border-radius: 2px;
      border: 0;
      background-color: transparent;
      cursor: pointer;
      color: #e9eaea;
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
