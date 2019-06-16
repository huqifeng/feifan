import http from '@/libs/http'

// 流程审核菜单
export function workflowMenu(data) {
  return http({
    url: '/api/v2.0/Approve/getObjectTypeList',
    method: 'post',
    data
  })
}
// 流程审核信息
export function workflowInfo(data) {
  return http({
    url: '/api/v2.0/Approve/getObjectTypeInfo',
    method: 'post',
    data
  })
}
// 流程审核阶段列表
export function workflowReviewList(data) {
  return http({
    url: '/api/v2.0/Approve/getApproveList',
    method: 'post',
    data
  })
}
// 流程审核阶段添加
export function workflowAdd(data) {
  return http({
    url: '/api/v2.0/Approve/insertApprove',
    method: 'post',
    data
  })
}
// 流程审核阶段修改
export function workflowUpdate(data) {
  return http({
    url: '/api/v2.0/Approve/editApprove',
    method: 'post',
    data
  })
}
// 流程审核阶段修改
export function workflowPDUpdate(data) {
  return http({
    url: '/api/v2.0/Approve/editObjectTypeInfo',
    method: 'post',
    data
  })
}
// 流程审核阶段删除
export function workflowDelete(data) {
  return http({
    url: '/api/v2.0/Approve/delApprove',
    method: 'post',
    data
  })
}
// 流程审核阶段排序
export function workflowSort(data) {
  return http({
    url: '/api/v2.0/Approve/sort',
    method: 'post',
    data
  })
}

// 任务审核状态
export function taskStatusList(data) {
  return http({
    url: '/api/v2.0/Approve/getProductionTaskStatusList',
    method: 'post',
    data
  })
}

// 任务制作者状态
export function taskPDStatusList(data) {
  return http({
    url: '/api/v2.0/Approve/getTargetManStatusList',
    method: 'post',
    data
  })
}

// 获取系统中状态列表
export function systemStatusList() {
  return http({
    url: '/api/v2.0/ProductionTask/getTaskColorListSys',
    method: 'post'
  })
}

// 获取项目中状态列表
export function projectStatusList(data) {
  return http({
    url: '/api/v2.0/ProductionTask/getTaskColorListByProId',
    method: 'post',
    data
  })
}

// 新增状态
export function addStatusList(data) {
  return http({
    url: '/api/v2.0/ProductionTask/addColorToProTask',
    method: 'post',
    data
  })
}

// 修改状态
export function modifyStatusList(data) {
  return http({
    url: '/api/v2.0/ProductionTask/updateProTaskColor',
    method: 'post',
    data
  })
}

// 删除状态
export function deleteStatusList(data) {
  return http({
    url: '/api/v2.0/ProductionTask/deleteProTaskColor',
    method: 'post',
    data
  })
}

// 文件存储命名规则
export function checkNameList(data) {
  return http({
    url: '/api/v2_0/ProductionTask/getFormatListOption',
    method: 'post',
    data
  })
}

// 文件存储查询文件名称信息
export function checkNameInfor(data) {
  return http({
    url: '/api/v2_0/ProductionTask/getFileNameRule',
    method: 'post',
    data
  })
}

// 保存命名规则信息
export function ctrlNameRule(data) {
  return http({
    url: '/api/v2_0/ProductionTask/saveFileNameToProFolder',
    method: 'post',
    data
  })
}

// 删除命名规则
export function deleteNameRule(data) {
  return http({
    url: '/api/v2_0/ProductionTask/delProFileNameOption',
    method: 'post',
    data
  })
}

// 查询文件名称编辑支持格式
export function checkNameTypes(data) {
  return http({
    url: '/api/v2_0/ProductionTask/getFormatExtRule',
    method: 'post',
    data
  })
}

// 获取文件格式的类型
export function checkNameWays(data) {
  return http({
    url: '/api/v2_0/ProductionTask/getFormatExtListOption',
    method: 'post',
    data
  })
}

// 删除支持格式
export function deleteNameTypes(data) {
  return http({
    url: '/api/v2_0/ProductionTask/delFormatExt',
    method: 'post',
    data
  })
}

// 保存支持格式接口
export function ctrlNameType(data) {
  return http({
    url: '/api/v2_0/ProductionTask/saveFormatExt',
    method: 'post',
    data
  })
}
