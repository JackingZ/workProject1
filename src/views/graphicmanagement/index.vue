<template>
  <div class="app-container">
    <div v-show="!isEditorShow" class="graphic-management">
      <el-menu :default-active="activeIndex" mode="horizontal" @select="handleSelect">
        <el-menu-item v-permission="permissionList.graphicManagement" index="1" style="font-size: 16px;">图片管理</el-menu-item>
        <el-menu-item v-permission="permissionList.articleManagement" index="2" style="font-size: 16px;">文章管理</el-menu-item>
      </el-menu>
      <!-- 图片管理 -->
      <div v-show="togglePanel" style="padding: 20px;">
        <!-- 查询条件 -->
        <div class="query_bar">
          <el-button
            v-permission="permissionList.graphicManageInsert"
            type="text"
            icon="el-icon-circle-plus-outline"
            style="position: absolute;left: 0;top: 0;"
            @click="addPicture()"
          >新增图片</el-button>
          <el-select
            v-model="searchValue.channelCode"
            filterable
            clearable
            placeholder="投放渠道"
            class="search-item"
            style="width: 150px;"
            size="small"
            @focus="getServedChannels"
          >
            <el-option
              v-for="item in channelList"
              :label="item.shortName"
              :key="item.code"
              :value="item.code"
            />
          </el-select>
          <el-select
            v-model="searchValue.areaCode"
            filterable
            clearable
            placeholder="投放地区"
            class="search-item"
            style="width: 150px;"
            size="small"
            @focus="getPlacementArea"
          >
            <el-option v-for="item in areaList" :label="item.name" :key="item.id" :value="item.id"/>
          </el-select>
          <el-select
            v-model="searchValue.status"
            filterable
            clearable
            placeholder="启用状态"
            class="search-item"
            style="width: 150px;"
            size="small"
          >
            <el-option
              v-for="item in statusList"
              :label="item.value"
              :key="item.key"
              :value="item.key"
            />
          </el-select>
          <el-input
            v-model="searchValue.keyWord"
            class="search-item"
            placeholder="请输入图片名称或图片ID"
            size="small"
          >
            <el-select slot="prepend" v-model="searchValue.key">
              <el-option :value="1" label="图片名称"/>
              <el-option :value="2" label="图片ID"/>
            </el-select>
          </el-input>
          <el-button
            type="primary"
            icon="el-icon-search"
            class="search-item"
            size="small"
            @click="getPictureList"
          >查询</el-button>
          <el-button icon="el-icon-menu" class="search-item" size="small" @click="handleFilter">筛选</el-button>
        </div>

        <!-- 图片列表 -->
        <el-table
          v-loading="pictureListLoading"
          :data="pictureList"
          :cell-style="{padding: '4px 0'}"
          :header-cell-style="{background:'#fafafa',padding: '8px 0'}"
          height="calc(100vh - 320px)"
          border
          style="width: 100%;"
        >
          <el-table-column :resizable="false" prop="id" label="图片ID" fixed="left" width="100"/>
          <el-table-column
            :resizable="false"
            prop="picName"
            label="图片名称"
            fixed="left"
            min-width="230"
          />
          <el-table-column :resizable="false" prop="picUrl" label="图片缩略图" min-width="100">
            <template slot-scope="scope">
              <img
                :src="scope.row.picUrl"
                style="width: 80px;height: 40px;cursor: pointer;"
                @click="preview(scope.row)"
              >
            </template>
          </el-table-column>
          <el-table-column :resizable="false" prop="channelName" label="投放渠道" min-width="120"/>
          <el-table-column :resizable="false" :formatter="formatterArea" label="投放地区" width="120">
            <template slot-scope="scope">
              <el-popover trigger="hover" placement="top">
                <div class="pop">
                  <p v-for="(item, index) in scope.row.areaCodeNames" :key="index" style="padding: 0 10px;">{{ item }}</p>
                </div>
                <div slot="reference">
                  <p >{{ formatterArea(scope.row) }}</p>
                </div>
              </el-popover>
            </template>
          </el-table-column>
          <el-table-column
            :resizable="false"
            :formatter="formatterTime"
            label="起止时间"
            min-width="200"
          />
          <el-table-column
            :resizable="false"
            :formatter="formatterStatus"
            label="启用状态"
            min-width="80"
          />
          <el-table-column :resizable="false" prop="sorted" label="排序" width="80"/>
          <el-table-column :resizable="false" prop="createTime" label="添加时间" width="180"/>
          <el-table-column :resizable="false" label="操作" fixed="right" min-width="180">
            <template slot-scope="scope">
              <el-button
                type="text"
                size="small"
                style="font-size: 14px;"
                @click="preview(scope.row)"
              >预览</el-button>
              <el-button
                v-permission="permissionList.graphicManageEdit"
                type="text"
                size="small"
                style="font-size: 14px;"
                @click="handleEdit(scope.row)"
              >编辑</el-button>
              <el-button
                v-permission="permissionList.graphicManageDelete"
                type="text"
                size="small"
                style="font-size: 14px;"
                @click="handleDelete(scope.row)"
              >删除</el-button>
            </template>
          </el-table-column>
        </el-table>
        <div style="height: 50px;padding-top: 20px;">
          <el-pagination
            :current-page="picturePage"
            :page-sizes="[10, 20, 30, 40, 50]"
            :page-size="pictureSize"
            :total="pictureTotal"
            layout="total, sizes, prev, pager, next, jumper"
            background
            style="text-align: right;"
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
          />
        </div>
      </div>
      <!-- 文章管理 -->
      <div v-show="!togglePanel" style="padding: 20px;overflow: hidden;">
        <!-- 查询条件 -->
        <div class="query_bar">
          <el-button
            v-permission="permissionList.articleManageInsert"
            type="text"
            icon="el-icon-circle-plus-outline"
            style="position: absolute;left: 0;top: 0;"
            @click="addArticle()"
          >新增文章</el-button>

          <el-select
            v-model="articleSearchValue.status"
            filterable
            clearable
            placeholder="选择状态"
            class="search-item"
            style="width: 150px;"
            size="small"
          >
            <el-option
              v-for="item in articleStatusList"
              :label="item.value"
              :key="item.key"
              :value="item.key"
            />
          </el-select>

          <el-date-picker
            v-model="articleSearchValue.date"
            size="small"
            class="search-item"
            style="width: 370px;"
            type="daterange"
            range-separator="至"
            start-placeholder="起始时间"
            end-placeholder="过期时间"
            format="yyyy 年 MM 月 dd 日"
            value-format="yyyy-MM-dd"
          />

          <el-input
            v-model="articleSearchValue.keyWord"
            class="search-item"
            placeholder="请输入文章标题或文章ID"
            size="small"
          >
            <el-select slot="prepend" v-model="articleSearchValue.keyType">
              <el-option label="文章标题" value="1"/>
              <el-option label="文章ID" value="2"/>
            </el-select>
          </el-input>
          <el-button
            type="primary"
            icon="el-icon-search"
            class="search-item"
            size="small"
            @click="getArticleList"
          >查询</el-button>
        </div>

        <el-table
          v-loading="articleLoading"
          :data="articleList"
          :cell-style="{padding: '0'}"
          :header-cell-style="{background:'#fafafa',padding: '8px 0'}"
          border
          style="width: 100%;"
          height="calc(100vh - 320px)"
          tooltip-effect="dark"
        >
          <el-table-column fixed="left" prop="id" label="ID" width="80"/>
          <el-table-column fixed="left" prop="title" label="文章标题" min-width="250"/>
          <el-table-column prop="channelCodeName" label="所属渠道" min-width="120"/>
          <el-table-column :resizable="false" :formatter="formatterArea" label="投放地区" width="120">
            <template slot-scope="scope">
              <el-popover trigger="hover" placement="top">
                <div class="pop">
                  <p v-for="(item, index) in scope.row.areaCodeNames" :key="index" style="padding: 0 10px;">{{ item }}</p>
                </div>
                <div slot="reference">
                  <p>{{ formatterArea(scope.row) }}</p>
                </div>
              </el-popover>
            </template>
          </el-table-column>
          <el-table-column prop="userName" label="操作人" min-width="120"/>
          <el-table-column prop="updateTime" label="最后更新" min-width="200"/>
          <el-table-column
            :formatter="formatterArticleStatus"
            prop="status"
            label="状态"
            width="120"
          />
          <el-table-column fixed="right" label="操作" min-width="250">
            <template slot-scope="scope">
              <el-button
                type="text"
                size="small"
                style="font-size: 14px;"
                @click="copyArticleLink(scope.row)"
              >复制链接</el-button>
              <el-button
                v-permission="permissionList.articleManageEdit"
                type="text"
                size="small"
                style="font-size: 14px;"
                @click="editArticle(scope.row)"
              >编辑</el-button>
              <el-button
                v-permission="permissionList.graphicManageDelete"
                type="text"
                size="small"
                style="font-size: 14px;"
                @click="deleteArticle(scope.row)"
              >删除</el-button>
            </template>
          </el-table-column>
        </el-table>
        <div style="height: 50px;padding-top: 20px;">
          <el-pagination
            :current-page="articlePage"
            :page-sizes="[10, 20, 30, 40, 50]"
            :page-size="articleSize"
            :total="articleTotal"
            style="text-align: right;"
            background
            layout="total, sizes, prev, pager, next, jumper"
            @size-change="getSizeChange"
            @current-change="getCurrentChange"
          />
        </div>
      </div>
    </div>

    <div v-if="isEditorShow" class="graphic-management">
      <head-info :title="isArticleEdit ? '编辑文章' : '新增文章'" info/>
      <div class="app-panel">
        <app-editor ref="addEditArticle" :article-content="articleContent" :is-edit="isArticleEdit" @cancel="editorCancel"/>
      </div>
    </div>

    <!-- 图片筛选 -->
    <app-drawer
      :is-show="isSearchDrawerShow"
      :mask-closable="false"
      no-button
      drawer-title="图片筛选"
      drawer-style="width: 500px;"
      @drawerClose="closeFilter"
      @drawerConfirm="confirmFilter"
    >
      <graphic-filter :search-value="searchValue" @reset="reset" @screen="getPictureList"/>
    </app-drawer>
    <!-- 新增编辑图片 -->
    <app-drawer
      :is-show="isAddOrEditDrawerShow"
      :mask-closable="false"
      :drawer-title="isPictureEdit ? '编辑图片' : '新增图片'"
      drawer-style="width: 500px;"
      @drawerClose="closePictureEdit"
      @drawerConfirm="confirmPictureEdit"
    >
      <add-edit-picture ref="addEditPictureForm"/>
    </app-drawer>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
// import dayjs from 'dayjs'
import MyProgress from '@/components/MyProgress'
import appDrawer from '@/components/Drawer/drawer'
import {
  getPictureList,
  getPlacementArea,
  getServedChannels,
  addOrEditPicture,
  deletePicture,
  getArticleList,
  deleteArticle
} from '@/api/graphic'
import AddEditPicture from './components/addEditPicture.vue'
import AppEditor from './components/editor.vue'
import GraphicFilter from './components/graphicFilter.vue'
export default {
  name: 'GraphicManagement',
  inject: ['reload'],
  components: {
    MyProgress,
    appDrawer,
    AddEditPicture,
    AppEditor,
    GraphicFilter
  },
  data() {
    return {
      activeIndex: '1',
      isEditorShow: false, // 是否打开富文本编辑器
      articleContent: {}, // 文章内容
      togglePanel: true,
      isSearchDrawerShow: false, // 图片编辑筛选窗口
      isAddOrEditDrawerShow: false, // 图片管理新增或编辑窗口
      isPictureEdit: false, // 图片管理是否编辑状态,
      isArticleEdit: false,
      channelList: [],
      areaList: [{
        id: 'allAreaCode',
        name: '全部'
      }],
      statusList: [
        { key: 1, value: '未生效' },
        { key: 2, value: '已生效' },
        { key: 0, value: '已禁用' }
      ],
      articleStatusList: [
        { key: 1, value: '已发布' },
        { key: 0, value: '待修改' }
      ],
      selectDate: [],
      selectValue: '',
      selectInput: '',
      pictureListLoading: false,
      articleLoading: false,
      pictureList: [
      ],
      articleList: [
      ],
      searchValue: {
        channelCode: '',
        key: 1,
        keyWord: '',
        areaCode: '',
        status: undefined,
        hasLinkUrl: undefined,
        createTimeList: [],
        startTimeList: [],
        endTimeList: []
      },
      articleSearchValue: {
        status: undefined,
        keyType: '1',
        keyWord: '',
        date: []
      },
      picturePage: 1,
      pictureSize: 20,
      pictureTotal: 0,
      articlePage: 1,
      articleSize: 20,
      articleTotal: 0
    }
  },
  computed: {
    ...mapGetters([
      'isAnyAdminChannel' // 判断登陆用户是否是管理员渠道
    ])
  },
  created() {
    const permissionList = this.$store.state.user.permissions
    const isGrap = permissionList.some(item => {
      return this.permissionList.graphicManagement === item
    })
    if (!isGrap) {
      console.log('文章管理')
      this.handleSelect(2)
    }
    this.getPictureList()
  },
  methods: {
    // 获取图片列表
    getPictureList() {
      this.pictureListLoading = true
      getPictureList({
        page: this.picturePage,
        size: this.pictureSize,
        model: this.searchValue
      })
        .then(res => {
          this.pictureListLoading = false
          const { data } = res
          this.pictureList = data.model
          this.pictureTotal = data.count
          console.log(res)
          this.closeFilter()
        })
        .catch(err => {
          console.warn(err)
        })
    },
    // 筛选图片
    handleFilter() {
      this.isSearchDrawerShow = true
    },
    // 关闭图片筛选
    closeFilter() {
      this.isSearchDrawerShow = false
    },
    // 重置筛选条件
    reset() {
      this.searchValue = {
        channelCode: '',
        key: 1,
        keyWord: '',
        areaCode: '',
        status: undefined,
        hasLinkUrl: undefined,
        createTimeList: [],
        startTimeList: [],
        endTimeList: []
      }
      this.closeFilter()
      this.getPictureList()
    },
    // 图片筛选确认
    confirmFilter() {
      this.closeFilter()
    },
    // 获取投放地区列表
    getPlacementArea() {
      if (this.areaList.length === 1) {
        getPlacementArea()
          .then(res => {
            const { data: areaList } = res
            this.areaList = [...this.areaList, ...areaList]
            console.log(areaList)
          })
          .catch(err => {
            console.warn(err)
          })
      }
    },
    // 获取投放渠道
    getServedChannels() {
      if (!this.channelList.length) {
        getServedChannels()
          .then(res => {
            const { data: channelList } = res
            this.channelList = channelList
            console.log(res)
          })
          .catch(err => {
            console.warn(err)
          })
      }
    },
    // 新增图片
    addPicture() {
      this.isPictureEdit = false
      this.isAddOrEditDrawerShow = true
      console.log('addPicture')
    },
    // 预览图片
    preview(row) {
      this.$imageview.show({
        title: row.picName,
        url: row.picUrl
      })
    },
    // 编辑图片
    handleEdit(row) {
      this.$refs.addEditPictureForm.fileList = [{
        name: row.picName,
        url: row.picUrl
      }]
      console.log(this.$refs.addEditPictureForm)
      this.$refs.addEditPictureForm.pictureInfo = {
        id: row.id,
        picName: row.picName,
        picUrl: row.picUrl,
        serving: row.serving,
        areaCode: row.areaCode.split(','),
        status: row.status,
        date: [row.startTime, row.endTime],
        sorted: row.sorted,
        linkUrl: row.linkUrl,
        channelCode: row.channelCode,
        checkAll: row.allAreaCode === 1
      }
      this.isPictureEdit = true
      this.isAddOrEditDrawerShow = true
      console.log(row)
    },
    // 删除图片
    async handleDelete(row) {
      const result = await this.$confirm('删除将无法恢复, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).catch(err => { console.warn(err) })
      if (result === 'confirm') {
        deletePicture(row.id)
          .then(res => {
            console.log(res)
            this.$message({
              message: '删除成功',
              type: 'success'
            })
            this.getPictureList()
          })
          .catch(err => {
            this.$message.error('删除失败')
            console.warn(err)
          })
      }
      console.log(row)
    },
    // 格式化起止时间
    formatterTime(row) {
      return `${row.startTime}~${row.endTime}`
    },
    // 格式化投放地区
    formatterArea(row) {
      let area = ''
      const areaCodeNames = row.areaCodeNames
      if (areaCodeNames.length === 1) {
        area = areaCodeNames[0]
      }
      if (areaCodeNames.length > 1) {
        area = `多地区(${areaCodeNames.length})`
      }
      return area
    },
    // 格式化图片状态
    formatterStatus(row) {
      switch (row.status) {
        case 0:
          return '已禁用'
        case 1:
          return '正常'
        default:
          return '--'
      }
    },
    // 格式化文章状态
    formatterArticleStatus(row) {
      switch (row.status) {
        case 0:
          return '待修改'
        case 1:
          return '已发布'
        default:
          return '--'
      }
    },
    // 关闭新增或编辑图片窗口
    closePictureEdit() {
      this.isAddOrEditDrawerShow = false
      if (this.isPictureEdit) {
        this.$refs.addEditPictureForm.reset()
      }
    },
    // 提交新增或编辑窗口
    confirmPictureEdit() {
      const pictureForm = this.$refs.addEditPictureForm.$refs
        .addEditPictureFormList
      console.log(this.$refs.addEditPictureForm)
      pictureForm.validate(valid => {
        if (valid) {
          this.$refs.addEditPictureForm.loading = true
          this.$refs.addEditPictureForm.pictureInfo.areaCode = this.$refs.addEditPictureForm.pictureInfo.areaCode.join(',')
          this.$refs.addEditPictureForm.pictureInfo.modify = this.isPictureEdit
          addOrEditPicture(this.$refs.addEditPictureForm.pictureInfo)
            .then(res => {
              this.$refs.addEditPictureForm.loading = false
              this.closePictureEdit()
              console.log(res)
              this.$message({
                message: '新增图片成功',
                type: 'success'
              })
              this.$refs.addEditPictureForm.reset()
              this.getPictureList()
            })
            .catch(err => {
              this.$message.error('新增图片失败')
              console.warn(err)
            })
        }
      })
    },
    // 查询文章列表
    getArticleList() {
      this.articleLoading = true
      const value = this.articleSearchValue
      getArticleList({
        page: this.articlePage,
        size: this.articleSize,
        model: {
          status: value.status,
          times: value.date,
          key: value.keyType,
          keyWord: value.keyWord
        }
      })
        .then(res => {
          this.articleLoading = false
          console.log(res.data.model)
          this.articleList = res.data.model
          this.articleTotal = res.data.count
        })
        .catch(err => {
          console.warn(err)
        })
    },
    // 新增文章
    addArticle() {
      this.isArticleEdit = false
      this.isEditorShow = true
    },
    // 生成移动端落地页链接
    getArticleUrl(id) {
      const venv = process.env.BUILD_VER
      switch (venv) {
        case 'test':
          return `https://ybinsure.com/spa/newManagerTest/article-page?id=${id}`
        case 'test2':
          return `https://ybinsure.com/spa/newManagerTest2/article-page?id=${id}`
        default:
          return `https://ybinsure.com/spa/newManager/article-page?id=${id}`
      }
    },
    // 复制文章链接
    copyArticleLink(row) {
      if (row.status !== 1) {
        this.$message.error('文章未发布，请先发布文章')
        return
      }
      const input = document.createElement('input')
      input.setAttribute('readonly', 'readonly')
      input.setAttribute('value', this.getArticleUrl(row.id))
      document.body.appendChild(input)
      input.setSelectionRange(0, 9999)
      input.select()
      if (document.execCommand('copy')) {
        document.execCommand('copy')
        this.$message({
          message: '复制成功',
          type: 'success'
        })
      }
      document.body.removeChild(input)
      console.log('copy article link')
    },
    // 编辑文章
    editArticle(row) {
      this.isArticleEdit = true
      this.isEditorShow = true
      this.articleContent = {
        areaCode: row.areaCodeList,
        article: row.article,
        channelCode: row.channelCode,
        title: row.title,
        modify: this.isArticleEdit,
        id: row.id,
        status: row.status
      }
    },
    // 删除文章
    async deleteArticle(row) {
      const result = await this.$confirm('删除将无法恢复, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).catch(err => { console.warn(err) })
      if (result === 'confirm') {
        deleteArticle(row.id)
          .then(res => {
            console.log(res)
            this.$message({
              message: '删除成功',
              type: 'success'
            })
            this.getArticleList()
          })
          .catch(err => {
            console.warn(err)
            this.$message.error('删除失败')
          })
      }
    },
    editorCancel() {
      this.isEditorShow = false
      this.getArticleList()
      console.log('取消文章编辑')
    },
    handleSizeChange(val) {
      this.pictureSize = val
      this.getPictureList()
    },
    handleCurrentChange(val) {
      this.picturePage = val
      this.getPictureList()
    },
    // menu菜单切换
    handleSelect(key) {
      if (key === '1') {
        this.togglePanel = true
      } else if (key === '2') {
        this.getArticleList()
        this.togglePanel = false
      }
    },
    getSizeChange(val) {
      this.articleSize = val
      this.getArticleList()
    },
    getCurrentChange(val) {
      this.articlePage = val
      this.getArticleList()
    }
  }
}
</script>

<style lang="scss">
  .pop {
    display: flex;
    flex-flow: row wrap;
    width: 300px;
  }
</style>
<style lang="scss">
.graphic-management {
  background-color: #fff;
  .query_bar {
    display: flex;
    flex-flow: row wrap;
    align-items: center;
    justify-content: flex-end;
    position: relative;
    margin-bottom: 10px;
  }
  .search-item {
    vertical-align: top;
    margin: 0px 0px 10px 7px;
  }
  .search-time {
    width: 100px;
    margin-left: 7px;
    margin-right: -4px;
    .el-input__inner {
      background-color: #f5f7fa;
      color: #909399;
      border-right: 0px;
      border-radius: 4px 0px 0px 4px;
    }
  }
  .search-date {
    border-left: 0px;
    border-radius: 0px 4px 4px 0px;
    width: 250px;
    .el-range-input {
      width: 50%;
    }
  }
  .el-input-group--prepend {
    max-width: 280px;
    .el-input-group__prepend {
      width: 100px;
    }
  }
  .table-data {
    .progress-color {
      .el-progress-bar {
        .el-progress-bar__outer {
          background-color: #ccc;
        }
      }
    }
  }
}
</style>
