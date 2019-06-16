<template>
  <div class="task-contextMenu">
    <ul class="context-menu" :style="pos" ref="rightMenu" @click.stop v-show="isShow">
      <li class="item divided" @click="fieldSort('ASC')">
        <span class="fieldShow">
           按升序排序
          <i class="el-icon-check" v-show = "sortASCShow"></i>
         </span>
       </li>
      <li class="item divided" @click="fieldSort('DESC')">
         <span class="fieldShow">
           按降序排序
          <i class="el-icon-check" v-show = "sortDESCShow"></i>
         </span>
      </li>
      <li class="item divided showProp">
        <span @click="fieldShow" class="fieldShow">
          显示列
          <i class="el-icon-arrow-right arrow-right"></i>
        </span>
        <div class="showChild context-menu context-menu1" v-show="isShowChild">
          <el-checkbox-group v-model="checkList" @change="handleCheckChange($event)">
            <el-checkbox
              :id="item.key"
              class="item divided checkChild"
              v-for="(item,index) in headItems"
              :key="index"
              :label="item.key"
            >{{item.name}}</el-checkbox>
          </el-checkbox-group>
        </div>
      </li>
      <li class="item divided" @click="fieldhide" :disabled="showLast">隐藏列</li>
      <li class="item divided" @click="fieldMana">字段管理</li>
      <li class="item invided">
        <p>筛选</p>
        <p>
          <el-input
            placeholder="筛选本列下的内容"
            maxlength="20"
            v-model.trim="searchField"
            size="mini"
            @keyup.native="filterTaskFieldScreen"
            @change="filterTaskFieldScreen"
          ></el-input>
        </p>
        <div class="filter-wrap" v-loadmore="loadMoreCustom">
          <el-checkbox-group v-model="customFilter" @change="saveFilterStatus($event)">
            <el-checkbox v-for="(item,idx) in filterData" :label="item" :key="idx"></el-checkbox>
          </el-checkbox-group>
        </div>
      </li>
    </ul>
    <el-dialog title="自定义列" :visible.sync="isShowCustom" class="taskDialog">
      <ul class="custom-list">
        <li v-for="item in customList" :key="item.retrieval">
          <div class="custom-name">{{item.title}}</div>
          <div class="opt-wrap">
            <i class="el-icon-edit" @click="editCustomColumn(item)"></i>
            <i class="el-icon-delete" @click="deleteCustomColumn(item.retrieval)"></i>
          </div>
        </li>
      </ul>
      <p class="add-custom">
        <i class="el-icon-circle-plus" @click="addCustomColumn"></i>
      </p>
      <div slot="footer" class="dialog-footer">
        <el-button @click="isShowCustom = false">取 消</el-button>
        <el-button type="primary" @click="isShowCustom = false">确 定</el-button>
      </div>
    </el-dialog>
    <el-dialog :title="customTitle" :visible.sync="isShowAddCustom" class="taskDialog">
      <el-form
        :model="customColumnParam"
        :rules="customColumnRules"
        ref="addCustomColumnForm"
        label-width="130px"
      >
        <el-form-item label="字段名称" prop="fieldName">
          <el-input v-model.trim="customColumnParam.fieldName" maxlength="20"></el-input>
        </el-form-item>
        <el-form-item label="字段格式" prop="genre">
          <el-select
            v-model="customColumnParam.genre"
            placeholder="请选择字段格式"
            class="block"
            :disabled="genreDisabled"
          >
            <el-option label="数字" value="number"></el-option>
            <el-option label="文本" value="string"></el-option>
            <el-option label="日期(2019.3.3)" value="date"></el-option>
            <el-option label="时间1-24h" value="time"></el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="isShowAddCustom = false">取 消</el-button>
        <el-button type="primary" @click="submitAddCustom">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import {
  addProduceTaskField,
  getCustomFieldList,
  saveTaskCustomField,
  delTaskCustomField,
  getTaskFieldScreen
} from '@/api/make'
import $ from 'jquery'
export default {
  props: [
    'isShow',
    'rightEvent',
    'projectid',
    'filterParam',
    'userId',
    'viewid',
    'headItems',
    'checkShow'
  ],
  data() {
    return {
      pos: {},
      nowIndex: -1,
      showLast: false,
      sortASCShow:false,
      sortDESCShow:false,
      selectbox: false,
      isShowCustom: false, //自定义列弹框
      isShowAddCustom: false, //新增自定义列
      customFilter: [], //筛选自定义列
      checkList: [], //复选框组
      checkBollean: [true, true],
      searchField: '',
      customColumnParam: {
        //新增自定义列
        fieldName: '',
        genre: ''
      },
      customColumnRules: {
        //新增自定义列校验规则
        fieldName: [
          { required: true, message: '请输入字段名称', trigger: 'blur' },
          { max: 20, message: '最多输入20个字符', trigger: 'blur' }
        ],
        genre: [
          { required: true, message: '请选择字段格式', trigger: 'change' }
        ]
      },
      customTitle: '',
      customList: [],
      retrieval: null, //编辑自定义列标识,
      filterData: [], //筛选类别
      filterPage: 1,
      userFilter: {},
      isloadMore: false,
      totalCount: 0,
      genreDisabled: false, //字段格式是否可以编辑
      isShowChild: false //显示子菜单
    }
  },
  watch: {
    rightEvent: {
      handler: function(val) {
        this.searchField = ''
        this.filterPage = 1
        this.totalCount = 0
        this.filterData = []
        this.$nextTick(() => {
          let clientW = document.documentElement.clientWidth
          let clientH = document.documentElement.clientHeight
          let diffX = clientW - val.pageX
          let diffY = clientH - val.pageY
          let rightMenuW = this.$refs.rightMenu.offsetWidth
          let rightMenuWH = this.$refs.rightMenu.offsetHeight
          let x = val.pageX + 'px'
          let y = val.pageY + 'px'
          if (diffX < rightMenuW) {
            x = clientW - rightMenuW + 'px'
          }
          if (diffY < rightMenuWH) {
            y = clientH - rightMenuWH + 'px'
          }
          this.pos = {
            left: x,
            top: y
          }
          this.renderTaskFieldScreen()
        })
      },
      deep: true
    },
    isShow: {
      handler: function(val) {
        this.isShowChild = !val
      },
      deep: true
    }
  },
  methods: {
    // 排序
    fieldSort(a) {
        if(a==='ASC'){
            this.sortASCShow = !this.sortASCShow;
            this.sortDESCShow = false;
        }else{
            this.sortDESCShow = !this.sortDESCShow;
            this.sortASCShow = false
        }
        (this.sortDESCShow||this.sortASCShow)? this.$emit('sortParams', a,true):this.$emit('sortParams', a,false)
        this.$emit('hideContextMenu')
    },
    // 显示列
    fieldShow() {
      this.isShowChild = !this.isShowChild
      if (this.isShowChild) {
        this.checkList = this.checkShow.map(item => item.key)
      }
    },
    // 隐藏列
    fieldhide() {
      if (Array.isArray(this.checkShow) && this.checkShow.length === 1) {
        this.showLast = true
        this.$message({
          type: 'warning',
          message: '至少预留一列'
        })
      } else {
        this.isShowChild = false
        this.$emit('hideColumn')
      }
    },
    // 复选框显示隐藏列
    handleCheckChange($event) {
      let child = $('.checkChild')
      if (Array.isArray($event) && $event.length === 1) {
        for (let i = 0; i < child.length; i++) {
          if (child.eq(i).attr('id') === $event[0]) {
            child
              .eq(i)
              .find('input')
              .attr('disabled', 'disabled')
            child
              .eq(i)
              .find('.el-checkbox__input')
              .addClass('is-disabled')
          }
        }
      } else {
        for (let i = 0; i < child.length; i++) {
          child
            .eq(i)
            .find('input')
            .removeAttr('disabled')
          child
            .eq(i)
            .find('.el-checkbox__input')
            .removeClass('is-disabled')
        }
      }
      this.$emit('hideAllColumn', this.checkList)
    },
    // getIndex(index){
    //     return index;
    // },
    loadMoreCustom() {
      //滚动加载更多
      let totalPage = Math.ceil(this.totalCount / 15)
      if (this.filterPage >= totalPage) return
      this.isloadMore = true
      let param = Object.assign({}, this.filterParam, {
        projectid: this.projectid,
        p: ++this.filterPage,
        num: 15,
        searchField: this.searchField
      })
      getTaskFieldScreen(param).then(res => {
        if (res.data.list.length) {
          this.filterData = this.filterData.concat(res.data.list)
          this.$nextTick(() => {
            this.setFilterCheckStatus()
          })
        }
        this.isloadMore = false
      })
    },
    fieldMana() {
      this.isShowCustom = true
      this.$emit('changeShowMenu', false)
      this.renderCustomFieldList()
    },
    submitAddCustom() {
      this.$refs['addCustomColumnForm'].validate(valid => {
        if (valid) {
          if (this.customTitle == '新增列') {
            let param = Object.assign({}, this.customColumnParam, {
              projectid: this.projectid,
              retrieval: this.filterParam.retrieval,
              viewId: this.viewid
            });
            addProduceTaskField(param).then(res => {
              if (res.code == 0) {
                this.isShowAddCustom = false;
                this.isShowCustom = false;
                this.$emit('reloadTask');
                this.$message({
                  type: 'success',
                  message: '新增成功'
                })
                this.renderCustomFieldList()
              }
            })
          } else {
            let param = {
              projectid: this.projectid,
              retrieval: this.retrieval,
              genre: this.customColumnParam.genre,
              newFieldName: this.customColumnParam.fieldName,
              viewId: this.viewid
            }
            saveTaskCustomField(param).then(res => {
              if (res.code == 0) {
                this.isShowAddCustom = false
                this.$emit('reloadTask')
                this.$message({
                  type: 'success',
                  message: '修改成功'
                })
                this.renderCustomFieldList()
              }
            })
          }
        }
      })
    },
    addCustomColumn() {
      //新增自定义列
      this.customTitle = '新增列'
      this.genreDisabled = false
      this.isShowAddCustom = true
      this.customColumnParam = {
        fieldName: '',
        genre: ''
      }
      this.$nextTick(() => {
        this.$refs.addCustomColumnForm.clearValidate()
      })
    },
    editCustomColumn(item) {
      //编辑自定义列
      this.customTitle = '编辑列'
      this.genreDisabled = true
      this.isShowAddCustom = true
      this.retrieval = item.retrieval
      let param = {
        fieldName: item.title,
        genre: item.genre
      }
      this.customColumnParam = Object.assign({}, param)
      this.$nextTick(() => {
        this.$refs.addCustomColumnForm.clearValidate()
      })
    },
    deleteCustomColumn(id) {
      //删除自定义列
      this.$confirm(
        '删除本字段，字段下的所有内容都将删除，且不可恢复，确认删除吗？',
        {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }
      )
        .then(() => {
          let param = {
            retrieval: id,
            projectid: this.projectid,
            viewId: this.viewid
          }
          delTaskCustomField(param).then(res => {
            if (res.code == 0) {
              this.$emit('reloadTask')
              this.$message({
                type: 'success',
                message: '删除成功'
              })
              this.renderCustomFieldList()
            }
          })
        })
        .catch(() => {})
    },
    renderCustomFieldList() {
      //渲染自定义列列表
      getCustomFieldList({
        projectid: this.projectid,
        viewId: this.viewid
      }).then(res => {
        this.customList = res.data.customFields || []
      })
    },
    renderTaskFieldScreen() {
      //获取筛选列表
      let param = Object.assign({}, this.filterParam, {
        searchField: this.searchField,
        projectid: this.projectid,
        p: 1,
        num: 15
      })
      getTaskFieldScreen(param).then(res => {
        this.filterData = res.data.list || []
        this.totalCount = res.data.count
        this.setFilterCheckStatus()
      })
    },
    setFilterCheckStatus() {
      //设置筛选的勾选状态
      let fliterInfo = JSON.parse(window.localStorage.getItem(this.userId))
      let colKey = this.filterParam.retrieval
      let curCol =
        fliterInfo && fliterInfo[colKey] && fliterInfo[colKey].searchValues
      this.customFilter = []
      if (fliterInfo && curCol && curCol.length) {
        this.filterData.forEach(item => {
          if (curCol.indexOf(item) === -1) {
            this.customFilter.push(item)
          }
        })
      } else {
        this.filterData.forEach(item => {
          this.customFilter.push(item)
        })
      }
    },
    saveFilterStatus($event) {
      console.log($event.target)
      //保存筛选状态
      let user = this.userId
      let fliterInfo = JSON.parse(window.localStorage.getItem(user)) || {}
      let colKey = this.filterParam.retrieval
      let notSelect = []
      if (fliterInfo && JSON.stringify(fliterInfo) != '{}') {
        if (fliterInfo[colKey] && fliterInfo[colKey].searchValues.length) {
          for (let item of fliterInfo[colKey].searchValues) {
            if (this.customFilter.indexOf(item) === -1) {
              notSelect.push(item)
            }
          }
        }
      }
      for (let item of this.filterData) {
        if (
          this.customFilter.indexOf(item) === -1 &&
          notSelect.indexOf(item) === -1
        ) {
          notSelect.push(item)
        }
      }
      let obj = {
        isDefault: this.filterParam.isDefault,
        retrieval: colKey,
        searchValues: notSelect
      }
      this.userFilter = Object.assign({}, fliterInfo)
      this.$set(this.userFilter, [colKey], obj)
      window.localStorage.setItem(user, JSON.stringify(this.userFilter));
      // 恢复显示序列
      let child = $('.checkChild')
      for (let i = 0; i < child.length; i++) {
          child.eq(i).find('input').removeAttr('disabled')
          child.eq(i).find('.el-checkbox__input').removeClass('is-disabled')
      }
      this.checkList = this.headItems.map(item => item.key);
      this.$emit('reloadTask', 1)
    },
    filterTaskFieldScreen() {
      this.filterPage = 1
      this.totalCount = 0
      this.renderTaskFieldScreen()
    }
  }
}
</script>

<style lang="scss">
.context-menu {
  position: absolute;
  top: 0;
  left: 0;
  z-index: 10;
  /*padding: 10px;*/
  background-color: #fff;
  border: 1px solid #ebeef5;
  border-radius: 4px;
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
  width: 150px;
  text-align: left;
  font-size: 12px;
  .divided {
    line-height: 30px;
    height: 30px;
    padding-left: 10px;
    color: #333333;
    display: block;
    .el-checkbox__label {
      font-size: 12px;
      color: #333333;
    }
    /*border-bottom: 1px #d2d2d2 solid;*/
  }
  .divided:hover {
    background: #f1f1f1;
  }
  .invided {
    padding: 0 10px 15px;
    color: #333333;
    .el-checkbox {
      display: block;
      margin-top: 10px;
    }
    .el-checkbox__label {
      color: #333333;
      font-size: 12px;
    }
  }
  .fieldShow {
    display: block;
  }
  .showProp {
    position: relative;
    .showChild {
      position: absolute;
      top: -13px;
      left: 140px;
      height: 350px;
      overflow-y: auto;
      width: 148px;
    }
  }
  .item {
    cursor: pointer;
  }
  p {
    margin-bottom: 10px;
  }
  .filter-wrap {
    max-height: 200px;
    text-align: left;
    overflow: auto;
    .el-checkbox-group {
      overflow-y: hidden;
    }
  }
  .el-icon-check{
    float: right;
    font-size: 14px !important;
    margin: 7px 7px;
    color:#179bff;
    font-weight:700;
  }
  .arrow-right {
    float: right;
    font-size: 14px !important;
    margin: 7px 7px;
  }
}

.context-menu1 {
  width: 110px;
  text-align: left;
  .item {
    cursor: pointer;
  }
}
.el-select.block {
  display: block;
}
.task-contextMenu {
  [class*='el-icon'] {
    font-size: 20px;
  }
}
.custom-list {
  max-height: 300px;
  overflow-x: auto;
  li {
    display: flex;
    border-bottom: 1px #d2d2d2 solid;
    padding-bottom: 5px;
    margin-bottom: 5px;
    .opt-wrap {
      width: 60px;
      i {
        margin-left: 10px;
        cursor: pointer;
      }
    }
    .custom-name {
      flex: 1;
    }
  }
}
</style>
