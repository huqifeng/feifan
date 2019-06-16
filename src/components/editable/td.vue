<template>
  <div class="editable-td">
    <template v-if="isEditable">
      <div class="cell-main is-editable" :data-key="fieldName" :data-id="id">
        <div class="editable-cell-content">
          <slot>
            <div v-if="fieldName==='state'">
              <div v-for="item in statusList" :key="item.id">
                 <span
                         v-html="item.name"
                         v-if="rowCode===item.id"
                         :style="'background:'+item.color"
                         class="widthColor"
                 ></span>
              </div>
            </div>
            <div v-else>
              <span v-html="value"></span>
            </div>
          </slot>
          <slot name="append"></slot>
        </div>
        <div class="editable-cell-pencil"></div>
      </div>
    </template>
    <template v-else>
      <slot>
        <span v-html="value"></span>
      </slot>
      <slot name="append"></slot>
    </template>
  </div>
</template>

<script>
export default {
  name: 'EditableTd',
  data(){
      return{
          statueType:[]
      }
  },
  props: {
    // 当前编辑的ID
    id: { type: String },
    // 当前编辑的字段名称
    fieldName: { type: String },
    // 等待狀態
    rowCode: { type: String },
    // 数据内容
    value: { type: String, default: '' },
    // 是否可以编辑
    isEditable: { type: Boolean, default: false },
    projectid:{ type: String, default: '' },
    statusList:{
        type:Array,
        default(){
            return [];
        }
    }
  },
  dataState:{

  },
}
</script>

<style lang="scss" scoped>
.cell-main {
  height: 40px;
  line-height: 40px;
}

.cell-main {
  position: relative;
  margin-left: -10px;
  margin-right: -10px;
}
.cell-main.is-selected {
  background: #ecf4fe !important;
}
.cell-main .editable-cell-content {
  padding: 0 20px;
  height: 100%;
}
.cell-main:hover .editable-cell-pencil {
  display: block;
}
.cell-main .editable-cell-pencil {
  position: absolute;
  right: 0;
  top: 0;
  display: none;
  width: 25px;
  height: 100%;
  background: url('../../assets/images/pencil.png') no-repeat center center;
  background-size: 16px;
  cursor: pointer;
}

</style>

