<template>
  <div class="project-settings-content" id="project-settings" v-loading="loading">
    <div class="sidebar" v-if="menuList.length">
      <el-menu :unique-opened="true" :default-active="defaultActive">
        <el-submenu
          v-for="(menu, index) in menuList"
          :key="`menu_${index}`"
          :index="`menu_${index}`"
        >
          <template slot="title">
            <span>{{menu.name}}</span>
          </template>
          <el-submenu v-for="item in menu._child" :key="item.name" :index="item.name">
            <template slot="title">{{item.name}}</template>
            <el-menu-item
              v-for="fileType in fileTypeList"
              :key="`${item.pts_token}_${fileType.key}`"
              :index="`${item.pts_token}_${fileType.key}`"
              @click="showPermission(item.pts_token, fileType.key)"
            >{{fileType.name}}</el-menu-item>
          </el-submenu>
        </el-submenu>
      </el-menu>
    </div>
    <template v-if="menuList.length && userGroupList.length">
      <div class="main" v-loading="rightLoading">
        <el-row class="checkRow">
          <el-col :span="5" style="color:#fff;">
          1
          </el-col>
          <el-col :span="19" class="checkWay">
            <el-checkbox
                    v-for="item in checkboxGroup"
                    :label="item.value"
                    :key="item.value"
                    :indeterminate="item.isIndeterminate"
                    v-model="item.checkAll"
                    @change="handleCheckAllChange(item.value, ...arguments)"
            >{{item.label}}</el-checkbox>
          </el-col>
        </el-row>
        <el-row class="checkRow" v-for="item in userGroupList" :key="item.ug_id">
          <el-col :span="5" class="checkTitle">
            <div>{{item.name}}</div>
          </el-col>
          <el-col :span="19" class="checkWay">
            <div>
              <el-checkbox-group v-model="item.foptions">
                <el-checkbox
                        v-for="check in checkboxGroup"
                        :label="check.value"
                        :key="check.value"
                        @change="handleCheckChange(item.ug_id, check.value, ...arguments)"
                >{{check.label}}</el-checkbox>
              </el-checkbox-group>
            </div>
          </el-col>
        </el-row>
        <div class="buttons">
          <el-button type="primary" class="uploadButton"  @click="onPrimary">保存</el-button>
        </div>
      </div>
    </template>
    <template v-else>暂无角色</template>
  </div>
</template>

<script>
import { getUserGroup } from '@/api/base'
import { getFileMenu, getFilePermission, setFilePrmission } from '@/api/make'
export default {
  name: 'ProjectSettings',
  data() {
    return {
      // 项目id
      pid: '',
      // 左侧菜单
      menuList: [],
      fileTypeList: [],
      // 当前选中的
      active: {
        pts_token: '', // 任务阶段ID，也就是二级菜单的ID
        fileType: '' // 文件夹类型，也就是三级菜单的key
      },
      defaultActive: '',
      // 全局loading
      loading: false,
      // 右侧权限loading
      rightLoading: false,
      // 用户组
      userGroupList: [],
      // 操作选项
      checkboxGroup: [
        {
          label: '查看',
          value: 'view',
          isIndeterminate: false,
          checkAll: false
        },
        {
          label: '上传',
          value: 'upload',
          isIndeterminate: false,
          checkAll: false
        },
        {
          label: '下载',
          value: 'download',
          isIndeterminate: false,
          checkAll: false
        }
      ]
    }
  },
  methods: {
    init() {
      if (!this.pid) {
        this.$message({
          message: '非正常访问，请输入完整URL',
          type: 'warning'
        })
        return false
      }
      this.getMenu()
      this.getUserGroup()
    },
    // 获取菜单
    getMenu() {
      this.loading = true
      getFileMenu({
        subjects: ['menu', 'ftypes'],
        project_id: this.pid
      }).then(response => {
        this.loading = false
        // 二逼数据结构，需要整理下
        let { menu, ftypes: fileType } = response.data
        this.menuList = menu
        for (let key in fileType) {
          this.fileTypeList.push({ key, name: fileType[key] })
        }
        if (!menu.length) {
          return false
        }
        // 设置默认选中
        let [first = {}] = this.menuList
        let [defaultActive] = first._child || []
        let [firstFileType] = this.fileTypeList
        this.defaultActive = `${defaultActive.pts_token}_${firstFileType.key}`
        this.showPermission(defaultActive.pts_token, firstFileType.key)
      })
    },
    // 获取权限
    getPermission() {
      this.rightLoading = true
      getFilePermission({
        project_id: this.pid,
        pts_token: this.active.pts_token,
        ftypes: [this.active.fileType]
      }).then(response => {
        let fileSettings = response.data.fsettings || []
        this.userGroupList.forEach(item => {
          let found = fileSettings.find(subItem => {
            return subItem.ug_id === item.ug_id
          })
          if (found) {
            item.foptions = found.foptions
          }
        })
        this.setCheckAll()
        this.rightLoading = false
      })
    },
    // 设置权限
    setPermission() {
      setFilePrmission({
        project_id: this.pid,
        pts_token: this.active.pts_token,
        ftype: this.active.fileType,
        fsettings: this.userGroupList
      }).then(() => {
        this.$message({
          message: '保存成功',
          type: 'success'
        })
      })
    },
    // 获取用户组
    getUserGroup() {
      getUserGroup().then(response => {
        this.userGroupList = response.data.map(item => {
          return {
            ug_id: item.usergroupid,
            name: item.grouptitle,
            foptions: []
          }
        })
      })
    },
    // 显示权限页面
    showPermission(pts_token, fileType) {
      Object.assign(this.active, { pts_token, fileType })
      // 清空选中的
      this.checkboxGroup.forEach(item => {
        Object.assign(item, { isIndeterminate: false, checkAll: false })
      })
      this.userGroupList.forEach(item => {
        item.foptions = []
      })
      this.getPermission()
    },
    // 点击全选的时候
    handleCheckAllChange(key, isCheck) {
      this.userGroupList.forEach(item => {
        if (isCheck) {
          // 全选
          item.foptions = [...item.foptions, key, 'view']
        } else {
          if (key === 'view') {
            item.foptions = []
          } else {
            // 取消全选
            this.$lodash.remove(item.foptions, value => {
              return value === key
            })
          }
        }
        // 去重
        item.foptions = this.$lodash.uniq(item.foptions)
      })
      this.checkboxGroup.forEach(item => {
        if (isCheck) {
          if (item.value === key || item.value === 'view') {
            item.isIndeterminate = false
            item.checkAll = isCheck
          }
        } else {
          if (key === 'view' || key === item.key) {
            item.isIndeterminate = false
            item.checkAll = false
          }
        }
      })
    },
    // 复选框选择的时候
    handleCheckChange(id, curretnValue, resultValue) {
      // 查看取消的时候，取消上传、下载权限
      if (curretnValue === 'view' && !resultValue) {
        this.userGroupList.forEach(item => {
          if (item.ug_id === id) {
            item.foptions = []
          }
        })
      }
      // 选中上传或者下载的时候，自动绑定查看权限
      if (
        (curretnValue === 'upload' || curretnValue === 'download') &&
        resultValue
      ) {
        this.userGroupList.forEach(item => {
          if (item.ug_id === id && !item.foptions.includes('view')) {
            item.foptions.push('view')
          }
        })
      }
      this.setCheckAll()
    },
    // 设置全选状态
    setCheckAll() {
      let result = this.userGroupList.reduce(
        (total, item) => {
          item.foptions.forEach(key => {
            ++total[key]
          })
          return total
        },
        { view: 0, upload: 0, download: 0 }
      )
      this.checkboxGroup.forEach(item => {
        let isCheckAll = result[item.value] === this.userGroupList.length
        item.isIndeterminate = !isCheckAll && result[item.value] > 0
        item.checkAll = isCheckAll
      })
    },
    // 保存
    onPrimary() {
      this.setPermission()
    }
  },
  created() {
    let { query } = this.$route
    this.pid = query.projectid || '351'
  },
  beforeMount() {
    this.init()
  }
}
</script>

<style lang="scss">
#project-settings {
  display: flex;
  position: relative;
  min-height: 100%;
  .sidebar {
    // align-self: flex-start;
    position: relative;
    width: 300px;
    background: #fff;
    // max-height: 100%;
    // overflow: auto;
    .el-menu {
      border-right: 0;
    }
  }
  .el-submenu__title {
    height: 40px;
    line-height: 40px;
    text-align: left;
    span{

    }
    i{
      right:20px;
      color:#179BFF;
      font-weight:700;
      font-size: 16px;
    }
  }
  .el-submenu .el-menu-item {
    height: 25px;
    line-height: 25px;
  }
  .main {
    position: relative;
    flex: 1;
    margin-left: 20px;
    padding: 20px;
    background:#fff;
    // max-height: 100%;
    // overflow: auto;

    dl {
      display: flex;
      margin-bottom: 10px;
    }
    dt {
      width: 200px;
      text-align: right;
      padding-right: 20px;
    }
    dd {
      flex: 1;
    }
    .buttons {
      text-align: right;
      padding: 40px 0;
      margin-right:10px;
    }
    .checkRow{
      margin-top:25px;
      .checkTitle{
        color:#333;
        font-size:16px;
      }
    }
    .checkWay .el-checkbox{
      width:33.3%;
      margin-right:0;
    }
    .el-checkbox__input.is-checked + .el-checkbox__label{
      color:#333;
    }
  }
}
</style>