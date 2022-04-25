import request from '@/utils/request'
import constant from '@/api/constant'

// 获取图片列表
export function getPictureList(params) {
  return request({
    url: constant.getPictureList,
    method: 'post',
    data: params
  })
}

// 获取投放地区list
export function getPlacementArea() {
  return request({
    url: constant.getPlacementArea,
    method: 'get'
  })
}

// 获取投放渠道列表
export function getServedChannels() {
  return request({
    url: constant.getServedChannels,
    method: 'get'
  })
}

// 获取选择渠道list
export function getSelectChannel() {
  return request({
    url: constant.getSelectChannel,
    method: 'get'
  })
}

// 新增或编辑图片
export function addOrEditPicture(params) {
  return request({
    url: constant.addOrEditPicture,
    method: 'post',
    data: params
  })
}

// 删除图片
export function deletePicture(id) {
  return request({
    url: `${constant.deletePicture}?id=${id}`,
    method: 'delete'
  })
}

// 新增或发布文章
export function addOrEditArticle(data) {
  return request({
    url: constant.addOrEditArticle,
    method: 'post',
    data
  })
}

// 查询文章列表
export function getArticleList(data) {
  return request({
    url: constant.getArticleList,
    method: 'post',
    data
  })
}

// 删除文章
export function deleteArticle(id) {
  return request({
    url: `${constant.deleteArticle}?id=${id}`,
    method: 'delete'
  })
}
