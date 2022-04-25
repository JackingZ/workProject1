<template>
  <div class="editor-container">
    <!-- 表单部分 -->
    <el-form ref="articleForm" :inline="true" :model="formInfo" :rules="rules" class="form">
      <el-form-item label="文章标题：" prop="title">
        <el-input v-model="formInfo.title" size="small" placeholder="请输入"/>
      </el-form-item>
      <el-form-item label="所属渠道：" prop="channelCode">
        <el-select
          v-model="formInfo.channelCode"
          filterable
          clearable
          placeholder="所属渠道"
          class="search-item"
          style="width: 150px;"
          size="small"
        >
          <el-option
            v-for="item in channelList"
            :label="item.shortName"
            :key="item.code"
            :value="item.code"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="所属地区：" prop="areaCode">
        <el-select
          v-model="formInfo.areaCode"
          filterable
          multiple
          collapse-tags
          clearable
          placeholder="所属地区"
          class="search-item"
          style="width: 200px;"
          size="small"
        >
          <el-option v-for="item in areaList" :label="item.name" :key="item.id" :value="item.id" :disabled="item.disabled"/>
        </el-select>
      </el-form-item>
    </el-form>

    <!-- 编辑器部分 -->
    <div class="editor-wrap">
      <div class="editor-body">
        <div id="bar" class="bar"/>
        <div id="editor" class="editor"/>
      </div>
      <div ref="preview" class="preview"/>
    </div>

    <!-- 操作按钮 -->
    <div v-if="!isEdit || formInfo.status === 0" class="bottom-menu">
      <el-button size="small" @click="cancel">取消</el-button>
      <el-button type="primary" size="small" @click="save">存为草稿</el-button>
      <el-button type="primary" size="small" @click="submit">发布</el-button>
    </div>

    <div v-if="isEdit && formInfo.status === 1" class="bottom-menu">
      <el-button size="small" @click="cancel">取消</el-button>
      <el-button type="primary" size="small" @click="submit">保存</el-button>
    </div>
  </div>
</template>

<script>
import Editor from 'wangeditor'
import { getToken, getTokenType } from '@/utils/auth'
import {
  getServedChannels,
  getPlacementArea,
  addOrEditArticle
} from '@/api/graphic'
const handleAreaList = 'formInfo.areaCode'
export default {
  name: 'Editor',
  props: {
    isEdit: {
      type: Boolean,
      default: false
    },
    articleContent: {
      type: Object,
      default() {
        return {}
      }
    }
  },
  data() {
    return {
      isCancel: false,
      isSave: false,
      editor: {},
      formInfo: {
        title: '',
        areaCode: [],
        channelCode: '',
        article: '',
        modify: this.isEdit,
        id: undefined,
        status: 0
      },
      channelList: [],
      areaList: [{
        id: 'allAreaCode',
        name: '全部',
        disabled: false
      }],
      rules: {
        title: [
          { required: true, message: '请输入文章标题', trigger: 'blur' }
        ],
        channelCode: [
          { required: true, message: '请选择所属渠道', trigger: 'blur' }
        ],
        areaCode: [
          { required: true, message: '请选择所属地区', trigger: 'blur' }
        ]
      }
    }
  },
  computed: {
    token() {
      return `${getTokenType()} ${getToken()}`
    },
    uploadUrl() {
      return `${process.env.SERVER_URL}${
        process.env.API_ENV
      }/oauth/image-upload/up`
    }
  },
  watch: {
    [handleAreaList](newArr) {
      const index = newArr.findIndex(item => item === 'allAreaCode')
      if (index >= 0) {
        for (const item of this.areaList) {
          if (item.id === 'allAreaCode') {
            item.disabled = false
          } else {
            item.disabled = true
          }
        }
        this.areaCode = ['allAreaCode']
      } else {
        for (const item of this.areaList) {
          if (item.id === 'allAreaCode' && newArr.length) {
            item.disabled = true
          } else {
            item.disabled = false
          }
        }
      }
    }
  },
  created() {
    getServedChannels()
      .then(res => {
        const { data: channelList } = res
        this.channelList = channelList
        console.log(res)
      })
      .catch(err => {
        console.warn(err)
      })
    getPlacementArea()
      .then(res => {
        const { data: areaList } = res
        this.areaList = [...this.areaList, ...areaList]
        console.log(areaList)
      })
      .catch(err => {
        console.warn(err)
      })
  },
  mounted() {
    // 初始化编辑器
    const editor = new Editor('#bar', '#editor')
    editor.customConfig.zIndex = 9
    editor.customConfig.onchange = (html) => {
      console.log(html)
      this.isSave = false
      this.formInfo.article = html
      this.$refs.preview.innerHTML = html
    }
    editor.customConfig.menus = [
      'head', // 标题
      'bold', // 粗体
      'fontSize', // 字号
      'italic', // 斜体
      'foreColor', // 文字颜色
      'backColor', // 背景颜色
      'link', // 插入链接
      'justify', // 对齐方式
      'image' // 插入图片
    ]
    editor.customConfig.uploadImgServer = this.uploadUrl
    // 将图片大小限制为 3M
    editor.customConfig.uploadImgMaxSize = 3 * 1024 * 1024
    // 限制一次最多上传 2 张图片
    editor.customConfig.uploadImgMaxLength = 2
    editor.customConfig.uploadImgHeaders = {
      'Authorization': this.token
    }
    editor.customConfig.uploadFileName = 'file'
    editor.customConfig.customAlert = (info) => {
    // info 是需要提示的内容
      this.$message.error(info)
    }
    editor.customConfig.uploadImgHooks = {
      success(xhr, editor, result) {
        console.log('success', result)
      },
      fail(xhr, editor, result) {
        console.log('fail', result)
      },
      customInsert(insertImg, result, editor) {
        var url = result.url
        insertImg(url)
      }
    }
    editor.create()
    if (this.isEdit) {
      this.formInfo = { ...this.formInfo, ...this.articleContent }
      editor.txt.html(this.formInfo.article)
      console.log(this.formInfo)
    }
  },
  methods: {
    // 取消编辑文章
    async cancel() {
      if (this.isSave) {
        this.$emit('cancel')
        return
      }
      const [err, res] = await this.$confirm('文章未保存，请确认要关闭吗？', '提示', {
        distinguishCancelAndClose: true,
        confirmButtonText: '保存修改',
        cancelButtonText: '放弃编辑'
      })
        .then(res => {
          this.isCancel = false
          return [null, res]
        })
        .catch(err => {
          console.warn(err)
          if (err === 'cancel') {
            this.isCancel = true
          } else {
            this.isCancel = false
          }
          return [err, null]
        })
      console.log(err, res)
      if (err === 'cancel') {
        this.$emit('cancel')
      }
      if (res) {
        this.save()
        if (this.isCancel) {
          this.$emit('cancel')
        }
      }
    },
    // 保存文章
    save() {
      this.$refs.articleForm.validate(valid => {
        if (valid) {
          const params = {
            title: this.formInfo.title,
            areaCode: this.formInfo.areaCode.join(','),
            channelCode: this.formInfo.channelCode,
            article: this.formInfo.article,
            modify: this.formInfo.id ? true : this.isEdit,
            id: this.formInfo.id,
            status: this.formInfo.status
          }
          addOrEditArticle(params)
            .then(res => {
              this.isSave = true
              this.$message({
                type: 'success',
                message: '保存修改'
              })
              const { data: id } = res
              this.formInfo.id = id
              console.log(res)
            })
            .catch(err => {
              console.warn(err)
            })
        }
      })
    },
    // 发布文章
    submit() {
      this.$refs.articleForm.validate(valid => {
        if (valid) {
          const params = {
            title: this.formInfo.title,
            areaCode: this.formInfo.areaCode.join(','),
            channelCode: this.formInfo.channelCode,
            article: this.formInfo.article,
            modify: this.formInfo.id ? true : this.isEdit,
            id: this.formInfo.id,
            status: 1
          }
          addOrEditArticle(params)
            .then(res => {
              this.$emit('cancel')
              this.$message({
                type: 'success',
                message: '文章已发布'
              })
              console.log(res)
            })
            .catch(err => {
              console.warn(err)
            })
        }
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.editor-container {
  display: flex;
  flex-flow: column nowrap;
  min-width: 900px;
  position: relative;
  .form {
    display: flex;
    flex-flow: row nowrap;
    justify-content: space-around;
    z-index: 99;
    .el-form-item {
      margin-bottom: 15px!important;
    }
  }
  .editor-wrap {
    display: flex;
    flex-flow: row nowrap;
    justify-content: space-around;
    overflow: auto;
    align-items: center;
    .editor-body {
      width: calc(100% - 375px);
      flex: 0 0 auto;
      .bar {
        background-color: #e1e1e1;
      }
      .editor {
        height: 510px;
        border: 1px solid #e1e1e1;
        z-index: 9;
      }
    }
    .preview {
      width: 375px;
      height: 538px;
      border: 1px solid #e1e1e1;
      flex: 0 0 auto;
      background-color: #fcfaf2;
      overflow: auto;
    }
  }
  .bottom-menu {
    margin: 0 -20px;
    padding-top: 20px;
    // border-top: 1px solid #eee;
    display: flex;
    justify-content: center;
    .el-button {
      padding: 9px 25px;
    }
  }
}
</style>
