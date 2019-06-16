<template>
  <section class="main-content project-update-wrap project-info-wrap">
    <div class="info-section" v-if="!isEdit">
      <h2>
        <i class="iconfont icon-pen edit" @click="editProject"></i>项目信息
      </h2>
      <ul class="info-list">
        <li>
          <label>项目名称:</label>
          <div>{{base.p_title}}</div>
        </li>
        <li>
          <label>项目制片:</label>
          <div>{{base.filmmakers_name}}</div>
        </li>
        <li>
          <label>名称简写:</label>
          <div>{{base.simplify_title}}</div>
        </li>
        <li>
          <label>项目状态:</label>
          <div>{{status[base.state]}}</div>
        </li>
        <li>
          <label>市场:</label>
          <div>{{base.marketers_name}}</div>
        </li>
        <li>
          <label>项目类型:</label>
          <div>{{type[base.type]}}</div>
        </li>
        <li>
          <label>导演:</label>
          <div>{{base.director && base.director.customername}}</div>
        </li>
        <li>
          <label>开始制作:</label>
          <div>{{formatDate(base.start_time)}}</div>
        </li>
        <li>
          <label>制片人:</label>
          <div>{{base.producer && base.producer.customername}}</div>
        </li>
        <li>
          <label>制作完成:</label>
          <div>{{formatDate(base.end_time)}}</div>
        </li>
        <li>
          <label>制片主任:</label>
          <div>{{base.production_director && base.production_director.customername}}</div>
        </li>
        <li v-for="item in extendList" :key="item.config_id">
          <label>{{`${item.attribute_title}:`}}</label>
          <div>{{item.content}}</div>
        </li>
        <li>
          <label>项目封面:</label>
          <div class="thumb-image" v-if="base.thumb_image">
            <img :src="base.thumb_image">
            <p>
              <a href="javascript:;" @click="viewPicture(base.image)">查看原图</a>
            </p>
          </div>
        </li>
      </ul>
      <div class="buttons-wrap">
        <el-button type="primary" @click="handleCancel">返回</el-button>
      </div>
    </div>
    <view-picture v-model="picDialogVisible" @hide="hideViewDialog" :src="viewSrc"></view-picture>
    <update v-if="isEdit" :data="info" @reload="reload"></update>
  </section>
</template>

<script>
import { getProjectInfo } from '@/api/project/projectIndex'
import ViewPicture from '@/views/project/index/viewPicture'
import Update from '@/views/project/info/update/index'
import dayjs from 'dayjs'
export default {
  components: { ViewPicture, Update },
  data() {
    return {
      info: {},
      base: {},
      status: {},
      template: {},
      type: {},
      picDialogVisible: false,
      viewSrc: '',
      extendList: [],
      isEdit: false // 是否是编辑
    }
  },
  methods: {
    // 获取项目信息
    getProjectInfo() {
      let param = {
        project_id: this.projectId
      }
      getProjectInfo(param).then(res => {
        this.extendList = []
        if (res.code === 0) {
          this.info = res.data
          this.base = res.data.base
          this.status = res.data.status
          this.template = res.data.template
          this.type = res.data.type
          res.data.template.base.forEach(item => {
            this.extendList = [...item.children]
          })
        }
      })
    },
    // 编辑项目
    editProject() {
      this.isEdit = true
    },
    // 隐藏图片预览
    hideViewDialog() {
      this.picDialogVisible = false
    },
    // 查看图片
    viewPicture(src) {
      this.viewSrc = src
      this.picDialogVisible = true
    },
    formatDate(date) {
      return dayjs(date).format('YYYY-MM-DD')
    },
    reload(val) {
      this.isEdit = val
      this.getProjectInfo()
    },
    // 返回项目首页
    handleCancel() {
      this.$router.push('/project/index')
    }
  },
  created() {
    this.projectId = this.$route.query.projectid
    if (this.projectId) {
      this.getProjectInfo()
    }
  }
}
</script>
<style lang="scss">
.info-section {
  .edit {
    float: right;
    color: #179bff;
    font-size: 24px;
    cursor: pointer;
    font-weight:normal;
  }
  .thumb-image {
    background: #f1f1f1;
    width: 165px;
    height: 210px;
    text-align: center;
    img {
      width: 100%;
      height: 210px;
      object-fit: contain;
      display: block;
    }
    p {
      font-size: 12px;
      margin-top: 20px;
    }
  }
  a {
    color: #179bff;
    text-decoration: none;
  }
  h2 {
    font-size: 20px;
    margin-bottom: 50px;
  }
  .info-list {
    display: flex;
    flex-wrap: wrap;
    padding: 0 10px;
    li {
      display: flex;
      width: 50%;
      line-height: 22px;
      padding: 0 10px;
      box-sizing: border-box;
      margin-bottom: 14px;
      label {
        flex: 0 0 150px;
        text-align: right;
        margin-right: 20px;
        color: #666;
      }
      > div {
        font-size: 16px;
      }
    }
  }
}
.project-info-wrap.project-update-wrap .info-section {
  margin-top: 10px;
}
</style>

