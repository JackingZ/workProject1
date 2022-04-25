<template>
  <div class="left-pane" style="display: flex;flex-flow: row nowrap;min-height: inherit;">
    <app-slide v-loading="orgSelectList.isSideLoading" :is-active="isActive">
      <div class="tree-title">
        <p>机构列表</p>
        <div class="showtype">
          <el-select v-model="selectTreeType" placeholder="请选择" size="small" style="width:130px;" @change="handleSelectType">
            <el-option label="查看全部下级" value="1"/>
            <el-option label="仅看当前机构" value="2"/>
          </el-select>
        </div>
      </div>
      <el-tree
        ref="orgtree"
        :data="orgSelectList.data"
        :props="orgProps"
        :expand-on-click-node="false"
        :filter-node-method="filterNode"
        :empty-text="organ ? '暂无数据' : '请先选择渠道'"
        class="filter-tree"
        @node-click="companyNodeClick"/>
    </app-slide>
    <div class="arrow-wrap">
      <img :src="isActive? expandIcon.left : expandIcon.right" @click="isActive = !isActive">
    </div>
    <div class="app-container" style="width: 100%;overflow: auto;">
      <head-info
        title="账单明细"
        info="支持查询报价、承保、续保消费账单明细" />
      <div class="app-panel">
        <div class="table-record-header">
          <div v-if="isAnyAdminChannel" class="balande-select_company">
            <el-select v-model="organ" clearable filterable placeholder="选择渠道" size="small" @change="getOrg" @clear="clearChannel" >
              <el-option v-for="item in organData" :key="item.code" :label="item.shortName" :value="item.code" />
            </el-select>
          </div>
          <div v-if="isAnyAdminChannel" class="balande-record_type">
            <el-cascader v-model="selectType" :options="typeCasData" change-on-select clearable placeholder="业务类型" size="small" />
          </div>
          <!-- <div class="balande-select_organ">
          <my-tree-select :options="companyOptions" v-model="companyName" :normalizer="normalizer" no-options-text="数据加载中..." placeholder="选择机构" no-results-text="未找到结果" @select="companyNodeClick" />
        </div> -->
          <div class="block">
            <el-date-picker v-model="dataTwoArr" :clearable="false" type="daterange" unlink-panels range-separator="~" start-placeholder="开始日期" end-placeholder="结束日期" size="small" />
          </div>
          <div class="balande-selected">
            <el-input v-model="billInput" placeholder="请输入内容" class="input-with-select operateSelect" size="small">
              <el-select slot="prepend" v-model="billSelect" placeholder="请选择">
                <el-option label="业务员账号" value="1" />
                <el-option label="业务员姓名" value="2" />
                <el-option label="车牌/车架号" value="3" />
              </el-select>
            </el-input>
          </div>
          <div class="btn-record">
            <el-button type="primary" icon="el-icon-search" size="small" @click="getDetailCount">查询</el-button>
          </div>
        </div>
        <div class="table-record-data">
          <el-table v-loading="isLoading" :data="detailData" :cell-style="{padding: '4px 0'}" :header-cell-style="{background:'#fafafa'}" border style="width: 100%; margin: 20px 0;" height="calc(100vh - 330px)">
            <el-table-column prop="carLicense" label="车牌/车架号" />
            <el-table-column v-if="isAnyAdminChannel" prop="channelName" label="所属渠道" />
            <el-table-column prop="companyName" label="所属机构" />
            <el-table-column prop="operateInfo" label="业务员信息" min-width="100px"/>
            <el-table-column prop="spending" label="金额(元)" />
            <el-table-column prop="balance" label="实时余额(元)" />
            <el-table-column prop="actionName" label="计费类型" />
            <el-table-column prop="typeName" label="业务类型" />
            <el-table-column prop="createDate" label="操作时间" />
          <!-- <el-table-column prop="userName" label="登录账号" /> -->
          </el-table>
        </div>
        <div class="table-record-footer">
          <el-pagination v-if="count > 0" :current-page="currentPage" :page-sizes="[10, 20, 30, 40, 50]" :page-size="pageSize" :total="count" layout="total, sizes, prev, pager, next, jumper" @size-change="sizeChange" @current-change="currentChange" />
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import request from '@/utils/request'
import constant from '@/api/constant'
import MyTreeSelect from '@/components/MyTreeSelect/index'
import { mapGetters } from 'vuex'
import { getOrgData } from '@/api/number'
import { AppSlide } from '@/components/Slide'
export default {
  components: {
    MyTreeSelect,
    AppSlide
  },
  data() {
    return {
      selectTreeType: '1', // 机构树显示类型 默认为全部层级
      orgProps: {
        label: 'title',
        children: 'children'
      },
      expandIcon: {
        left: require('@/assets/imgs/expand_select-left.png'),
        right: require('@/assets/imgs/expand_select-right.png')
      },
      isTreeshow: false,
      isActive: false, // 机构侧滑,
      isLoading: false,
      organ: '',
      comcode: '', // 公司代码
      organData: [],
      selectType: [],
      typeCasData: [],
      action: null,
      type: null,
      dataTwoArr: [],
      billInput: '',
      billSelect: '1',
      currentPage: 1,
      pageSize: 20,
      count: 0,
      companyOptions: [],
      companyName: null,
      companyKey: [],
      detailData: [],
      orgSelectList: { // 所属机构下拉选择
        loading: false,
        isSideLoading: false,
        disabled: false,
        model: '',
        props: { value: 'key', label: 'title', children: 'children' },
        data: []
      }
    }
  },
  computed: {
    ...mapGetters([
      'isAnyAdminChannel' // 判断登陆用户是否管理员渠道
    ])
  },
  watch: {
    'orgSelectList.model': function(val) {
      this.$refs.orgtree.filter(val)
    }
  },
  created() {
    var day = new Date().toLocaleDateString().split('/')
    day[2] = '1'
    var firstday = day.join('/')
    this.dataTwoArr[0] = new Date(firstday)
    // this.dataTwoArr[0] = new Date(dt.replace(month, '1'))
    this.dataTwoArr[1] = new Date()
    this.getChannelEffective()
    this.getCompanyEffective()
    this.getFinanceType()
    this.getDetailCount()
    if (!this.isAnyAdminChannel) {
      this.getOrg()
      this.isActive = true
    }
    // 获取机构树
    // this.isTreeshow = true
  },
  methods: {
    filterNode(value, data) {
      if (!value) return true
      return data.title.indexOf(value) !== -1
    },
    toggle() { // 左侧机构侧滑
      this.isActive = !this.isActive
    },
    // 获取机构
    getOrg() {
      console.log(this.isAnyAdminChannel)
      if (!this.isAnyAdminChannel) {
        // this.isExpand = true
        var channelCode = JSON.parse(localStorage.getItem('userAll')).data.channelCode
      } else {
        channelCode = this.organ
      }
      getOrgData({
        channelCode: channelCode
      })
        .then(res => {
          this.orgSelectList.data = res.data
        })
        .catch(err => {
          console.warn(err)
        })
    },
    // 分页
    sizeChange(val) {
      this.isLoading = true
      this.pageSize = val
      this.getDetailCount()
    },
    currentChange(val) {
      this.isLoading = true
      this.currentPage = val
      this.getDetailCount()
    },
    // 获取渠道
    getChannelEffective() {
      this.orgSelectList.data = []
      request({
        url: `${constant.channelEffective}?cacheKey=channelQueryAllOfEffective`,
        method: 'get'
      }).then(res => {
        if (res.status === 200) {
          this.organData = res.data
        } else {
          this.$message.error(res.msg)
        }
      })
    },
    // 获取机构
    getCompanyEffective() {
      request({
        url: constant.companyEffective,
        method: 'get'
      }).then(res => {
        if (res.status === 200) {
          const json = JSON.parse(
            JSON.stringify(res).replace(/title/g, 'label')
          )
          this.companyOptions = json.data
        }
      })
    },
    normalizer(node) {
      if (node.children && node.children.length === 0) {
        delete node.children
      }
      return {
        id: node.key,
        label: node.label,
        children: node.children
      }
    },
    // 选择机构
    companyNodeClick(node) {
      console.log('机构点击')
      console.log(node)
      this.companyName = node.label
      // this.companyKey.push(node.key)
      this.companyKey[0] = node.key
      console.log(this.companyName)
      this.getDetailCount()
    },
    // 清除渠道
    clearChannel() {
      this.companyKey = []
    },
    // 获取类型
    getFinanceType() {
      request({
        url: `${constant.financeType}/00001`,
        method: 'get'
      }).then(res => {
        if (res.status === 200) {
          const arr = res.data
          this.typeCasData = this.casTree(arr)
        }
      })
    },
    // 级联结构
    casTree(oldArr) {
      var newArr = []
      oldArr.map(item => {
        if (item.code < 10) {
          var obj = {
            label: item.value,
            value: item.code,
            children: []
          }
          oldArr.map(itemc => {
            if (obj.value === itemc.code.charAt(0) && itemc.code > 10) {
              var cdj = {
                label: itemc.value,
                value: itemc.code
              }
              obj.children.push(cdj)
            }
          })
          newArr.push(obj)
        }
      })
      return newArr
    },
    // 选择机构树类型变化后执行的方法
    handleSelectType() {
      if (this.companyKey.length === 0) {
        return
      }
      this.getDetailCount()
    },
    // 查询
    getDetailCount() {
      this.isLoading = true
      var userName, operateName, carLicense
      // if (!this.companyName) {
      //   this.companyKey = []
      // }
      this.dataTwoArr.map((item, index) => {
        const data = new Date(item)
        const time = data.getTime()
        this.dataTwoArr[index] = time
        console.log(time)
      })
      console.log(this.selectType)
      if (this.selectType.length > 0 && this.selectType.length === 1) {
        this.action = this.selectType[0]
        this.type = null
      } else if (this.selectType.length > 0 && this.selectType.length === 2) {
        this.type = this.selectType[1]
        this.action = null
      } else if (this.selectType.length === 0) {
        this.type = null
        this.action = null
      }
      console.log()
      switch (this.billSelect) {
        case '1':
          userName = this.billInput
          break
        case '2':
          operateName = this.billInput
          break
        case '3':
          carLicense = this.billInput
          break
      }
      request({
        url: `${constant.financeDetail}`,
        method: 'post',
        data: {
          endTime: this.dataTwoArr[1] + 1 * 24 * 60 * 60 * 1000 - 1,
          model: {
            carLicense: carLicense,
            channelCode: this.organ,
            companyIds: this.companyKey,
            operateName: operateName,
            action: this.action,
            type: this.type,
            userName: userName,
            companyFilterType: this.selectTreeType
          },
          page: this.currentPage,
          size: this.pageSize,
          startTime: this.dataTwoArr[0]
        }
      })
        .then(res => {
          this.isLoading = false
          if (res.status === 200) {
            this.count = res.data.count
            this.detailData = res.data.model
            this.detailData.map((item, index) => {
              item.operateName = item.operateName || ''
              item.userName = item.userName || ''
              if (item.operateName || item.userName) {
                this.detailData[index].operateInfo = item.operateName + '-' + item.userName
              }
              console.log(item.operateName, 1)
              // if (this.organData) {
              //   for (const i in this.organData) {
              //     if (item.channelCode === this.organData[i].code) {
              //       this.detailData[index].shortName = this.organData[i].shortName
              //     }
              //   }
              // }
              if (this.typeCasData) {
                for (const i in this.typeCasData) {
                  if (item.action === this.typeCasData[i].value) {
                    this.detailData[index].actionName = this.typeCasData[i].label
                  }
                  for (const j in this.typeCasData[i].children) {
                    if (item.type === this.typeCasData[i].children[j].value) {
                      this.detailData[index].typeName = this.typeCasData[
                        i
                      ].children[j].label
                    }
                  }
                }
              }
            })
          } else {
            console.log(res.msg)
          }
        })
        .catch(err => {
          this.isLoading = false
          console.warn(err)
        })
    }
  }
}
</script>
<style lang="scss">
    .el-table .warning-row {
    color: #f14535;
  }

  .el-table .close-row {
    color: #c0c0c0;
  }
  .table-record-data {
    .el-table td, .el-table th{
      padding: 0;
      height: 40px;
      line-height: 40px;
    }
    .el-table th {
      background: #fafafa;
    }
  }
    .slide-active{
    width:320px;
    padding:10px 15px;
  }
  .tree-title{
    .el-input--small .el-input__inner{
    height: 28px;
    line-height: 28px;
    }
  }
  .el-tree__empty-text{
    font-size: 14px;
  }
</style>
<style lang="scss" scoped>
.app-container{
  padding:15px 15px 15px 6px;
}
.app-panel {
  overflow: hidden;
}
.app-panel {
  .el-table td, .el-table th{
      padding: 0;
      height: 40px;
      line-height: 40px;
  }
  .el-table th {
      background: #fafafa;
    }
}
.tree-title{
  margin-left:10px;
  margin-bottom:10px;
  height:40px;
  line-height:40px;
  border-bottom:1px solid #e6e6e6;
  display:flex;
  justify-content:space-around;
  align-items: center;
  .slide-active{
    width:320px;
    min-width: 240px;
  }
  p {
    flex:1;
    font-size:400;
    color:#909399;
    // display:inline-block;
  }
  .showtype{
    flex:1
      // display:inline-block;
      // margin-left:20px;
  }
}
.table-record-header {
   display:flex;
   justify-content:flex-end;
   flex-wrap:wrap;
  .balande-select_company,
  .balande-record_type,
  .balande-select_organ,
  .block,
  .balande-selected,
  .balande-input {
    display: inline-block;
    vertical-align: top;
    margin-right: 10px;
  }
  .balande-select_company,
  .balande-record_type,
  .balande-select_organ{
    width:150px;
  }
   .el-date-editor--daterange.el-input, .el-date-editor--daterange.el-input__inner, .el-date-editor--timerange.el-input, .el-date-editor--timerange.el-input__inner {
      width: 230px !important;
    }
  .balande-selected {
    width:260px !important;
    .el-select .el-input {
      width: 100px;
    }
    .el-input--suffix {
      width: 115px !important;
    }
    .el-select {
      width:120px;
    }
    .el-input__inner{
      width: 100px;
    }
    .input-with-select .el-input-group__prepend {
      background-color: #fff;
    }
  }
  .balande-select_organ {
    max-width: 230px;
    .vue-treeselect__menu {
      height: 300px;
    }
  }
  .btn-record {
    display: inline-block;
    vertical-align: top;
  }
}
.table-record-data {
  margin-top: 20px;
}
.table-record-footer {
  text-align: right;
  height: 52px;
  // padding-top: 20px;
}
.btn {
    width: 10px;
    height: 32px;
    overflow: hidden;
    border-top-right-radius: 5px;
    border-bottom-right-radius: 5px;
    background-color: rgba(0, 0, 0, .5);
    display: flex;
    justify-content: center;
    align-items: center;
    margin-right: -10px;
    cursor: pointer;
    transition: all .3s ease;
  img {
    width: 10px;
    height: 10px;
    transition: all .5s ease;
  }
  }
  .btn:hover {
    background-color: rgba(0, 0, 0, .7);
  }
//  .arrow {
//     transform: rotateZ(180deg);
//   }
.left-pane {
    display: flex;
    padding: 0;
    margin-right: 5px;
    background: transparent;
    .tree-wrap {
      width: 260px;
      padding: 25px 10px;
      overflow: auto;
      box-sizing: border-box;
      border-color: #e8e8e8;
      background-color: #fff;
      transition: all 0.3s ease;
      height: calc(100vh - 114px);
    }
    .hide {
      width: 0;
      overflow: hidden;
      padding: 0px;
    }
    .arrow-wrap {
      display: flex;
      align-items: center;
      height: calc(100vh - 114px);
      box-sizing: border-box;
      // padding-bottom: 40px;
      cursor: pointer;
      img {
        width: 12px;
      }
    }
}
</style>
