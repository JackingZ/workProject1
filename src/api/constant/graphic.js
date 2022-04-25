export default function(BASE_URL) {
  return {
    getPictureList: `${BASE_URL}/issue/picture/queryByPage`, // 获取图片列表
    getPlacementArea: `${BASE_URL}/issue/area/getPolicyAreas`, // 获取投放地区
    getServedChannels: `${BASE_URL}/issue/picture/channels`, // 获取投放渠道列表
    getSelectChannel: `${BASE_URL}/issue/crawler/sourceCode`, // 选择渠道list
    addOrEditPicture: `${BASE_URL}/issue/picture/edit`, // 新增或编辑图片
    deletePicture: `${BASE_URL}/issue/picture/delete`, // 删除图片
    addOrEditArticle: `${BASE_URL}/issue/article/edit`, // 新增或发布文章
    getArticleList: `${BASE_URL}/issue/article/queryByPage`, // 查询文章列表
    deleteArticle: `${BASE_URL}/issue/article/delete` // 删除文章
  }
}
