<template>
  <el-dialog title="新增任务" :visible="visible" class="taskDialog" @close="closeDialogFn">
    <el-form :model="form" :rules="rules" ref="form">
      <el-form-item label="任务模版" :label-width="form.formLabelWidth" prop="taskTemplateId">
        <el-select
          v-model="taskTemplateId"
          placeholder="请选择任务模版"
          @change="taskTemplate(taskTemplateId)"
          style="width:100%"
          :disabled="projectTemplate!=='0'"
        >
          <el-option
            v-for="(item,index) in templates"
            :key="index"
            :label="item.templateTitle?item.templateTitle:templates[0].templateTitle"
            :value="item.templateId"
          ></el-option>
        </el-select>
      </el-form-item>

      <el-form-item label="任务类型" :label-width="form.formLabelWidth">
        <el-form-item prop="taskMold">
          <el-select
            v-model="form.taskMold"
            placeholder="请选择任务类型"
            @change="fn(form.taskMold)"
            style="width: 100%"
          >
            <el-option
              v-for="item in createTask.taskSM.taskMold"
              :key="item.moldId"
              :label="item.moldTitle"
              :value="item.moldId"
            >{{item.moldTitle}}</el-option>
          </el-select>
        </el-form-item>
      </el-form-item>
      <el-form-item label="任务阶段" :label-width="form.formLabelWidth" class="stageItem">
        <el-form-item prop="display">
          <el-input
            class="numInput"
            placeholder="请选择阶段"
            v-model="form.display"
            readonly
          ></el-input>
          <div class="showChild" v-show="stageShow">
            <el-checkbox-group v-model="form.taskStages" @change="handleCheckChange">
              <template v-for="item in createTask.taskSM.taskStage">
                <el-checkbox
                  class="item outVid"
                  v-if="item.moldId==form.curMoldId"
                  :key="item.stageId"
                  :label="item.stageId"
                >{{item.stageTitle}}</el-checkbox>
              </template>
            </el-checkbox-group>
            <div style="margin:20px 0;">
              <el-button @click="closeChild">关 闭</el-button>
              <el-button type="primary" @click="addChild()">保 存</el-button>
            </div>
          </div>
          <el-button class="manyBtn" @click="clickMany">多选</el-button>
        </el-form-item>
      </el-form-item>
      <el-form-item
        label="任务集数"
        :label-width="form.formLabelWidth"
        placeholder="请创建任务集数"
        prop="episodes"
      >
        <input
          v-model="form.episodes"
          autocomplete="off"
          placeholder="请输入“开始集-结束集”或“单集集数”"
          @keyup="form.episodes=form.episodes.replace(/[^\d|-]/g,'')"
          class="el-input__inner"
        >
      </el-form-item>
      <el-form-item label="备注" :label-width="form.formLabelWidth" prop="remarks">
        <textarea
          rows="5"
          class="el-input__inner textarea"
          v-model="form.remarks"
          autocomplete="off"
          maxlength="150"
        ></textarea>
      </el-form-item>
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button @click="closeDialogFn">取 消</el-button>
      <el-button type="primary" @click="newTask()">确 定</el-button>
    </div>
  </el-dialog>
</template>
<script>
import { getTaskTemplate, addProduceTaskStage } from '@/api/make'
export default {
  props: {
    templates: {
      type: Array,
      default() {
        return []
      }
    },
    projectId: { type: String, required: true, default: '' },
    projectTemplate: { type: String, required: false, default: '' },
    visible: { type: Boolean, default: false }
  },
  data() {
    var validateEpisodes = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请输入任务集数'))
      } else {
        let reg = /^\d+(-\d+)?$/
        let status = reg.test(value)
        if (!status) {
          callback(new Error('请输入“开始集-结束集”，开始集需要小于结束集'))
        } else {
          if (value.indexOf('-') == -1) {
            if (parseInt(value) >= 200) {
              callback(new Error('集数小于200'))
            } else {
              let val = []
              val.push(value)
              this.taskEpisodes = val
            }
          } else {
            let arr = value.split('-')
            let episodesA = []
            if (parseInt(arr[1]) >= 200) {
              callback(new Error('集数小于200'))
            }
            if (parseInt(arr[1]) <= parseInt(arr[0])) {
              callback(new Error('请输入“开始集-结束集”，开始集需要小于结束集'))
            }

            for (let i = parseInt(arr[0]); i <= parseInt(arr[1]); i++) {
              episodesA.push(i)
            }
            value = episodesA
            this.taskEpisodes = episodesA
          }
        }
        callback()
      }
    }
    return {
      createTask: {
        taskTemplates: [],
        taskSM: {}
      },
      stageShow: false,
      templateBool: true, //默认模版加载列表是使用
      defaultTemplateId: '',
      taskEpisodes: [],
      taskTemplateId: '',
      form: {
        projectid: '',
        taskTemplateId: '',
        taskMold: '',
        display: '',
        taskStages: [],
        episodes: '',
        remarks: '',
        curMoldId: '',
        taskMoldBool: false,
        formLabelWidth: '130px'
      },
      rules: {
        taskTemplateId: [
          { required: true, message: '请选择任务模版', trigger: 'change' }
        ],
        taskMold: [
          { required: true, message: '请选择任务类型', trigger: 'change' }
        ],
        display: [
             { required: true, message: '请选择任务阶段', trigger: 'change' }
         ],
        episodes: [{ validator: validateEpisodes, trigger: 'blur' }]
        // remarks: [
        //     { required: true, message: '请选择任务阶段', trigger: 'blur' }
        // ],
      }
    }
  },
  watch: {
    templates: {
      deep: true,
      immediate: true,
      handler(templates) {
        let [first = {}] = templates
        this.defaultTemplateId = first.templateId
        this.projectTemplate === '0'
          ? (this.taskTemplateId = this.defaultTemplateId)
          : (this.taskTemplateId = this.projectTemplate)
        // ? this.defaultTemplateId
        // : this.taskTemplateId
        if (this.taskTemplateId && this.templateBool) {
          this.taskTemplate(this.taskTemplateId)
          this.form.taskTemplateId = this.taskTemplateId
          this.templateBool = false
        }
      }
    }
  },
  methods: {
    taskTemplate(id) {
      let params = {
        taskTemplateId: id
      }
      getTaskTemplate(params).then(res => {
        this.createTask.taskSM = res.data
        let mold = res.data.taskMold
        this.form.taskMold = mold[0].moldId ? mold[0].moldId : ''
        this.fn(mold[0].moldId)
      })
    },
    fn(id) {
      this.form.curMoldId = id
      this.form.taskStages = []
      this.form.display = ''
    },
    newTask() {
      this.$refs.form.validate(valid => {
        var params = {};
        params.projectid = this.projectId;
        params.taskTemplateId = this.taskTemplateId;
        params.taskMold = this.form.taskMold;
        let taskStages = [];
        let stage = this.form.display.split(',');
        if(stage.length>0){
            taskStages = this.createTask.taskSM.taskStage.filter(function(a) {
                let num = 0;
                stage.forEach(function(b) {
                    if (b === a.stageTitle) {
                        num++
                    }
                });
                return num > 0
            })
        }
        params.taskStages = taskStages.map(item => item.stageId);
        params.episodes = this.taskEpisodes
        this.form.projectid = this.projectId
        params.remarks = this.form.remarks
        if (valid) {
          addProduceTaskStage(params).then(res => {
            if (res.code == 0) {
              this.$message({
                type: 'success',
                message: res.msg
              })
              this.$emit('update:visible', false)
              this.$emit('updated')
            }
          })
        } else {
          return false
        }
      })
    },
    closeDialogFn() {
      this.$refs.form.resetFields()
      this.$emit('update:visible', false)
      this.stageShow = false;
      this.form.display = '';
      this.form.taskStages = '';
      this.$emit('update:visible', false);
      //重新打开dialog ，--对应场次镜头
      let mold = this.createTask.taskSM.taskMold
      this.form.taskMold = mold[0].moldId ? mold[0].moldId : ''
      this.fn(mold[0].moldId)
    },
    // 阶段保存
    addChild() {
      let checklist = this.form.taskStages
      let abc = this.createTask.taskSM.taskStage.filter(function(a) {
        let num = 0
        checklist.forEach(function(b) {
          if (b === a.stageId) {
            num++
          }
        })
        return num > 0
      })
      this.form.display = abc.map(item => item.stageTitle).toString()
      this.stageShow = false
    },
    // 阶段关闭
    closeChild() {
      this.stageShow = false
    },
    clickMany() {
      this.stageShow = !this.stageShow
    },
    handleCheckChange() {}
  }
}
</script>
<style lang="scss">
  .showChild {
    position: absolute;
    z-index: 100;
    top: 58px;
    left: 0;
    overflow-y: auto;
    width: 230px;
    height: auto;
    background: rgba(255, 255, 255, 1);
    box-shadow: 0px 4px 9px 0px rgba(1, 102, 178, 0.3);
    padding: 5px 10px 20px;
    .outVid {
      display: block;
      line-height: 30px;
      .el-checkbox__label {
        font-size: 12px;
        color: #333;
      }
    }
  }
</style>
