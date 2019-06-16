<template>
  <div class="select-user">
    <div class="select-user-left">
      <div class="select-user-search">
        <el-input placeholder="请输入用户名称、部门名称" v-model="filterText" suffix-icon="el-icon-search"></el-input>
      </div>
      <div class="select-user-tree">
        <!-- 多选 -->
        <el-tree
          v-if="multiple"
          :data="users"
          show-checkbox
          node-key="uniqueId"
          :props="defaultProps"
          :render-content="renderNode"
          :filter-node-method="filterNode"
          accordion
          v-bind="$attrs"
          @check="handleCheckboxChange"
          ref="tree"
        ></el-tree>
        <!-- 单选 -->
        <el-tree
          v-else
          :data="users"
          node-key="uniqueId"
          :props="defaultProps"
          :filter-node-method="filterNode"
          v-bind="$attrs"
          ref="tree"
        >
          <span class="custom-tree-node" slot-scope="{ node, data }">
            <template v-if="$lodash.isNumber(data.id)">
              <el-radio
                v-model="radioValue"
                :label="data.uniqueId"
                @change="handleRadioChange"
              >{{ node.label }}</el-radio>
            </template>
            <template v-else>{{ node.label }}</template>
          </span>
        </el-tree>
      </div>
    </div>
    <div class="select-user-right">
      <div class="hd">
        <h4 class="title">{{checkTitle}}</h4>
        <el-button type="text" @click="resetChecked">清空</el-button>
      </div>
      <div class="bd">
        <el-tag
          v-for="user in checkedUniqUsers"
          :key="`user_${user.uniqueId}`"
          closable
          class="user-item"
          @close="handleRemove(user)"
        >
          <img :src="user.avatar">
          <span class="user-name">{{user.name}}</span>
          <span class="post" v-if="user.post_name">({{user.post_name}})</span>
        </el-tag>
      </div>
    </div>
    <div class="validate-tips" v-if="isShowTips">最多只能选择{{limitCount}}个人</div>
  </div>
</template>


<script>
import { getAllUser } from '@/api/base'
export default {
  name: 'SelectUserPanel',
  props: {
    value: [String, Array],
    multiple: { type: Boolean, default: false },
    checkTitle: { type: String, default: '已选择' },
    limitCount: { type: Number, default: null }
  },
  data() {
    return {
      filterText: '',
      // 所有用户
      users: [],
      defaultProps: { label: 'name', children: 'children' },
      // 多选选中的unid
      checkedIds: [],
      // 单选选中的unid
      radioValue: '',
      found: null,
      isShowTips: false
    }
  },
  watch: {
    value: {
      immediate: true,
      handler(value) {
        value && this.setChecked(value)
      }
    },
    filterText(value) {
      this.$refs.tree.filter(value)
    }
  },
  computed: {
    // 选中的用户
    checkedUsers() {
      return this.checkedIds.reduce((results, id) => {
        let user = this.findUser(id, this.users)
        if (this.$lodash.isNumber(user.id)) {
          results.push(user)
        }
        return results
      }, [])
    },
    // 选中的用户 去重
    checkedUniqUsers() {
      return this.$lodash.uniqBy(this.checkedUsers, 'id')
    }
  },
  methods: {
    // 获取用户
    getUser() {
      getAllUser().then(response => {
        this.users = this.generateUniqueId(response.data)
        this.setChecked(this.value)
      })
    },
    // 筛选
    filterNode(value, data) {
      return value ? data.name.includes(value) : true
    },
    // 渲染节点
    renderNode(h, { data }) {
      if (data.deptId === undefined) {
        return (
          <span class="user-item">
            <img src={data.avatar} />
            <span class="user-name">{data.name}</span>
            <span class="post" v-show={data.post_name}>
              ({data.post_name})
            </span>
          </span>
        )
      }
      return <span>{data.name}</span>
    },
    // 设置选中
    setChecked(value) {
      if (!value || !this.users || !this.users.length) {
        return false
      }
      if (this.multiple) {
        // id to unid
        this.checkedIds = value.map(id => {
          let found = this.findUser(id, this.users, 'id')
          return found.uniqueId
        })
        this.$refs.tree.setCheckedKeys(this.checkedIds)
      } else {
        // id to unid
        let found = this.findUser(value, this.users, 'id')
        this.radioValue = found.uniqueId
        this.checkedIds = [found.uniqueId]
      }
    },
    // 多选改变
    handleCheckboxChange() {
      this.checkedIds = this.$refs.tree.getCheckedKeys(true)
      this.handleChange()
    },
    // 单选改变
    handleRadioChange(value) {
      this.checkedIds = [value]
      this.handleChange()
    },
    // 删除已选用户
    handleRemove(user) {
      let removeIndex = this.checkedIds.findIndex(id => id === user.uniqueId)
      this.checkedIds.splice(removeIndex, 1)
      if (this.multiple) {
        this.$refs.tree.setCheckedKeys(this.checkedIds)
        if (this.limitCount) this.validateLimit()
      } else {
        this.radioValue = ''
      }
      this.handleChange()
    },
    // 清空已选用户
    resetChecked() {
      this.checkedIds = []
      if (this.multiple) {
        this.$refs.tree.setCheckedKeys([])
      } else {
        this.radioValue = ''
      }
      this.handleChange()
    },
    // 触发改变
    handleChange() {
      // 数据去重
      let checkedUsers = this.$lodash.uniqBy(this.checkedUsers, 'id')
      let ids = checkedUsers.map(user => user.id)
      if (this.multiple) {
        this.$emit('change', checkedUsers)
        this.$emit('input', ids)
      } else {
        this.$emit('change', ...checkedUsers)
        this.$emit('input', ...ids)
      }
    },
    // 数据有重复，生成唯一ID
    generateUniqueId(list) {
      for (let item of list) {
        // 唯一ID
        item.uniqueId = this.$lodash.uniqueId()
        // id是字符串的为部门
        // item.disabled = this.$lodash.isString(item.id)
        // 子节点
        item.children && this.generateUniqueId(item.children)
      }
      return list
    },
    // 查找用户
    findUser(id, list, prop = 'uniqueId') {
      if (!list) return null
      for (let item of list) {
        if (item[prop] === id) {
          this.found = item
          break
        }
        if (item.children && item.children.length) {
          this.findUser(id, item.children, prop)
        }
      }
      return this.found
    },
    // 校验选择人员格式
    validateLimit() {
      if (this.limitCount && this.checkedUniqUsers.length > this.limitCount) {
        this.isShowTips = true
      } else {
        this.isShowTips = false
      }
    }
  },
  beforeMount() {
    this.getUser()
  }
}
</script>

<style>
.el-form-item.is-error .select-user-search .el-input__inner {
  border-color: #dcdfe6;
}
</style>
<style scoped lang="scss">
.select-user {
  .validate-tips {
    font-size: 12px;
    color: #f56c6c;
    text-align: right;
    position: absolute;
    bottom: 30px;
    right: 200px;
  }
  display: flex;
  /deep/ .el-input__inner {
    border: none;
    border-radius: 0;
    background: #f8f8f8;
    height: 35px;
    line-height: 35px;
  }
  /deep/ .user-item {
    font-size: 14px;
    padding: 0 20px;
    padding: 5px;
    display: block;
    height: auto;
    box-sizing: border-box;
    width: 100%;
    position: relative;
    .el-icon-close {
      font-weight: bold;
      width: auto;
      height: auto;
      top: 50%;
      margin-top: -6px;
      right: 20px;
      position: absolute;
      &:hover {
        background: none;
        color: #179bff;
      }
    }
    &:hover {
      background: #f1f1f1;
    }
    img {
      background: #179bff;
      display: inline-block;
      width: 30px;
      height: 30px;
      border-radius: 50%;
      vertical-align: middle;
      margin-right: 10px;
    }
    .user-name {
      vertical-align: middle;
    }
    .post {
      margin-left: 10px;
      vertical-align: middle;
      font-size: 12px;
      color: #999;
    }
  }
}
.select-user-left {
  width: 50%;
}
.select-user-tree {
  margin-top: 10px;
  border-right: 1px solid #ebeef5;
  max-height: 400px;
  overflow: auto;
  min-height: 200px;
  /deep/ .el-tree-node {
    &:focus > .el-tree-node__content {
      background: none;
    }
    .el-tree-node__content {
      height: auto;
      &:hover {
        background: none;
      }
    }
    .el-tree-node__expand-icon {
      margin: -3px 4px 0 0;
      &.is-leaf:before {
        border: none;
      }
    }
    .is-expanded .el-icon-caret-right:before,
    .el-icon-caret-right:hover:before {
      border-color: #179bff;
    }
    .el-icon-caret-right:before {
      content: '';
      border-width: 2px 2px 0 0;
      border-style: solid;
      border-color: #f1f1f1;
      display: inline-block;
      width: 9px;
      height: 9px;
      transform: rotate(45deg);
    }
  }
}
.select-user-right {
  flex: 1;
  margin-left: 45px;
}
.select-user-right .hd {
  display: flex;
  padding: 0 10px;
}
.select-user-right .hd h4 {
  flex: 1;
  font-size: 14px;
  line-height: 40px;
}
.select-user-right .bd {
  border-right: 1px solid #ebeef5;
  height: calc(100% - 40px);
  overflow-x: hidden;
  overflow-y: auto;
  padding: 10px;
  box-sizing: border-box;
}
.select-user-right .user-item {
  border: none;
  border-radius: 0;
  background: none;
  color: #333333;
  padding: 5px 20px;
}
</style>
