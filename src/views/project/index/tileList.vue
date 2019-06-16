<template>
  <div class="project-item">
    <el-table
      ref="tableList"
      :data="data.list"
      tooltip-effect="light"
      style="width: 100%"
      class="list-table"
    >
      <el-table-column
        prop="title"
        label="项目名称"
        min-width="180"
        align="center"
        :show-overflow-tooltip="true"
      ></el-table-column>
      <el-table-column
        prop="type"
        label="项目类型"
        width="180"
        align="center"
        :show-overflow-tooltip="true"
      ></el-table-column>
      <el-table-column label="项目缩略图" width="131" align="center">
        <template slot-scope="scope">
          <div class="img-box">
            <img
              :src="scope.row.thumb_image | imageUrl(`${publicPath}images/project-defalut.jpg`)"
              @click="viewPicture(scope.row.image)"
            >
          </div>
        </template>
      </el-table-column>
      <el-table-column label="项目状态" width="100" align="center" :show-overflow-tooltip="true">
        <template slot-scope="scope">
          <span>{{scope.row.status}}</span>
          <el-tooltip
            popper-class="custom-tooltip project-tooltip"
            :visible-arrow="false"
            effect="light"
            :content="scope.row.freeze_note"
            placement="bottom"
            v-if="scope.row.state === String(data.freeze)"
          >
            <i class="el-icon-warning identity-disabled"></i>
          </el-tooltip>
        </template>
      </el-table-column>
      <el-table-column
        prop="content"
        label="商务联系人"
        width="100"
        align="center"
        :show-overflow-tooltip="true"
      ></el-table-column>
      <el-table-column label="制片" width="100" align="center" :show-overflow-tooltip="true">
        <template slot-scope="scope">{{scope.row.filmmaker_name.join(',')}}</template>
      </el-table-column>
      <el-table-column
        prop="realname"
        label="创建人"
        width="100"
        align="center"
        :show-overflow-tooltip="true"
      ></el-table-column>
      <el-table-column
        prop="create_time"
        label="创建时间"
        width="160"
        align="center"
        :show-overflow-tooltip="true"
      ></el-table-column>
      <el-table-column label="操作" width="200" align="center">
        <template slot-scope="scope">
          <div class="opt-wrap">
            <a href="javascript:;" @click="gotoTask(scope.row.project_id)">查看</a>
            <a href="javascript:;" @click="changeStatus(scope.row.project_id)">更改状态</a>
            <a href="javascript:;" @click="deleteProject(scope.row)">删除</a>
          </div>
        </template>
      </el-table-column>
    </el-table>
    <view-picture v-model="picDialogVisible" @hide="hideViewDialog" :src="viewSrc"></view-picture>
    <el-dialog
      title="更改状态"
      :visible.sync="statusDialogVisible"
      class="taskDialog project-status-dialog"
      :before-close="handleClose"
    >
      <el-form
        :model="stateForm"
        :rules="stateRules"
        ref="stateForm"
        label-width="130px"
        :hide-required-asterisk="true"
      >
        <el-form-item prop="state" label="项目状态">
          <el-select v-model.trim="stateForm.state" placeholder="请选择项目状态">
            <el-option v-for="(item,idx) in data.status" :key="idx" :label="item" :value="idx"></el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="handleClose">取 消</el-button>
        <el-button type="primary" @click="confirmStatus">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import ViewPicture from './viewPicture'
export default {
  components: { ViewPicture },
  props: {
    data: {
      type: Object,
      default() {
        return {}
      }
    },
    statusDialogVisible: {
      type: Boolean,
      default: false
    }
  },
  watch: {
    statusDialogVisible: {
      immediate: true,
      handler(value) {
        if (value) {
          this.$nextTick(() => {
            this.$refs.stateForm.resetFields()
          })
        }
      }
    }
  },
  data() {
    return {
      picDialogVisible: false,
      viewSrc: '',
      publicPath: process.env.BASE_URL,
      itemId: '',
      stateForm: {
        state: ''
      },
      stateRules: {}
    }
  },
  methods: {
    // 删除项目
    deleteProject(item) {
      this.$emit('deleteProject', item)
    },
    // 查看图片
    viewPicture(src) {
      this.viewSrc = src
      this.picDialogVisible = true
    },
    // 隐藏图片查看框
    hideViewDialog() {
      this.picDialogVisible = false
    },
    // 查看消息
    gotoTask(id) {
      this.$router.push({
        path: '/project/info',
        query: { projectid: String(id) }
      })
    },
    // 更改状态
    handleClose() {
      this.$emit('changeVisible', false)
    },
    changeStatus(id) {
      this.$emit('changeVisible', true)
      this.itemId = id
    },
    confirmStatus() {
      this.$emit('changeStatus', this.stateForm.state, this.itemId)
    }
  }
}
</script>
<style lang="scss">
.project-mana-wrap {
  .el-table {
    .opt-wrap {
      a {
        margin: 0 10px;
        color: #179bff;
        text-decoration: none;
      }
    }
    .img-box {
      width: 131px;
      height: 75px;
      img {
        width: 100%;
        height: 100%;
        object-fit: contain;
      }
    }
  }
}
/* .project-status-dialog {
  .el-select {
    display: block;
    > .el-input,
    .el-input__inner {
      width: 100%;
    }
  }
} */
</style>

