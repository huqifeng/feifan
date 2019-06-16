<template>
  <div class="version-item">
    <div class="tools">
      <el-tooltip content="编辑">
        <el-button type="text" size="large" icon="el-icon-edit" @click="$emit('update', data)"></el-button>
      </el-tooltip>
      <el-tooltip content="删除">
        <el-button type="text" size="large" icon="el-icon-delete" @click="$emit('remove', data)"></el-button>
      </el-tooltip>
    </div>
    <div class="bd">
      <div class="group">
        <div class="label">版本名称：</div>
        <div class="content">{{data.version_name}}</div>
      </div>
      <div class="group">
        <div class="label">版本说明：</div>
        <div class="content">{{data.remark}}</div>
      </div>
      <div class="row">
        <div class="col">
          <div class="group">
            <div class="label">开始时间：</div>
            <div class="content">{{data.start_date}}</div>
          </div>
        </div>
        <div class="col">
          <div class="group">
            <div class="label">结束时间：</div>
            <div class="content">{{data.end_date}}</div>
          </div>
        </div>
      </div>
      <div class="row">
        <div class="col">
          <div class="group">
            <div class="label">创建人：</div>
            <div class="content">{{data.create_name}}</div>
          </div>
        </div>
        <div class="col">
          <div class="group">
            <div class="label">创建时间：</div>
            <div class="content">{{data.create_time}}</div>
          </div>
        </div>
      </div>
    </div>
    <div class="ft">
      <router-link :to="toTask">
        <el-button type="text">查看任务</el-button>
      </router-link>
    </div>
  </div>
</template>

<script>
export default {
  name: 'VersionItem',
  props: {
    data: { type: Object }
  },
  computed: {
    toTask() {
      return {
        path: '/project/version/task',
        query: {
          projectid: this.query.projectid,
          version_id: this.data.versionid
        }
      }
    },
    query() {
      return this.$route.query
    }
  }
}
</script>

<style lang="scss" scoped>
.version-item {
  position: relative;
  margin-bottom: 15px;
  padding: 30px;
  background-color: #fff;
  .group {
    display: flex;
    margin-bottom: 10px;
    line-height: 24px;
    .label {
      width: 80px;
      font-size: 16px;
      font-weight: bold;
      text-align: right;
    }
    .content {
      flex: 1;
    }
  }
  .tools {
    position: absolute;
    right: 30px;
    top: 10px;
    display: none;
  }
  &:hover .tools {
    display: block;
  }
  .ft {
    padding-top: 40px;
  }
}
.row {
  display: flex;
  .col {
    flex: 1;
  }
}
</style>
