<template>
  <el-dialog title="新增任务（特效）" :visible="visible" class="taskDialog" @close="closeDialogFn">
    <el-form :model="form" :rules="rules" ref="form" :label-width="form.formLabelWidth">
      <el-form-item label="任务模版" prop="taskTemplateId">
        <el-select
          v-model="form.taskTemplateId"
          placeholder="请选择任务模版"
          @change="taskTemplate"
          style="width:100%"
          :disabled="projectTemplate !== '0'"
        >
          <el-option
            v-for="(item,index) in templates"
            :key="index"
            :label="item.templateTitle?item.templateTitle:templates[0].templateTitle"
            :value="item.templateId"
          ></el-option>
        </el-select>
      </el-form-item>

      <el-form-item label="任务类型">
        <el-form-item prop="taskMold">
          <el-select
            v-model="form.taskMold"
            placeholder="请选择任务类型"
            @change="handleChangeTaskType(form.taskMold)"
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
      <el-form-item label="任务阶段" prop="taskStages">
        <el-input class="numInput" placeholder="请选择阶段" :value="multipleSelection.name" readonly></el-input>
        <div class="showChild" v-show="stageShow">
          <el-checkbox-group v-model="multipleSelection.value">
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
      <el-form-item label="任务集数" prop="episodesId">
        <el-select
          v-model="form.episodesId"
          placeholder="请选择任务集数"
          style="width:100%"
          @change="form.scenesId=''"
        >
          <el-option
            v-for="(item,index) in templatesEpisodes"
            :key="index"
            :label="item.episode"
            :value="item.episode"
          ></el-option>
        </el-select>
      </el-form-item>

      <el-form-item label="任务场次" prop="scenesId">
        <el-select
          v-model="form.scenesId"
          placeholder="请选择任务场次"
          style="width:100%"
          @change="form.cameraLenId=''"
        >
          <template v-for="(item,index) in templatesScenes">
            <el-option
              v-if="item.episode==form.episodesId"
              :key="index"
              :label="item.scene"
              :value="item.scene"
            ></el-option>
          </template>
        </el-select>
      </el-form-item>
      <el-form-item label="任务镜头" prop="cameraLenId">
        <el-select v-model="form.cameraLenId" placeholder="请选择任务镜头" style="width:100%">
          <template v-for="(item,index) in templatesLens">
            <el-option
              v-if="item.episode==form.episodesId && item.scene==form.scenesId"
              :key="index"
              :label="item.lens"
              :value="item.lens"
            ></el-option>
          </template>
        </el-select>
      </el-form-item>
      <el-form-item label="缩略图" prop="file" class="imgItem">
        <div class="a-upload">
          <input
            type="file"
            accept="image/*"
            @change="previewFile"
            :id="inputFileId"
            v-if="!imageBool"
          >

          <div v-if="!imageBool" style="color:#D8D8D8;font-size:12px;">
            <img src="../../../assets/images/defaultLoad.png" alt style="width:29px;height:24px;">
            <p>上传图片</p>
          </div>
          <img
            :src="imageUrl"
            style="max-width: 100%;display: block;height: 100%;margin: 0 auto;"
            alt="缩略图"
            v-if="imageBool"
          >
        </div>
      </el-form-item>
      <el-form-item label="备注" prop="remarks">
        <textarea
          v-model="form.remarks"
          maxlength="150"
          autocomplete="off"
          @keyup="form.episodes=form.episodes.replace(/[^\d|-]/g,'')"
          class="el-input__inner textarea"
        ></textarea>
      </el-form-item>
      <el-form-item label="等级难度" prop="diffId" style="display:none">
        <el-select v-model="form.diffId" placeholder="请选择等级难度" style="width:100%">
          <el-option v-for="(item,index) in templatesDiff" :key="index" :label="item" :value="item"></el-option>
        </el-select>
      </el-form-item>
    </el-form>

    <div slot="footer" class="dialog-footer">
      <el-button @click="closeDialogFn">取 消</el-button>
      <el-button type="primary" @click="add()">确 定</el-button>
    </div>
  </el-dialog>
</template>
<script>
import { getTaskTemplate, addProduceSpecialTaskStage } from '@/api/make'
export default {
  props: {
    templates: {
      type: Array,
      default() {
        return []
      }
    },
    projectId: { type: String, required: true, default: '' },
    visible: { type: Boolean, default: false },
    projectTemplate: { type: String, default: '' }
  },
  data() {
    return {
      inputFileId: `input-file_${this.$lodash.uniqueId()}`,
      createTask: {
        taskTemplates: [],
        taskSM: {}
      },
      stageShow: false,
      taskEpisodes: [],
      templatesEpisodes: [],
      templatesScenes: [],
      templatesLens: [],
      templatesDiff: ['A', 'B', 'C', 'D', 'E'],
      imageUrl: '', //上传缩略图
      imageBool: false, //上传缩略图是否显示图片
      form: {
        projectid: '',
        taskTemplateId: '',
        taskMold: '',
        taskStages: [],
        episodes: '',
        curMoldId: '',
        episodesId: '',
        scenesId: '',
        cameraLenId: '',
        diffId: '',
        file: null,
        taskMoldBool: false,
        formLabelWidth: '130px',
        remarks: ''
      },
      rules: {
        taskTemplateId: [
          { required: true, message: '请选择任务模版', trigger: 'change' }
        ],
        taskMold: [
          { required: true, message: '请选择任务类型', trigger: 'change' }
        ],
        taskStages: [
          { required: true, message: '请选择任务阶段', trigger: 'change' }
        ],
        episodesId: [
          { required: true, message: '请选择任务集数', trigger: 'change' }
        ],
        scenesId: [
          { required: true, message: '请选择任务场次', trigger: 'change' }
        ],
        cameraLenId: [
          { required: true, message: '请选择任务镜头', trigger: 'change' }
        ],
        file: {
          required: true,
          type: 'object',
          message: '请上传缩略图',
          trigger: 'change'
        }
        // diffId: [
        //   { required: true, message: '请选择任务等级', trigger: 'change' }
        // ]
      },
      multipleSelection: {
        name: '',
        value: []
      }
    }
  },
  watch: {
    projectTemplate: {
      deep: true,
      immediate: true,
      handler(value) {
        let [first = {}] = this.templates
        this.form.taskTemplateId = value !== '0' ? value : first.templateId
      }
    },
    visible: {
      deep: true,
      immediate: true,
      handler() {
        this.visible && this.taskTemplate(this.form.taskTemplateId)
      }
    }
  },
  methods: {
    taskTemplate(id) {
      let params = {
        taskTemplateId: id,
        projectid: this.projectId
      }

      getTaskTemplate(params).then(res => {
        this.createTask.taskSM = res.data
        this.templatesEpisodes = res.data.episodes
        this.templatesScenes = res.data.scenes
        this.templatesLens = res.data.lens
        let mold = res.data.taskMold

        this.form.taskMold = mold[0].moldId ? mold[0].moldId : ''
        this.handleChangeTaskType(mold[0].moldId)
      })
    },
    // 任务类型改变
    handleChangeTaskType(id) {
      this.form.curMoldId = id
      this.form.taskStages = []
      // 多选相关
      this.multipleSelection.name = ''
      this.multipleSelection.value = []
      // 移除表单检验规则
      this.$nextTick(function() {
        this.$refs.form && this.$refs.form.clearValidate('taskStages')
      })
    },
    add() {
      this.$refs.form.validate(valid => {
        let params = new FormData()
        var episodes = []
        var scenes = []
        var lens = []
        var diffId = []
        episodes.push(this.form.episodesId)
        scenes.push(this.form.scenesId)
        lens.push(this.form.cameraLenId)
        diffId.push(this.form.diffId)
        params.append('projectid', this.projectId)
        params.append('taskTemplateId', this.form.taskTemplateId)
        params.append('taskMold', this.form.taskMold)
        params.append('remarks', this.form.remarks)
        this.changeData(params, 'taskStages', this.form.taskStages)
        this.changeData(params, 'episodes', episodes)
        this.changeData(params, 'scenes', scenes)
        this.changeData(params, 'lens', lens)
        params.append('thumbnail', this.form.file)
        if (valid) {
          addProduceSpecialTaskStage(params).then(res => {
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
    changeData(params, key, list) {
      for (let i = 0; i < list.length; i++) {
        params.append(key + '[' + i + ']', list[i])
      }
    },
    // 关闭模态框
    closeDialogFn() {
      this.$refs.form.resetFields()
      this.imageBool = false
      // 多选相关
      this.multipleSelection.name = ''
      this.multipleSelection.value = []
      this.stageShow = false
      this.$emit('update:visible', false)
    },
    // 阶段保存
    addChild() {
      let checklist = this.multipleSelection.value
      this.form.taskStages = checklist
      this.multipleSelection.name = checklist
        .map(id => {
          let found = this.createTask.taskSM.taskStage.find(
            item => item.stageId === id
          )
          return found.stageTitle
        })
        .join(',')
      this.stageShow = false
    },
    // 阶段关闭
    closeChild() {
      // 恢复原有数据
      this.multipleSelection.value = this.form.taskStages
      this.stageShow = false
    },
    // 阶段显示
    clickMany() {
      this.stageShow = !this.stageShow
      // 恢复原有数据
      if (!this.stageShow) {
        this.multipleSelection.value = this.form.taskStages
      }
      // this.$refs.form.resetFields();
      // this.form.taskStages = '';
      // this.imageBool = false;
      // this.$emit('update:visible', false);
    },
    previewFile() {
      let fileDom = document.querySelector(`#${this.inputFileId}`)
      let [file] = fileDom.files

      console.log(fileDom.files)
      this.form.file = file

      console.log(typeof this.form.file)
      // this.form.file.push(file)
      // console.log(this.form.file[0])
      // 限制上传图片的大小
      // if (file.size > 1024 * 1024 * 2) {
      //   alert('图片大小不能超过 2MB!')
      //   return false
      // }
      // 当前浏览器支持FileReader
      if (window.FileReader) {
        var reader = new FileReader()
        reader.readAsDataURL(file)
        reader.addEventListener('load', () => {
          this.$forceUpdate()
          this.imageUrl = reader.result
          this.imageBool = true
        })
      } else {
        console.log('Not supported by your browser!')
      }
    }
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
.a-upload {
  text-align: center;
  padding: 4px 10px;
  line-height: 20px;
  position: relative;
  cursor: pointer;
  color: #888;
  /*background: #fafafa;*/
  /*border: 1px solid #ddd;*/
  overflow: hidden;
  display: inline-block;
  *display: inline;
  *zoom: 1;
  width: 180px;
  height: 100px;
  background: rgba(248, 248, 248, 1);
  div {
    margin-top: 25px;
  }
  input {
    position: absolute;
    font-size: 100px;
    right: 0;
    top: 0;
    opacity: 0;
    filter: alpha(opacity=0);
    cursor: pointer;
  }
}

/*.a-upload:hover {*/
/*color: #444;*/
/*background: #eee;*/
/*border-color: #ccc;*/
/*text-decoration: none*/
/*}*/
</style>
