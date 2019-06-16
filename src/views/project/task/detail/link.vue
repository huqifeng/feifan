<template>
  <!-- 相关环节 -->
  <div class="task-item-link">
    <related-links
      :visible.sync="linkVisible"
      :linkForm.sync="linkForm"
      type="UPSTREAM"
      linkTitle="上游环节"
      @updateType="changeType"
      :stream="dataRender.upstream"
      style="margin-top:10px"
    ></related-links>
    <related-links
      :visible.sync="linkVisible"
      :linkForm.sync="linkForm"
      type="DOWNSTREAM"
      linkTitle="下游环节"
      @updateType="changeType"
      :stream="dataRender.downstream"
    ></related-links>
    <el-dialog
      title="新增连接"
      :type.sync="linkType"
      :visible.sync="linkVisible"
      :append-to-body="true"
      @close="handleClose"
      class="taskDialog"
    >
      <el-form :model="linkForm" ref="linkForm" :rules="rules">
        <el-form-item label="任务类型" label-width="130px" prop="typeId">
          <el-select
            v-model="linkForm.typeId"
            placeholder="任务类型"
            style="width: 100%;"
            @change="relateLinkStage(linkForm.typeId)"
          >
            <el-option
              v-for="(item,index) in linkData.typeList"
              :value="item.type_id"
              :key="index"
              :label="item.type_name"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="任务阶段" label-width="130px" prop="stageId">
          <el-select v-model="linkForm.stageId" placeholder="任务阶段" style="width: 100%;">
            <el-option
              v-for="(item,index) in linkData.stageList"
              :value="item.id"
              :key="index"
              :label="item.name"
            ></el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="handleClose">取 消</el-button>
        <el-button type="primary" @click="addLink()">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
// api
import * as api from '@/api/make'
// components
import RelatedLinks from './relatedLinks'

export default {
  name: 'TaskItemLink',
  props: {
    // 任务ID
    id: String,
    // 项目ID
    pid: String
  },
  components: { RelatedLinks },
  data() {
    return {
      //相关环节的弹窗
      linkVisible: false,
      linkType: 'UPSTREAM',
      dataRender: {
        upstream: [],
        downstream: []
      },
      linkData: {
        typeList: [],
        stageList: []
      },
      linkTitle: '',
      linkForm: {
        typeId: '',
        stageId: ''
      },
      rules: {
        typeId: [
          { required: true, message: '请输入任务类型', trigger: 'change' }
        ],
        stageId: [
          { required: true, message: '请输入任务阶段', trigger: 'change' }
        ]
      }
    }
  },
  methods: {
    changeType(data) {
      this.linkType = data
    },
    //相关环节--新增连接
    addLink() {
      let params = {
        project_id: this.pid,
        to_stage_id: this.linkForm.stageId,
        stage_id: this.pid,
        stream_type: this.linkType
      }

      this.$refs.linkForm.validate(valid => {
        if (valid) {
          api.addLink(params).then(res => {
            this.$message({
              type: 'success',
              message: res.msg
            })
            this.getLinkData()
            this.linkVisible = false
          })
        } else {
          return false
        }
      })
    },
    getLinkData() {
      api
        .getLink({
          stage_id: this.pid,
          project_id: this.data.projectid,
          stream_type: ['UPSTREAM', 'DOWNSTREAM']
        })
        .then(response => {
          this.dataRender.upstream = this.streamChange(response.data.UPSTREAM)
          this.dataRender.downstream = this.streamChange(
            response.data.DOWNSTREAM
          )
        })
    },
    relateLinkType() {
      api
        .relateLinkT({
          project_id: this.data.projectid
        })
        .then(response => {
          this.linkData.typeList = response.data
        })
    },
    relateLinkStage(id) {
      this.linkForm.stageId = ''
      api
        .relateLinkS({
          type_id: id,
          stage_id: this.pid,
          project_id: this.data.projectid
        })
        .then(response => {
          this.linkData.stageList = response.data
        })
    },
    streamChange(arr = []) {
      var temp = []
      arr.forEach(item => {
        var obj = {}
        for (let i in item) {
          if (i == 'type_name') {
            obj.label = item.type_name
          }
        }

        obj.children = []
        item._child.forEach(itemIn => {
          var o = {}
          for (let i in itemIn) {
            if (i == 'name') {
              o.label = itemIn.name
              obj.children.push(o)
            }
          }
        })
        temp.push(obj)
      })
      return temp
    },
    //关闭相关环节的dialog
    handleClose() {
      this.$refs.linkForm.resetFields()
      this.linkData.stageList = []
      this.linkVisible = false
    }
  }
}
</script>

<style lang="scss">
</style>
