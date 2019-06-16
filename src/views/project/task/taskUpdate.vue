<template>
  <div class="task-update modifyDialog">
    <el-dialog
      :title="field.name"
      :visible.sync="dialogVisible"
      :close-on-click-modal="false"
      @open="handleOpen"
      @opened="handleOpened"
      @close="handleClose"
      :width="this.field.key === 'target_id' ? '790px' : '460px'"
    >
      <el-form :model="form" :rules="rules" ref="form" @submit.native.prevent>
        <el-form-item prop="inputValue">
          <!-- 选择用户 -->
          <template v-if="field.key === 'target_id'">
            <select-user-panel @change="handleUserChange"></select-user-panel>
          </template>
          <!-- 数字 -->
          <template v-else-if="field.type === 'number' || field.type === 'double'">
            <el-input v-model="form.inputValue" :maxlength="field.length" min="0" ref="input"></el-input>
          </template>
          <!-- 日期 -->
          <template v-else-if="field.type === 'date'">
            <el-date-picker
              type="date"
              v-model="form.inputValue"
              placeholder="选择日期"
              value-format="yyyy-MM-dd"
              style="width:100%;"
            ></el-date-picker>
          </template>
          <!-- 日期 -->
          <template v-else-if="field.type === 'datetime'">
            <el-date-picker
              type="datetime"
              v-model="form.inputValue"
              placeholder="选择日期"
              value-format="yyyy-MM-dd HH:mm:ss"
              style="width:100%;"
            ></el-date-picker>
          </template>
          <!-- 时间 -->
          <template v-else-if="field.type === 'time'">
            <el-time-picker
              v-model="form.inputValue"
              value-format="HH:mm:ss"
              placeholder="选择时间"
              style="width:100%;"
            ></el-time-picker>
          </template>
          <!-- select -->
          <template v-else-if="field.type === 'select'">
            <el-select v-model="form.inputValue" placeholder="请选择" style="width:100%;">
              <el-option
                v-for="item in selectList"
                :key="item.value"
                :label="item.label"
                :value="item.value"
                :disabled="item.disabled"
              ></el-option>
            </el-select>
          </template>
          <!-- input -->
          <template v-else>
            <el-input v-model="form.inputValue" :maxlength="field.length" ref="input"></el-input>
          </template>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button round @click="handleClose">取 消</el-button>
        <el-button type="primary" round @click="handleClick">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { updateTask, getTaskStatus } from '@/api/make'
import SelectUserPanel from '@/components/selectUser/selectUserPanel'
export default {
  name: 'TaskUpdate',
  props: {
    visible: { type: Boolean, required: true, default: false },
    // 列表数据
    data: {
      type: Array,
      required: true,
      default() {
        return []
      }
    },
    // 字段名称
    fieldName: { type: String, required: true, default: '' },
    // 字段列表
    fields: {
      type: Array,
      required: true,
      default() {
        return []
      }
    },
    // 项目ID
    projectId: { type: String, required: true, default: '' },
    // 版本ID
    versionId: { type: String, required: true, default: '' },
    // 编辑ID列表
    ids: {
      type: Array,
      required: true,
      default() {
        return []
      }
    },
    isSearch: { type: Boolean, default: false },
    // 是否是分组
    isGroup: { type: Boolean, default: false }
  },
  components: { SelectUserPanel },
  data() {
    var checkInputValue = (rule, value, callback) => {
      // 不校验长度
      let unCheckLength = ['datetime', 'date', 'time']
      // 不校验必填项
      let unCheckEmpty = ['task_name']
      // 必填
      if (
        !value &&
        !unCheckEmpty.includes(this.field.key.toLowerCase()) &&
        this.field.isDefault !== '1'
      ) {
        callback(new Error(`${this.field.name}不能为空`))
        return false
      }
      if (
        this.field.type === 'double' &&
        !/^\d{1,3}(\.+\d{1,2})?$/.test(value)
      ) {
        callback(new Error('请输入0-999.99区间值，最多保留两位小数'))
        return false
      }
      // 长度判读
      if (
        value.length > this.field.length &&
        !unCheckLength.includes(this.field.type)
      ) {
        callback(new Error(`最多输入${this.field.length}个字符`))
        return false
      }
      callback()
    }
    return {
      dialogVisible: false,
      unSetDefalutValue: ['target_id'], // 显示的时候不设置默认值
      form: { inputValue: '' },
      rules: {
        inputValue: [{ validator: checkInputValue, trigger: 'change' }]
      },
      // 选择列表
      selectList: []
    }
  },
  watch: {
    visible: {
      immediate: true,
      handler(value) {
        this.dialogVisible = value
      }
    },
    origin: {
      deep: true,
      handler(value) {
        this.form.inputValue = !this.unSetDefalutValue.includes(this.fieldName)
          ? (value[this.fieldName] || '').replace(/<em>|<\/em>/gi, '')
          : ''
      }
    },
    'form.inputValue'(value = '') {
      if (!this.field.key) {
        return
      }
      // 只能输入数字
      if (
        this.field.type === 'number' ||
        this.field.type === 'double' ||
        ['vocaltract', 'margin'].includes(this.field.key.toLowerCase())
      ) {
        value = value.replace(/[^\d.]/g, '')
      }
      // 只能输入1-9数字
      if (['handleframe'].includes(this.field.key.toLowerCase())) {
        value = value.replace(/[^1-9]/g, '')
      }
      // 只能输入时间数字
      if (
        ['intimecode', 'outtimecode', 'picture'].includes(
          this.field.key.toLowerCase()
        )
      ) {
        value = value.replace(/[^\d:]/g, '')
      }
      // 只能输入大小写字母
      if (['tvsystem', 'audiocoding'].includes(this.field.key.toLowerCase())) {
        value = value.replace(/[^A-Za-z]/g, '')
      }
      // 只能输入大小写字母和数字
      if (
        ['voicesampling', 'framerate', 'bitrate', 'framenumber'].includes(
          this.field.key.toLowerCase()
        )
      ) {
        value = value.replace(/[^A-Za-z0-9.]/g, '')
      }
      // 只能输入中文
      if (['fieldorder'].includes(this.field.key.toLowerCase())) {
        value = value.replace(/[^\u4e00-\u9fa5]/g, '')
      }
      // 只能输入百分比数字,最多保留两位小数
      if (['vbr'].includes(this.field.key.toLowerCase())) {
        value = value.replace(/[^\d.%]/g, '').replace(/^\./g, '')
        if (value.includes('.')) {
          value = value.replace(
            /\.\d{2,}$/,
            value.substr(value.indexOf('.'), 3)
          )
        }
      }
      // 屏蔽空格
      if (
        this.field.type === 'string' &&
        !['videocoding', 'videocamera', 'voiceproductionformat'].includes(
          this.field.key.toLowerCase()
        ) // 可以输入空格的字段
      ) {
        value += ''
        value = value.replace(/\s+/g, '')
      }
      // 屏蔽特殊字符
      if (
        ['hourlong', 'bitdepth', 'colorspace'].includes(
          this.field.key.toLowerCase()
        )
      ) {
        value = value.replace(/[`~!@#$%^&*+\\\]}{';:"/.,><\s|=\-?]/g, '')
      }
      // 屏蔽中文
      if (
        [
          'materialfilename',
          'volumename',
          'framesize',
          'videocoding',
          'colorspace',
          'voiceproductionformat',
          'scaling',
          'videocamera'
        ].includes(this.field.key.toLowerCase())
      ) {
        value = value.replace(/[\u4e00-\u9fa5]/g, '')
      }
      // 屏蔽大小写字母
      if (['scaling'].includes(this.field.key.toLowerCase())) {
        value = value.replace(/[A-Za-z]/g, '')
      }
      this.form.inputValue = value
    }
  },
  computed: {
    // 当前修改的字段
    field() {
      return this.fields.find(item => item && item.key === this.fieldName) || {}
    },
    // 获取编辑的第一条原数据
    origin() {
      let [id] = this.ids
      return this.getDataItemById(id) || {}
    }
  },
  methods: {
    handleOpen() {
      if (this.fieldName === 'state') {
        this.getTaskStatus()
      }
    },
    handleOpened() {
      let input = this.$refs.input
      if (input) {
        input.focus()
        input.select()
      }
    },
    handleClose() {
      this.dialogVisible = false
      this.$refs.form.resetFields()
      this.$emit('hide')
      this.$emit('update:visible', false)
    },
    // 点击确定的时候
    handleClick() {
      let isPass = false
      this.$refs.form.validate(valid => {
        isPass = valid
      })
      if (!isPass) {
        return false
      }
      let params = {
        key: this.fieldName,
        values: [],
        stage_id: [],
        is_default: this.field.isDefault ? 2 : 1,
        projectid: this.projectId,
        version_id: this.versionId
      }
      this.ids.forEach(id => {
        params.stage_id.push(id)
        params.values.push(this.form.inputValue)
      })
      if (this.isSearch) {
        params.source = 'search'
      }
      updateTask(params).then(response => {
        this.$message({ type: 'success', message: response.msg })
        this.dialogVisible = false
        this.$emit('updated')
      })
    },
    handleUserChange(data) {
      this.form.inputValue = data.id
    },
    // 获取任务状态
    getTaskStatus() {
      getTaskStatus({ projectid: this.projectId, stageId: this.ids }).then(
        response => {
          let { allAuditAction, auditAction } = response.data.state
          this.selectList = allAuditAction.map(item => {
            return {
              value: item.id,
              label: item.name,
              disabled: !auditAction.includes(item.id)
            }
          })
          let found = auditAction.find(id => id === this.form.inputValue) || ''
          this.form.inputValue = found
          this.$nextTick(function() {
            this.$refs.form.clearValidate()
          })
        }
      )
    },
    // 根据ID获取一条数据
    getDataItemById(id) {
      return this.data.find(item => item.id === id) || {}
    }
  }
}
</script>
