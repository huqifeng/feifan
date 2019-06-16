import http from '@/libs/http'

// 获取任务列表
export function taskList(data) {
  return http({
    url: '/api/v2.0/project/produceTaskList',
    method: 'post',
    data
  })
}

// 获取任务分组列表
export function taskGroupList(data) {
  return http({
    url: '/api/v2.0/project/produceGroupTaskList',
    method: 'post',
    data
  })
}

// 获取任务甘特图
export function getTaskGanttList(data) {
  return http({
    url: '/api/v2.0/gantt/chart',
    method: 'post',
    data
  })
}

// 获取里程碑
export function getMilestone(params) {
  return http({
    url: '/api/v2.0/gantt/getMilestone',
    method: 'get',
    params
  })
}

// 获取里程碑
export function getMilestoneTask(params) {
  return http({
    url: '/api/v2.0/gantt/getStagesByMilestone',
    method: 'get',
    params
  })
}

// 添加里程碑
export function addMilestone(data) {
  return http({
    url: '/api/v2.0/gantt/addMilestone',
    method: 'post',
    data
  })
}

// 修改里程碑
export function updateMilestone(data) {
  return http({
    url: '/api/v2.0/gantt/updateMilestone',
    method: 'post',
    data
  })
}

// 删除里程碑
export function deleteMilestone(data) {
  return http({
    url: '/api/v2.0/gantt/deleteMilestone',
    method: 'post',
    data
  })
}

/**
 * 导入模块 start
 */

// 获取项目的表头信息
export function projectTableHeader(data) {
  return http({
    url: '/api/v2.0/import/getTableHeaderInfo',
    method: 'post',
    data
  })
}

// 匹配表头信息
export function matchTableHeader(data) {
  return http({
    url: '/api/v2.0/import/mateData',
    method: 'post',
    data
  })
}

// 匹配图片信息
export function matchImage(data) {
  return http({
    url: '/api/v2.0/Import/mateImage',
    method: 'post',
    data
  })
}

// 完成导入任务数据
export function importTask(data) {
  return http({
    url: '/api/v2.0/Import/chunkImportData',
    method: 'post',
    data
  })
}

/**
 * 导入模块 end
 */


/**
 * 视图模块 start
 */
// 使用版本文件
export function useVersion(data) {
  return http({
    url: '/api/v2.0/productionTask/useVersion',
    method: 'post',
    data
  })
}

// 批注
export function addRemark(data) {
  return http({
    url: '/api/v2.0/productionTask/insertRemark',
    method: 'post',
    data
  })
}

// 批注列表
export function remarkList(data) {
  return http({
    url: '/api/v2.0/productionTask/getInfoList',
    method: 'post',
    data
  })
}

// 删除视图
export function deleteView(data) {
  return http({
    url: '/api/v2.0/project/delProduceViewTable',
    method: 'post',
    data
  })
}

// 修改另存为视图
export function modifyView(data) {
  return http({
    url: '/api/v2.0/project/saveProduceViewTable',
    method: 'post',
    data
  })
}

/**
 * 导出模块
 */
export function exportTask(data) {
    return http({
        url: '/api/v2.0/project/exportTask',
        method: 'post',
        data
    })
}

// 获取任务详情
export function getTaskInfo(data) {
  return http({
    url: '/api/v2.0/productionTask/getTaskDetail',
    method: 'post',
    data
  })
}

// 获取任务镜头信息
export function getTaskLensInfo(params) {
  return http({
    url: '/api/v2.0/productionTask/getStageInfo',
    method: 'get',
    params
  })
}
