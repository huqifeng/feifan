<template>
  <div>
    <!-- 数字 -->
    <template v-if="field.attribute_type === 'number'">
      <el-input
        v-model="field.content"
        ref="input"
        maxlength="30"
        :disabled="field.editable !== '1'"
      ></el-input>
    </template>
    <!-- 日期 -->
    <template v-else-if="field.attribute_type === 'date'">
      <el-date-picker
        type="date"
        v-model="field.content"
        placeholder="选择日期"
        value-format="yyyy-MM-dd"
        :disabled="field.editable !== '1'"
      ></el-date-picker>
    </template>
    <!-- 日期 -->
    <template v-else-if="field.attribute_type === 'datetime'">
      <el-date-picker
        type="datetime"
        v-model="field.content"
        placeholder="选择日期"
        value-format="yyyy-MM-dd HH:mm:ss"
        :disabled="field.editable !== '1'"
      ></el-date-picker>
    </template>
    <!-- 时间 -->
    <template v-else-if="field.attribute_type === 'time'">
      <el-time-picker
        v-model="field.content"
        value-format="HH:mm:ss"
        placeholder="选择时间"
        :disabled="field.editable !== '1'"
      ></el-time-picker>
    </template>
    <!-- select -->
    <template v-else-if="field.attribute_type === 'select'">
      <el-select v-model="field.content" placeholder="请选择" :disabled="field.editable !== '1'">
        <el-option
          v-for="(item,idx) in field.value.split(',')"
          :key="idx"
          :label="item"
          :value="item"
          :disabled="item.disabled"
        ></el-option>
      </el-select>
    </template>
    <!-- input -->
    <template v-else>
      <el-input
        :type="field.attribute_type"
        v-model="field.content"
        resize="none"
        ref="input"
        maxlength="30"
        :disabled="field.editable !== '1'"
      ></el-input>
    </template>
    <span
      class="iconfont icon-delete delete"
      href="javascript:;"
      v-if="field.display==='1'"
      @click="removeFields(field.attribute_title)"
    ></span>
  </div>
</template>

<script>
export default {
  props: {
    field: {
      type: Object,
      default() {
        return {}
      }
    }
  },
  data() {
    return {}
  },
  methods: {
    removeFields(val) {
      this.$emit('removeFields', val)
    }
  }
}
</script>
