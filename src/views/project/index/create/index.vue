<template>
  <div class="taskDialog project-update-wrap">
    <div class="el-dialog info-section">
      <el-form
        :model="ruleForm"
        :rules="rules"
        :inline="true"
        ref="ruleForm"
        size="medium"
        label-width="180px"
        v-show="step===1"
      >
        <h2>
          新建项目
          <span>基本信息</span>
        </h2>
        <el-form-item label="项目名称：" prop="title">
          <el-input placeholder="请输入项目名称" maxlength="25" v-model="ruleForm.title"></el-input>
        </el-form-item>
        <el-form-item
          label="项目制片："
          prop="filmmakers"
          :show-message="ruleForm.filmmakers.length ===0"
        >
          <select-user
            title="选择制片"
            v-model="ruleForm.filmmakers"
            :multiple="true"
            checkTitle="制片："
            :limitCount="10"
            @change="getCheckFilmmakers"
            ref="filmmakers"
          >
            <el-tooltip
              popper-class="custom-tooltip"
              effect="light"
              :content="showFilmmakers"
              placement="bottom-end"
              :disabled="ruleForm.filmmakers.length===0"
              :visible-arrow="false"
            >
              <div class="custom-select" @click="$refs.filmmakers.dialogVisible = true">
                {{showFilmmakers}}
                <i class="el-icon-arrow-up"></i>
              </div>
            </el-tooltip>
          </select-user>
        </el-form-item>
        <el-form-item label="名称简写：" prop="simplify_title">
          <el-input placeholder="请输入名称简写" maxlength="25" v-model="ruleForm.simplify_title"></el-input>
        </el-form-item>
        <el-form-item label="项目状态：" prop="status">
          <el-select v-model="ruleForm.status" placeholder="请选择项目状态">
            <el-option
              v-for="(item,key) in info.status"
              :key="key"
              :label="item"
              :value="key"
              v-show="key!=='54' && key!=='57'"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="市场：" prop="marketers" :show-message="ruleForm.marketers.length ===0">
          <select-user
            title="选择市场"
            v-model="ruleForm.marketers"
            :multiple="true"
            @change="getCheckMarkers"
            checkTitle="市场："
            :limitCount="10"
            ref="marketers"
          >
            <el-tooltip
              popper-class="custom-tooltip"
              effect="light"
              :content="showMarketers"
              placement="bottom-end"
              :disabled="ruleForm.marketers.length===0"
              :visible-arrow="false"
            >
              <div class="custom-select" @click="$refs.marketers.dialogVisible = true">
                {{showMarketers}}
                <i class="el-icon-arrow-up"></i>
              </div>
            </el-tooltip>
          </select-user>
        </el-form-item>
        <el-form-item label="项目类型：" prop="type">
          <el-select v-model="ruleForm.type" placeholder="请选择项目类型">
            <el-option v-for="(item,key) in info.type" :key="key" :label="item" :value="key"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="导演：" prop="director">
          <el-input placeholder="请输入导演名称" maxlength="25" v-model="ruleForm.director"></el-input>
        </el-form-item>
        <el-form-item label="开始制作：" prop="start_time">
          <el-date-picker
            type="date"
            v-model="ruleForm.start_time"
            placeholder="请选择日期"
            value-format="yyyy-MM-dd"
            :picker-options="startDate"
          ></el-date-picker>
        </el-form-item>
        <el-form-item label="制片人：" prop="producer">
          <el-input placeholder="请输入制片人" v-model="ruleForm.producer" maxlength="25"></el-input>
        </el-form-item>
        <el-form-item label="制作完成：" prop="end_time">
          <el-date-picker
            type="date"
            v-model="ruleForm.end_time"
            placeholder="请选择日期"
            value-format="yyyy-MM-dd"
            :picker-options="endDate"
          ></el-date-picker>
        </el-form-item>
        <el-form-item label="制片主任：" prop="production_director">
          <el-input placeholder="请输入制片主任" v-model="ruleForm.production_director" maxlength="25"></el-input>
        </el-form-item>
        <el-form-item label="项目封面" prop="image" :error="uploadTip">
          <el-upload
            ref="uploadImg"
            action="/api/v2.0/Project/upload"
            name="myFile"
            list-type="picture-card"
            :limit="1"
            :on-success="uploadResult"
            :on-remove="uploadRemove"
            :before-upload="beforeUpload"
            accept="image/png, image/jpg, image/jpeg"
            :class="{'hide-upload':isHideUpload}"
          >
            <i class="el-icon-plus"></i>
          </el-upload>
          <div class="upload-tips">
            <p>图片格式为JPG、JPEG、PNG</p>
            <p>
              上传图片不能超过20M
              图片宽/高尺寸不小于400像素
            </p>
          </div>
        </el-form-item>
        <div class="el-dialog__footer">
          <el-button @click="handleCancel">取消</el-button>
          <el-button type="primary" @click="nextStep">下一步</el-button>
        </div>
      </el-form>
      <el-form
        v-show="step===2"
        :model="templateForm"
        :rules="templateRules"
        :inline="true"
        ref="templateForm"
        size="medium"
        label-width="180px"
      >
        <h2>
          新建项目
          <span>扩展信息</span>
        </h2>
        <el-form-item label="项目信息模板：" prop="tpl_id">
          <el-select v-model="templateForm.tpl_id" @change="changeTemplate">
            <el-option
              v-for="item in info.template_list"
              :key="item.id"
              :label="item.title"
              :value="item.id"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item
          class="extend-item"
          v-for="(field, index) in templateForm.fields"
          :label="field.attribute_title"
          :key="field.config_id"
          :prop="'fields.' + index + '.content'"
          :rules="{required: field.required === '1', message: `请${['input','number','textarea'].includes(field.attribute_type) ? '填写':'选择'}${field.attribute_title}`, trigger: field.attribute_type === 'input' ? 'blur' :'change'}"
        >
          <template-field :field="field" @removeFields="removeFields"></template-field>
        </el-form-item>
        <el-form-item class="add-btn">
          <a href="javascript:;" @click="showAddDialog">新增字段</a>
        </el-form-item>
        <div class="el-dialog__footer">
          <el-button @click="step=1">取消</el-button>
          <el-button type="primary" @click="handlePrimary">保存</el-button>
        </div>
      </el-form>
    </div>
    <el-dialog :visible.sync="addVisible" class="taskDialog" :close-on-click-modal="false">
      <el-form
        :model="addForm"
        :rules="addRules"
        ref="addForm"
        label-width="140px"
        @submit.native.prevent
      >
        <el-form-item label="输入字段名称" prop="attribute_title">
          <el-input v-model.trim="addForm.attribute_title" maxlength="20"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="addVisible=false">取 消</el-button>
        <el-button type="primary" @click="addField">确 定</el-button>
      </span>
    </el-dialog>
    <el-dialog title="删除提示" :visible.sync="deleteVisible" class="taskDialog delete-tips-dialog">
      <p class="tips-type">{{deleteTips}}</p>
      <div slot="footer" class="dialog-footer">
        <el-button @click="deleteVisible=false">取 消</el-button>
        <el-button type="primary" @click="confirmDelete">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import SelectUser from '@/components/selectUser/selectUser'
import TemplateField from '@/views/project/info/update/templateField'
import {
  getCreateProjectInfo,
  getTemplateInfo,
  createProject,
  checkProject
} from '@/api/project/projectIndex'
export default {
  components: { SelectUser, TemplateField },
  data() {
    // 校验名称简称
    let validateSign = (rule, value, callback) => {
      let reg = /^[a-zA-Z0-9]+$/g
      if (!reg.test(value)) {
        callback(new Error('名称简写格式不正确'))
      } else {
        callback()
      }
    }
    // 校验属性
    let validateAttr = (rule, value, callback) => {
      let flag = false
      let fields = this.ruleForm.fields.concat(this.templateForm.fields)
      for (let val of fields) {
        if (val.attribute_title === value) {
          flag = true
          break
        }
      }
      if (flag) {
        callback(new Error('该属性名称已经存在'))
      } else {
        callback()
      }
    }
    return {
      info: {}, // 基本信息
      addVisible: false,
      deleteVisible: false, // 删除提示框
      dealItem: {}, // 当前处理的项
      parentId: '', // 新增自定义字段传参
      deleteTips: '确定删除当前字段吗？',
      templateDeleteId: [], // 删除的模板字段id
      marketers: [], // 市场人员
      filmmakers: [], // 项目制片
      image: '',
      thumbImage: '',
      startDate: {
        disabledDate: time => {
          return time.getTime() > new Date(this.ruleForm.end_time).getTime()
        }
      },
      endDate: {
        disabledDate: time => {
          return (
            time.getTime() <
            new Date(this.ruleForm.start_time).getTime() - 8.64e7
          )
        }
      },
      uploadTip: '', // 项目封面提示信息
      addForm: {
        attribute_title: ''
      },
      addRules: {
        attribute_title: [
          { required: true, message: '请输入字段名称', trigger: 'blur' },
          { validator: validateAttr, trigger: 'blur' }
        ]
      },
      ruleForm: {
        fields: [],
        status: '49',
        type: '3',
        marketers: [], // 市场人员
        filmmakers: [] // 项目制片
      },
      rules: {
        title: [{ required: true, message: '请填写项目名称', trigger: 'blur' }],
        filmmakers: [
          { required: true, message: '请选择项目制片', trigger: 'change' }
        ],
        status: [
          { required: true, message: '请选择项目状态', trigger: 'change' }
        ],
        start_time: [
          { required: true, message: '请选择开始时间', trigger: 'change' }
        ],
        end_time: [
          { required: true, message: '请选择完成时间', trigger: 'change' }
        ],
        marketers: [
          { required: true, message: '请选择市场', trigger: 'change' }
        ],
        type: [
          { required: true, message: '请选择项目类型', trigger: 'change' }
        ],
        simplify_title: [
          { required: true, message: '请填写名称简写', trigger: 'blur' },
          { validator: validateSign, trigger: 'blur' }
        ]
      },
      templateForm: { fields: [], tpl_id: '1' },
      templateRules: {
        tpl_id: [
          { required: true, message: '请选择项目信息模板', trigger: 'change' }
        ]
      },
      step: 1,
      isHideUpload: false // 是否显示上传按钮
    }
  },
  computed: {
    showMarketers() {
      return this.marketers.map(item => item.name).join(',')
    },
    showFilmmakers() {
      return this.filmmakers.map(item => item.name).join(',')
    }
  },
  methods: {
    // 取消
    handleCancel() {
      this.$router.push('/project/index')
    },
    uploadRemove() {
      this.isHideUpload = false
    },
    beforeUpload(file) {
      const isLt20M = file.size / 1024 / 1024 < 20
      if (!isLt20M) {
        this.uploadTip = '上传图片不能超过20M'
      }
      const isSize = new Promise(function(resolve, reject) {
        let width = 400
        let height = 400
        let _URL = window.URL || window.webkitURL
        let img = new Image()
        img.onload = function() {
          let valid = img.width > width && img.height > height
          valid ? resolve() : reject()
        }
        img.src = _URL.createObjectURL(file)
      }).then(
        () => {
          return file
        },
        () => {
          this.uploadTip = '图片宽/高尺寸不小于400像素'
          return Promise.reject()
        }
      )
      this.isHideUpload = true
      return isLt20M && isSize
    },
    uploadResult(response) {
      if (response.code !== 0) {
        this.$message({
          message: response.msg,
          type: 'error'
        })
        this.$refs.uploadImg.clearFiles()
        this.isHideUpload = false
      } else {
        this.image = response.data.image
        this.thumbImage = response.data.thumb
        this.uploadTip = ''
      }
    },
    showAddDialog() {
      this.addVisible = true
      this.$nextTick(() => {
        this.$refs.addForm.resetFields()
      })
    },
    // 获取新增信息
    getCreateProjectInfo() {
      getCreateProjectInfo().then(res => {
        if (res.code === 0) {
          this.info = res.data
        }
      })
    },
    nextStep() {
      this.$refs.ruleForm.validate().then(() => {
        let param = {
          title: this.ruleForm.title,
          simplify_title: this.ruleForm.simplify_title
        }
        checkProject(param).then(res => {
          if (res.code === 0) {
            this.step = 2
            this.getTemplateInfo()
          }
        })
      })
    },
    // 确定
    handlePrimary() {
      // 校验通过
      this.$refs.templateForm.validate().then(() => {
        let param = Object.assign({}, this.ruleForm)
        param.tpl_id = this.templateForm.tpl_id
        let tpl_info = []
        this.templateForm.fields.forEach(item => {
          if (item.custom) {
            tpl_info.push({
              title: item.attribute_title,
              val: item.content,
              parentidId: this.parentId
            })
          } else {
            tpl_info.push({
              config_id: item.config_id,
              val: item.content
            })
          }
        })
        param.tpl_info = JSON.stringify(tpl_info)
        param.marketers = this.ruleForm.marketers.join(',')
        param.filmmakers = this.ruleForm.filmmakers.join(',')
        param.image = this.image
        param.thumb_image = this.thumbImage
        createProject(param).then(res => {
          if (res.code === 0) {
            this.$router.push('/project/index')
          }
        })
      })
    },
    // 删除内容
    removeFields(item) {
      this.deleteVisible = true
      this.dealItem = item
      if (this.templateForm.fields.length === 1) {
        this.deleteTips = '请至少保留1个'
      }
    },
    // 确然删除
    confirmDelete() {
      if (this.templateForm.fields.length === 1) {
        this.deleteVisible = false
        return
      }
      for (let idx in this.templateForm.fields) {
        let val = this.templateForm.fields[idx]
        if (val.attribute_title === this.dealItem) {
          this.templateForm.fields.splice(idx, 1)
          this.templateDeleteId.push(val.config_id)
        }
      }
      this.deleteVisible = false
    },
    // 新增字段
    addField() {
      this.$refs.addForm.validate().then(() => {
        this.addVisible = false
        this.templateForm.fields.push({
          attribute_title: this.addForm.attribute_title,
          attribute_type: 'input',
          config_id: new Date().getTime(),
          display: '1',
          editable: '1',
          required: '0',
          content: '',
          custom: true
        })
      })
    },
    // 获取到选择的人员
    getCheckMarkers(val) {
      this.marketers = val
    },
    getCheckFilmmakers(val) {
      this.filmmakers = val
    },
    getSelectUserId(val) {
      let arr = val.split(',')
      let ids = []
      arr.forEach(item => {
        ids.push(parseInt(item))
      })
      return ids
    },
    // 获取模板信息
    getTemplateInfo() {
      getTemplateInfo({ template_id: this.templateForm.tpl_id }).then(res => {
        let arr = []
        if (res.code === 0) {
          res.data.base.forEach(item => {
            arr.push(...item.children)
          })
          this.$set(this.templateForm, 'fields', arr)
          this.parentId = res.data.base[0].config_id
        }
      })
    },
    // 更改模板
    changeTemplate() {
      this.getTemplateInfo()
    }
  },
  created() {
    this.getCreateProjectInfo()
  }
}
</script>
<style lang="scss">
@import '@/style/project.scss';
</style>

