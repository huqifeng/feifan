import http from '@/libs/http'

// 项目版本列表
export function versionList(data) {
  return http({
    url: '/api/v2.0/projectVersion/getVersionList',
    method: 'post',
    data
  })
}

// 项目版本信息
export function versionInfo(data) {
  return http({
    url: '/api/v2.0/projectVersion/getVersionInfo',
    method: 'post',
    data
  })
}

// 新增项目版本信息
export function addVersion(data) {
  return http({
    url: '/api/v2.0/projectVersion/addVersion',
    method: 'post',
    data
  })
}

// 修改项目版本信息
export function updateVersion(data) {
  return http({
    url: '/api/v2.0/projectVersion/editVersion',
    method: 'post',
    data
  })
}

// 删除项目版本信息
export function deleteVersion(data) {
  return http({
    url: '/api/v2.0/projectVersion/delVersion',
    method: 'post',
    data
  })
}

// 项目版本关联的任务列表
export function versionTaskList(data) {
  return http({
    url: '/api/v2.0/projectVersion/getDetail',
    method: 'post',
    data
  })
}
