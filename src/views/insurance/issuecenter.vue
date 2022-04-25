<template>
  <!-- eslint-disable -->
  <div class="app-container">
    <div class="app-panel">
      <div style="height:40px;line-height:40px;margin-bottom: 10px;border-bottom:1px solid #eee;">
        <div style="float: left;">
          <span style="margin-right: 20px;">电脑出单</span>
          <span style="font-size: 12px;color: #999;">登录各大保险公司核心系统出单，如需新增保险公司/出单工号，请联系上级管理员添加</span>
        </div>
        <div style="float: right;">
          <div v-if="!isWeb && !isAnyAdminChannel">
            <span style="font-size: 14px;margin-right: 10px;">是否使用本地VPN网络</span>
            <my-switch v-model="isSwitch" :active-value="true" :inactive-value="false" enableText="是" disableText="否" @input="clickSwitch" />
          </div>
        </div>
      </div>

      <div v-if="isWeb" class="issue-title">
        <div style="background-color: #e8f4ff;padding: 8px 16px;font-size: 14px;line-height: 30px;">
          <svg-icon icon-class="gantan" />
          <span>电脑出单需在悦保出单系统内打开方可正常运行，点击下载最新安装文件：</span>
          <span style="color: #0000ff;cursor: pointer;" @click="downLoad">悦保车险云平台</span>
        </div>
      </div>

      <div v-if="!isWeb" v-loading="isLoading" class="issue-center">
        <el-card :body-style="{ padding: '0px' }" v-for="(item, index) in insureCompanyRender" :key="index" shadow="hover">
          <div style="text-align: center;" @click.stop="insureList(item)">
            <div class="issue-img">
              <img :src="getItemLogo(item.logo)" alt="" style="width: 100%;margin-top: 15px;">
            </div>
            <div class="issue-name">
              <!-- <span class="issue-word">{{ getDesc(item) }}</span> -->
              <span v-if="item.plugin" class="issue-download" @click.stop="insureOpen(item)">下载<i class="el-icon-download" style="font-size: 14px;font-weight: bold;" /></span>
            </div>
          </div>
        </el-card>
      </div>
    </div>
    <el-dialog class="issue-dialog" :title="insureTitle" :visible.sync="dialogVisible" width="40%">
      <div style="margin-bottom: 20px;background-color: #e8f4ff;padding: 8px 16px;font-size: 12px;">
        <svg-icon icon-class="gantan" />
        <span style="line-height: 20px;">为了获得良好的操作体验，请先下载相关插件安装完毕后重新访问。如已安装请忽略</span>
      </div>
      <div v-for="(item, index) in fileData" :key="index" style="padding: 8px 16px;">
        <span>{{ item.id + '、' + item.pluginName }}</span>
        <span style="float: right;color: #409eff;border-bottom: 1px solid #409eff;cursor: pointer;" @click="fileDownload(item.pluginUrl)">立即下载</span>
      </div>
    </el-dialog>

    <el-dialog class="issue-dialog" :title="insureName" :visible.sync="dialogListVisible" width="35%">
      <div style="text-align: right;">
        <el-select v-if="isAnyAdminChannel" :loading="channelData.loading" v-model="searchForm.userSourceCode" clearable filterable placeholder="全部渠道" style="width: 200px;margin-right: 5px;" size="small" @focus="getChannelData">
          <el-option v-for="item in channelData.data" :label="item.shortName" :key="item.code" :value="item.code" />
        </el-select>
        <el-select v-if="isAnyAdminChannel" :loading="areaData.loading" v-model="searchForm.areaCode" clearable filterable placeholder="全部地区" style="width: 130px;margin: 5px 5px 0 0;" size="small" @focus="getAreaData">
          <el-option v-for="item in areaData.data" :key="item.id" :label="item.name" :value="item.id" />
        </el-select>
        <el-input v-model="searchForm.jobNumber" size="small" style="width: 180px;margin: 5px 5px 0 0;" placeholder="工号账号" prefix-icon="el-icon-search" />
        <el-button type="primary" size="small" style="padding: 9px 25px;margin: 5px 0px;" @click="searchData">查询</el-button>
      </div>
      <div v-for="(item, index) in listOption.render" :key="index" class="insure-number">
        <span>{{ item.insureChannelName }}</span>
        <span style="float: right;color: #409eff;cursor: pointer;" @click="urlService.open(item.url, true, item.id)">立即访问</span>
      </div>
    </el-dialog>
  </div>
</template>

<script>
/* eslint-disable */
import request from '@/utils/request'
import constant from '@/api/constant'
import { getBaseUrl } from '@/router/index'
import { getPolicyAreasData, getCompanysData } from '@/api/badgenum'
import applicationStorageService from '@/views/insurance/service/application-storage.service'
import {
  getProperty,
  IssuePropertyTypeCodeEnum
} from '@/views/insurance/service/issue-property.service'
import browserCompatibilityService from '@/views/insurance/service/browser-compatibility.service'
import injectInfoService from '@/views/insurance/service/inject-info.service'
import proxyInfoService, {
  queryByToken
} from '@/views/insurance/service/proxy-info.service'
import urlService from '@/views/insurance/service/url.service'
import { mapGetters } from 'vuex'
import { channelEffective } from '@/api/system'
export default {
  name: 'Issuecenter',
  data() {
    return {
      insureCompanyChannels: [],
      insureCompanyProperty: [],
      insureCompanyRender: [],
      companyTypes: [], // 保险公司分类
      allAreas: [], // 地区数据
      allInsure: [], // 保险公司数据
      isWeb: true, // 为普通浏览器,
      isSwitch: false,
      urlService,
      name: null,
      channelData: {
        loading: false,
        data: []
      },
      areaData: {
        loading: false,
        data: []
      },
      isLoading: false,
      dialogVisible: false,
      dialogListVisible: false,
      insureTitle: '',
      insureName: '',
      fileData: [],
      listOption: {
        data: [],
        render: []
      },
      searchForm: {
        userSourceCode: '',
        areaCode: '',
        jobNumber: ''
      }
    }
  },
  computed: {
    ...mapGetters([
      'isAnyAdminChannel' // 判断登陆用户是否管理员渠道
    ])
  },
  async created() {
    this.init()
  },
  methods: {
    // 获取渠道
    getChannelData() {
      this.channelData.loading = true
      channelEffective()
        .then(res => {
          this.channelData.data = res.data
          this.channelData.loading = false
        })
        .catch(err => {
          console.warn(err)
          this.channelData.loading = false
        })
    },
    // 获取地区
    getAreaData() {
      this.areaData.loading = true
      getPolicyAreasData()
        .then(res => {
          this.areaData.data = res.data
          this.areaData.loading = false
        })
        .catch(err => {
          console.warn(err)
          this.areaData.loading = false
        })
    },
    // 查询
    searchData() {
      this.listOption.render = this.listOption.data
      const res = this.filterData(
        this.searchForm,
        this.listOption.render
      )
      this.listOption.render = res
    },
    // 过滤
    filterData(form, data) {
      for (const key in form) {
        if (form[key] === '') {
          delete form[key]
        }
      }
      return data.filter(item => {
        return Object.keys(form).every(key => {
          return String(item[key]).toLowerCase() === String(form[key]).trim().toLowerCase()
        })
      })
    },
    // 下载
    downLoad() {
      // 'http://www.ybinsure.com/static/update/201/browser/YBBrowser_Latest.zip'
      const url = 'http://www.ybinsure.com/static/update/201/browser/index.html'
      window.open(url)
    },
    // 工号列表
    insureList(item) {
      this.dialogListVisible = true
      this.searchForm.userSourceCode = ''
      this.searchForm.areaCode = ''
      this.searchForm.jobNumber = ''
      this.insureName = item.insureChannelName.split('-')[0] + '工号'
      const arr = JSON.parse(JSON.stringify(item.info))
      if (this.isAnyAdminChannel) {
        this.listOption.data = arr
        this.listOption.render = this.listOption.data
      } else {
        this.listOption.data = arr.filter(item => {
          return item.userSourceCode === this.$store.getters.userAll.data.channelCode
        })
        this.listOption.render = this.listOption.data
      }
    },
    // 控件列表
    insureOpen(item) {
      this.dialogVisible = true
      this.insureTitle = item.insureChannelName.split('-')[0] + '插件下载'
      this.fileData = item.plugins
    },
    fileDownload(url) {
      window.c_fun_set_str('GetJsonParam', 'n4aYXtmchFscmZ')
      window.open(url)
    },
    // 跳转
    openUrl(item) {
      window.open(item.url)
    },
    /**
     * 设置全局是否使用代理
     * window.c_fun_set_str(key)
     * key为：UseYBProxy
     * 返回值: 1表示使用悦保代理，0表示不使用悦保代理
     */
    clickSwitch() {
      const hasFunction = !!window.c_fun_get_str
      if (this.isSwitch) {
        if (!this.isWeb) {
          if (hasFunction) {
            window.c_fun_set_str('UseYBProxy', '0')
          }
        }
      } else {
        if (!this.isWeb) {
          if (hasFunction) {
            window.c_fun_set_str('UseYBProxy', '1')
          }
        }
      }
    },
    async init() {
      this.isLoading = true
      if (applicationStorageService.isApplication()) {
        // 为自主浏览器
        this.isWeb = false
      } else {
        this.isWeb = true
      }
      getPolicyAreasData().then(res => (this.allAreas = res.data))
      getCompanysData().then(res => (this.allInsure = res.data))
      browserCompatibilityService.initCompatibilityFunc()
      browserCompatibilityService.initbrowserInjectPacFunc()
      injectInfoService.initGetInjectInfoFunc()
      injectInfoService.initGetInjectInfoInIframFunc()
      const issueD = await proxyInfoService.initGetJsonFunc()
      this.insureCompanyProperty = issueD.insureCompany
      this.insureCompanyChannels = issueD.insureToken
      this.getGlobalProxySwitch()
      this.setLogo()
      // Promise.all([
      //   getProperty(IssuePropertyTypeCodeEnum.insureCompanySource).then(
      //     res => res.data
      //   ),
      //   queryByToken().then(res => res.data)
      // ]).then(res => {
      //   const [properties, insureCompanyChannels] = res
      //   this.insureCompanyProperty = properties
      //   this.insureCompanyChannels = insureCompanyChannels
      //   this.setLogo()
      // })
    },
    // 保险公司分类
    queryCompanyTypes() {
      getProperty(IssuePropertyTypeCodeEnum.insureCompanySource).then(
        res => (this.companyTypes = res.data)
      )
    },
    /**
     * window.c_fun_get_str(key)
     * key为：UseYBProxy
     * 返回值: 1表示使用悦保代理，0表示不使用悦保代理
     * 获取全局是否使用代理
     */
    getGlobalProxySwitch() {
      if (!this.isWeb) {
        const hasFunction = !!window.c_fun_get_str
        if (hasFunction) {
          const reponse = window.c_fun_get_str('UseYBProxy')
          if (parseInt(reponse) === 0) {
            this.isSwitch = true
          } else if (parseInt(reponse) === 1) {
            this.isSwitch = false
          }
        }
      }
    },
    /**
     * 设置渠道和logo图片
     */
    setLogo() {
      this.insureCompanyChannels.forEach(channel => {
        this.insureCompanyProperty.forEach(property => {
          if (channel['companyId'] === property.code) {
            channel.logo = property.extend2
          }
        })
      })
      const res = this.setCompanyIdMerger(this.insureCompanyChannels)
      this.insureCompanyRender = res
      this.isLoading = false
    },
    // 合并保险公司工号
    setCompanyIdMerger(arr) {
      const list = []
      arr.forEach(el => {
        for (var i = 0; i < list.length; i++) {
          if (list[i].companyId == el.companyId) {
            list[i].info.push(el)
            return
          }
        }
        list.push({
          insureChannelName: el.insureChannelName,
          companyId: el.companyId,
          logo: el.logo,
          plugin: el.plugin,
          plugins: el.plugins,
          info: [el]
        })
      })
      return list
    },
    getDesc(channel) {
      // console.log(channel)
      let desc = ''
      for (let i = 0; i < this.companyTypes.length; i++) {
        let com = this.companyTypes[i]
        if (channel['companyId'] == com['code']) {
          desc += com['text']
        }
      }
      for (let i = 0; i < this.allAreas.length; i++) {
        let area = this.allAreas[i]
        if (area['id'] == channel['provinceCode']) {
          desc += area['name']
        }
      }
      desc += '-'
      desc += channel['jobNumber']
      if (
        channel['insureChannelName'] != null &&
        channel['insureChannelName'] != ''
      ) {
        desc = channel['insureChannelName']
      }
      let n = this.getByteLen(desc)
      if (n > 25) {
        desc = desc.slice(0, 20)
        desc += '...'
      }
      return desc
    },
    // 获取字符串长度（汉字算两个字符，字母数字算一个）
    getByteLen(val) {
      var len = 0
      for (var i = 0; i < val.length; i++) {
        var a = val.charAt(i)
        if (a.match(/[^\x00-\xff]/gi) != null) {
          len += 2
        } else {
          len += 1
        }
      }
      return len
    },
    getItemLogo(src) {
      if (!src) return null
      const baseUrl =
        process.env.NODE_ENV !== 'production' ? '/' : '/' + getBaseUrl()
      return src.replace(/.\/assets/, `${baseUrl}static`)
    }
  }
}
</script>

<style lang="scss">
.issue-title {
  height: calc(100vh - 210px);
}
.issue-center {
  height: calc(100vh - 245px);
  width: 100%;
  overflow-y: auto;
  .el-card {
    width: 250px;
    height: 200px;
    float: left;
    margin: 10px 20px 10px 0;
    cursor: pointer;
  }
  .issue-img {
    width: 200px;
    height: 170px;
    display: inline-block;
  }
  .issue-name {
    height: 30px;
    line-height: 30px;
    text-align: left;
    // border-top: 1px solid #eee;
    padding: 0px 15px;
    font-size: 14px;
    position: relative;
    .issue-word {
      // text-overflow: ellipsis;
      // overflow: hidden;
      // white-space: nowrap;
      color: #666;
    }
    .issue-download {
      position: absolute;
      right: 15px;
      bottom: 0;
      color: #666;
      &:hover {
        color: #409eff;
      }
    }
  }
}
.issue-dialog {
  .el-dialog__header {
    border-bottom: 1px solid #ccc;
  }
  .el-dialog__body {
    padding: 20px !important;
    min-height: 250px;
    max-height: 500px;
    overflow: auto;
  }
  .insure-number {
    padding: 15px 10px;
    margin-top: 10px;
    border: 1px solid #ebebeb;
    &:hover {
      border-color: #ccc;
    }
  }
}
.clearfix:after {
  content: '';
  display: block;
  height: 0;
  clear: both;
  visibility: hidden;
}

.clearfix {
  zoom: 1;
}
</style>
