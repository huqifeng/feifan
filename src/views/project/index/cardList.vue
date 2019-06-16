<template>
  <div class="project-item">
    <ul class="card-list">
      <li v-for="item in data.list" :key="item.project_id">
        <div>
          <el-menu
            class="project-menu"
            mode="horizontal"
            menu-trigger="click"
            @open="handleopen"
            :ref="`dropMenu${item.project_id}`"
          >
            <el-submenu
              :index="`menu${item.project_id}`"
              popper-class="drop-menu"
              :popper-append-to-body="false"
            >
              <template slot="title">
                <span class="menu-icon"></span>
              </template>
              <el-menu-item index="1-1" @click="gotoTask('/project/info',item.project_id)">查看信息</el-menu-item>
              <el-submenu :index="`status${item.project_id}`" popper-class="status-list">
                <template slot="title">修改状态</template>
                <el-menu-item
                  v-for="(status,idx) in data.status"
                  :key="idx"
                  :index="idx"
                  :class="[`status${idx}`]"
                  @click="changeStatus(idx,item.project_id)"
                >{{status}}</el-menu-item>
              </el-submenu>
              <el-menu-item index="1-3" @click="deleteProject(item)">删除项目</el-menu-item>
              <el-menu-item index="1-4" @click="goToVersion(item.project_id)">版本信息</el-menu-item>
            </el-submenu>
          </el-menu>
          <div class="content" @click.stop="gotoTask('/project/task',item.project_id)">
            <div class="left-wrap">
              <div
                class="mark-wrap"
                v-if="item.state === String(data.freeze) || item.state === String(data.place_file)"
              >
                <span :class="{freeze:item.state === String(data.freeze)}"></span>
              </div>
              <img :src="item.thumb_image | imageUrl(`${publicPath}images/project-defalut.jpg`)">
            </div>
            <div class="right-wrap">
              <div class="title">
                <el-tooltip
                  popper-class="custom-tooltip"
                  :visible-arrow="false"
                  effect="light"
                  :content="item.title"
                  placement="bottom"
                  :disabled="item.showTip"
                >
                  <h2>{{item.newTitle}}</h2>
                </el-tooltip>
                <p :class="[`status${item.state}`]">
                  {{item.status}}
                  <el-tooltip
                    popper-class="custom-tooltip project-tooltip"
                    :visible-arrow="false"
                    effect="light"
                    :content="item.freeze_note"
                    placement="bottom"
                    v-if="item.state === String(data.freeze)"
                  >
                    <i class="el-icon-warning identity-disabled"></i>
                  </el-tooltip>
                </p>
              </div>
              <div class="bottom">
                <span class="name">{{item.realname}}</span>
                <span class="date">{{formatDate(item.create_time)}}</span>
              </div>
            </div>
          </div>
          <el-progress
            :text-inside="true"
            :stroke-width="12"
            :percentage="item.progress"
            :class="{freeze:item.state === String(data.freeze)}"
          ></el-progress>
        </div>
      </li>
    </ul>
  </div>
</template>

<script>
import dayjs from 'dayjs'
export default {
  props: {
    data: {
      type: Object,
      default() {
        return {}
      }
    }
  },
  data() {
    return {
      publicPath: process.env.BASE_URL
    }
  },
  methods: {
    // 修改状态
    changeStatus(status, id) {
      this.$emit('changeStatus', status, id)
    },
    // 删除项目
    deleteProject(item) {
      this.$emit('deleteProject', item)
    },
    // 查看消息
    gotoTask(path, id) {
      this.$router.push({
        path,
        query: { projectid: String(id) }
      })
    },
    // 查看版本信息
    goToVersion(id) {
      this.$router.push({
        path: '/project/version',
        query: { projectid: String(id) }
      })
    },
    // 格式日期
    formatDate(date) {
      return dayjs(date).format('YYYY-MM-DD')
    },
    // 下拉菜单展开事件
    handleopen(index) {
      this.data.list.forEach(item => {
        let menu = `menu${item.project_id}`
        let statusMenu = `status${item.project_id}`
        if (menu !== index && index.indexOf('status') === -1) {
          this.$refs[`dropMenu${item.project_id}`][0].close(menu)
          this.$refs[`dropMenu${item.project_id}`][0].close(statusMenu)
        }
      })
    }
  }
}
</script>
<style lang="scss">
.project-mana-wrap {
  color: #333333;
  .tab .el-button {
    border-radius: 0px;
  }
  .project-item {
    margin: 80px 90px;
  }
  .card-list {
    display: flex;
    flex-wrap: wrap;
    .status49 {
      color: #60efdb;
    }
    .status51 {
      color: #ffd821;
    }
    .status50 {
      color: #32ccb4;
    }
    .status52 {
      color: #79ceed;
    }
    .status93 {
      color: #ff8a5c;
    }
    .status54 {
      color: #6f89a4;
    }
    .status57 {
      color: #b6b6b6;
    }
    .el-progress {
      position: absolute;
      bottom: 20px;
      left: 20px;
      right: 20px;
      &.freeze {
        .el-progress-bar__inner {
          background: rgba(153, 153, 153, 1);
        }
      }
    }
    .el-progress-bar__inner {
      background: rgba(23, 155, 255, 1);
    }
    .el-progress-bar__innerText {
      width: 30px;
      height: 20px;
      line-height: 20px;
      color: rgba(23, 155, 255, 1);
      background: rgba(255, 255, 255, 1);
      box-shadow: 0px 0px 5px 0px rgba(40, 120, 255, 0.2);
      margin: -58px -10px 0 0px;
      position: relative;
      &:before,
      &:after {
        content: '';
        position: absolute;
        display: block;
        width: 0;
        height: 0;
        border-color: transparent;
        border-style: solid;
        filter: drop-shadow(0 2px 12px rgba(0, 0, 0, 0.03));
      }
      &:before {
        border-top-color: #fff;
        border-width: 4px;
        left: 12px;
        bottom: -8px;
        z-index: 2;
      }
      &:after {
        border-top-color: #f3f4f7;
        border-width: 6px;
        left: 10px;
        bottom: -12px;
        z-index: 1;
      }
    }
    .el-progress-bar__outer {
      background: transparent url('~@/assets/images/progress.png') repeat-x
        scroll 0 0;
      overflow: visible;
    }
    .content {
      height: 210px;
      display: flex;
      justify-content: space-between;
    }
    .left-wrap {
      background: #f1f1f1;
      width: 165px;
      margin-right: 20px;
      position: relative;
      display: flex;
      img {
        width: 165px;
        height: 100%;
        object-fit: contain;
        display: block;
      }
    }
    .mark-wrap {
      background: rgba(0, 0, 0, 0.4);
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      z-index: 10;
      > span {
        background: transparent url('~@/assets/images/placeFile.png') no-repeat
          scroll 0 0;
        display: block;
        width: 70px;
        height: 70px;
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        &.freeze {
          background-image: url('~@/assets/images/freeze.png');
        }
      }
    }
    .right-wrap {
      width: 100%;
      display: flex;
      align-items: center;
      position: relative;
      .title {
        h2 {
          font-size: 18px;
          margin-bottom: 16px;
          font-weight: normal;
          word-break: break-all;
        }
        p {
          font-size: 14px;
        }
      }
      .bottom {
        color: #666666;
        position: absolute;
        bottom: 0px;
        width: 100%;
        text-align: right;
        display: flex;
        justify-content: space-between;
        flex-wrap: wrap;
      }
    }
    > li {
      width: 25%;
      min-width: 300px;
      > div {
        position: relative;
        box-sizing: border-box;
        padding: 20px;
        margin: 0 8px 15px;
        background-color: #fff;
        height: 320px;
        &:hover {
          box-shadow: 0px 0px 15px 0px rgba(40, 120, 255, 0.25);
        }
      }
    }
    .el-submenu__icon-arrow {
      display: none;
    }
  }
  .project-menu {
    border-bottom: none;
    position: absolute;
    right: 20px;
    top: 20px;
    z-index: 110;
    .el-submenu__title {
      padding: 0px;
    }
    .drop-menu {
      margin-left: -40px;
      .el-menu-item {
        padding: 0px;
      }
      .status-list {
        .el-menu {
          text-align: left;
          .el-submenu,
          .el-menu-item {
            margin-bottom: 12px;
          }
          .el-menu-item {
            &:before {
              content: '';
              display: inline-block;
              width: 14px;
              height: 14px;
              border-radius: 50%;
              vertical-align: -2px;
              margin-right: 10px;
            }
            &.status49:before {
              background: #60efdb;
            }
            &.status51:before {
              background: #ffd821;
            }
            &.status50:before {
              background: #32ccb4;
            }
            &.status52:before {
              background: #79ceed;
            }
            &.status93:before {
              background: #ff8a5c;
            }
            &.status54:before {
              background: #6f89a4;
            }
            &.status57:before {
              background: #b6b6b6;
            }
          }
        }
      }
      .el-menu {
        min-width: 0;
        width: 90px;
        box-shadow: 0px 4px 9px 0px rgba(1, 102, 178, 0.3);
        padding: 8px 10px;
        box-sizing: border-box;
        text-align: center;
        .el-menu-item,
        .el-submenu__title {
          color: rgba(102, 102, 102, 1);
          &.is-active {
            color: #333333;
          }
        }
        .el-submenu,
        .el-menu-item {
          min-width: 0;
          height: 16px;
          line-height: 16px;
          margin-bottom: 14px;
          &:last-child {
            margin-bottom: 0px;
          }
        }
      }
    }
    .el-submenu .el-submenu__title {
      border-bottom: none;
      height: auto;
      line-height: normal;
    }
    > .el-submenu {
      float: none;
    }
    .menu-icon {
      background: transparent url('../../../assets/images/dropMenu-icon.png')
        no-repeat;
      display: block;
      width: 24px;
      height: 20px;
    }
  }
}
@media screen and (max-width: 1600px) {
  .project-mana-wrap {
    .card-list {
      .left-wrap {
        margin-right: 10px;
      }
      > li {
        > div {
          padding: 10px;
        }
      }
      .right-wrap {
        .title {
          h2 {
            font-size: 16px;
          }
        }
      }
    }
  }
}
</style>

