import http from '@/libs/http'

// 获取项目列表
export function getProjectIndex(data) {
  return http({
    url: '/api/v2.0/Project/projectIndex',
    method: 'post',
    data
  })
}
// 更新状态
export function updateStatus(data) {
  return http({
    url: '/api/v2.0/Project/upProjectState',
    method: 'post',
    data
  })
}
// 删除项目
export function deletProject(data) {
  return http({
    url: '/api/v2.0/Project/delete',
    method: 'post',
    data
  })
}
// 项目详情
export function getProjectInfo(data) {
  return http({
    url: '/api/v2.0/Project/projectManage',
    method: 'post',
    data
  })
}
// 新增项目
export function getCreateProjectInfo(data) {
  return http({
    url: '/api/v2.0/Project/create',
    method: 'post',
    data
  })
}
// 提交项目
export function createProject(data) {
  return http({
    url: '/api/v2.0/Project/creatServer',
    method: 'post',
    data
  })
}
// 编辑提交
export function modifyProject(data) {
  return http({
    url: '/api/v2.0/Project/modifyServer',
    method: 'post',
    data
  })
}
// 获取模板信息
export function getTemplateInfo(data) {
  return http({
    url: '/api/v2.0/Project/getTempLate',
    method: 'post',
    data
  })
}
// 获取项目进度
export function getSchedule(data) {
  return http({
    url: '/api/v2.0/Project/getSchedule',
    method: 'post',
    data
  })
}
// 判断项目名称重复
export function checkProject(data) {
  return http({
    url: '/api/v2.0/Project/check',
    method: 'post',
    data
  })
}
