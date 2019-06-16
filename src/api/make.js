import http from '@/libs/http'
//获取任务列表
export function getTaskList(params) {
  return http.post('/api/v2.0/project/produceTaskList', params)
}
//删除任务
export function delTask(params) {
  return http.post('/api/v2.0/productionTask/delTask', params)
}
//获取自定义列列表
export function getCustomFieldList(params) {
  return http.post('/api/v2.0/project/produceTaskCustomFieldList', params)
}
//新增自定义列
export function addProduceTaskField(params) {
  return http.post('/api/v2.0/project/addProduceTaskField', params)
}
//删除自定义列
export function delTaskCustomField(params) {
  return http.post('/api/v2.0/project/delProduceTaskCustomField', params)
}
//编辑自定义列
export function saveTaskCustomField(params) {
  return http.post('/api/v2.0/project/saveProduceTaskCustomField', params)
}
//获取筛选列表
export function getTaskFieldScreen(params) {
  return http.post('/api/v2.0/project/produceTaskFieldScreen', params)
}
/*
任务-操作历史
 */
export function getHistoryList(params) {
  return http.post('/api/v2.0/productionTask/getTaskHistory', params)
}
/*
任务-详情
 */
export function getTaskInfo(params) {
  return http.post('/api/v2.0/productionTask/getTaskDetail', params)
}

/*
任务-发备注
 */
export function sendRemark(params) {
  return http.post('/api/v2.0/productionTask/insertRemark', params)
}
/*
任务-备注列表
 */
export function getRemarkList(params) {
  return http.post('/api/v2.0/productionTask/getInfoList', params)
}
// 修改任务
export function updateTask(params) {
  return http.post('/api/v2.0/productionTask/editTask', params)
}
/*
断点续传
 */
export function mergeSimpleUpload(params) {
  return http.post('/api/v2.0/Upload/checkMd5', params)
}
/*
文件列表
 */
export function getFileList(params) {
  return http.post('/api/v2.0/productionTask/getFileList', params)
}
/*
任务模版接口
 */
export function getTaskTemplate(params) {
  return http.post('/api/v2.0/project/produceTaskTemplate', params)
}
/*
新建任务
 */
export function addProduceTaskStage(params) {
  return http.post('/api/v2.0/project/addProduceTaskStage', params)
}
/*
更新版本文件
 */
export function insertFile(params) {
  return http.post('/api/v2.0/productionTask/insertFile', params)
}
/*
使用版本文件
 */
export function useVersion(params) {
  return http.post('/api/v2.0/productionTask/useVersion', params)
}

/**
 * 项目设置
 * start
 */

// 获取文件菜单
export function getFileMenu(params) {
  return http.post('/api/v2.0/pts/fprivilege/get_info', params)
}
// 获取文件权限
export function getFilePermission(params) {
  return http.post('/api/v2.0/pts/fprivilege/get', params)
}
// 设置文件权限
export function setFilePrmission(data) {
  return http({
    method: 'post',
    url: '/api/v2.0/pts/fprivilege/set',
    headers: { 'Content-Type': 'application/json' },
    data: JSON.stringify(data)
  })
}
/**
 * 项目设置
 * end
 */

// 项目任务上传文件
export function addTaskFile(params) {
  return http.post('/api/v2.0/productionTask/insertFile', params)
}

/*
是否可以 读、上传、下载
 */

export function getAccess(params) {
  return http.post('/api/v2.0/pts/fprivilege/get_cur_ug', params)
}

// 获取项目任务阶段状态
export function getTaskStatus(params) {
  return http.post('/api/v2.0/deploy/getProjectProduceTaskStatus', params)
}

// 文件是否转码成功
export function checkVcodec(params) {
  return http.post('/api/v2.0/productionTask/checkVcodec', params)
}

// 获取播放url
export function getPlayUrl(params) {
  return http.post('/api/v2.0/productionTask/checkVcodec', params)
}

// 新增集数
export function addProduceTaskEpisode(params) {
  return http.post('/api/v2.0/project/addProduceTaskEpisode', params)
}

// 新增场次
export function addProduceTaskScene(params) {
  return http.post('/api/v2.0/project/addProduceTaskScene', params)
}

// 新增镜头
export function addProduceTaskLens(params) {
  return http.post('/api/v2.0/project/addProduceTaskLens', params)
}

// 新增特效
export function addProduceSpecialTaskStage(params) {
  return http.post('/api/v2.0/project/addProduceSpecialTaskStage', params, {
    headers: {
      'Content-Type': 'multipart/form-data'
    }
  })
}

// 相关环节--新增连接
export function addLink(params) {
  return http.post('/api/v2.0/stream/set', params)
}

// 相关环节--获取连接
export function getLink(params) {
  return http.post('/api/v2.0/stream/get', params)
}

// 相关环节--新增连接的弹窗联动关系
export function relateLinkT(params) {
  return http.post('/api/v2.0/production/get_type', params)
}

// 相关环节--新增连接的弹窗联动关系
export function relateLinkS(params) {
  return http.post('/api/v2.0/stage/linkages_by_type', params)
}

// 获取分组列表
export function groupTaskList(params) {
  return http.post('/api/v2.0/project/produceGroupTaskList', params)
}
