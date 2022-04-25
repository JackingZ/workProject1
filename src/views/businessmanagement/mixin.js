/**
 *Created by Jhonor on 2019/3/5.
 */
import {
  queryPolicyById,
  getBelongCompanyList,
  getPolicySalesman,
  updatePolicyOrOrder,
  getPolicyFiled
} from '@/api/policy_management'

export const policyMixin = {
  data() {
    return {
      isLoading: true, // 是否显示loading
      policyDetail: {
        belongCompanyList: [],
        policySalesmanList: [],
        policyExt: {
          organizationId: ''
        },
        applicantExt: {},
        vehicleExt: {},
        upFormality: { downType: null },
        saleFormality: {},
        agencyFormality: {},
        riskMap: {
          a0: {},
          a1: {},
          a2: {},
          a3: {},
          a4: {},
          a5: {},
          a6: {},
          a7: {},
          a8: {},
          a9: {},
          a10: {},
          a11: {}
        }
      } // 保单/订单详情
    }
  },
  methods: {
    // 查看保单或订单详情
    async checkPolicyDetails(id) {
      this.isLoading = true
      try {
        const { data } = await queryPolicyById(id)
        this.policyDetail = data
        this.isLoading = false
      } catch (e) {
        console.warn(e)
      }
    },

    // 将商业险明细对象转换为数组的方法,用户go接口,手动录单页面加载时,将riskMap转换为数组赋值给riskList
    objToArray(obj) {
      return Object.values(obj)
    },

    // 将商业险明细数组,转换为对象的方法,用于手动录单编辑,将riskList数组转换为对象赋值给riskMap
    arrayToObj(arr) {
      return arr.reduce((acc, cur, i) => {
        acc[cur.riskCode] = cur
        return acc
      }, {})
    },

    // 进入手动录单时掉用取空字段
    async checkPolicyFiled() {
      this.isLoading = true
      try {
        const { data } = await getPolicyFiled()
        this.policyDetail = data
        // 非运维情况，手动录单渠道不可编辑，默认为当前账号渠道
        if (!this.isSubAdminChannel) {
          const code = JSON.parse(localStorage.getItem('userAll')).data
            .channelCode
          const nickName = JSON.parse(localStorage.getItem('userAll')).data
            .nickName
          const channelName = JSON.parse(localStorage.getItem('userAll')).data
            .channelName
          const idName = JSON.parse(localStorage.getItem('userAll')).data.idName
          const id = JSON.parse(localStorage.getItem('userAll')).data
            .id
          this.policyDetail.policyExt.sourceCode = code
          this.policyDetail.policyExt.channelName =
            channelName || nickName || idName
          this.policyDetail.policyExt.operatorId = id
        }
        this.isLoading = false
      } catch (e) {
        console.log(e)
      }
    },

    // 编辑保单时，所属机构改变触发事件，重新请求业务员
    onBelongCompanyChange(val) {
      this.policyDetail.policyExt.userId = ''
      this.policyDetail.policySalesmanList = []
      // this.$set(this.policyDetail, 'policySalesmanList', [])
      if (!val) return
      getPolicySalesman({ teamId: val })
        .then(res => {
          // this.$set(this.policyDetail, 'policySalesmanList', res.data)
          this.policyDetail.policySalesmanList = res.data
        })
        .catch(err => {
          console.warn(err)
        })
    },

    // 编辑保单
    async editPolicy(id) {
      this.isLoading = true
      try {
        const { data } = await queryPolicyById(id, this.isManualEntry)
        this.policyDetail = data
        if (!this.isManualEntry) {
          const { data: belongCompanyList } = await getBelongCompanyList(
            this.policyDetail.policyExt.sourceCode,
            this.policyDetail.policyExt.areaCode
          )
          this.policyDetail.belongCompanyList = JSON.parse(
            JSON.stringify(belongCompanyList)
              .replace(/title/g, 'label')
              .replace(/key/g, 'value')
          )
          const { data: salesman } = await getPolicySalesman({
            teamId: this.policyDetail.policyExt.organizationId
          })
          this.policyDetail.policySalesmanList = salesman
        }
        const channelName = JSON.parse(localStorage.getItem('userAll')).data.channelName
        if (this.policyDetail.riskList.length) {
          this.policyDetail.riskMap = { ...this.policyDetail.riskMap, ...this.arrayToObj(this.policyDetail.riskList) }
        }
        this.policyDetail.policyExt.channelName = channelName
        this.isLoading = false
        this.isEditPolicyShow = true
      } catch (e) {
        console.warn(e)
      }
    },

    // 编辑保单提交
    // submitPolicy() {
    //   const policyDetail = this.policyDetail
    //   const policyExt = policyDetail.policyExt
    //   const {
    //     organizationName,
    //     organizationId,
    //     vciPolicyNo,
    //     tciPolicyNo,
    //     userName,
    //     userId,
    //     id: policyId
    //   } = policyExt
    //   const params = {
    //     identity: 2,
    //     policyId,
    //     organizationName,
    //     organizationId,
    //     vciPolicyNo,
    //     tciPolicyNo,
    //     userName,
    //     userId,
    //     up: policyDetail.upFormality,
    //     agency: policyDetail.agencyFormality,
    //     sale: policyDetail.saleFormality
    //   }
    //   updatePolicyOrOrder(params)
    //     .then(res => {
    //       this.$message({
    //         message: '保存成功',
    //         type: 'success'
    //       })
    //     })
    //     .catch(err => {
    //       this.$message.error(err || '保存失败')
    //       console.log(err)
    //     })
    // },

    // 编辑订单提交
    submitOrder(callback) {
      const policyDetail = this.policyDetail
      const policyExt = policyDetail.policyExt
      const {
        organizationName,
        organizationId,
        vciPolicyNo,
        tciPolicyNo,
        userName,
        userId,
        id: policyId,
        policyTime,
        policyStatus
      } = policyExt
      const params = {
        identity: 1,
        policyId,
        organizationName,
        organizationId,
        vciPolicyNo,
        tciPolicyNo,
        userName,
        userId,
        up: policyDetail.upFormality,
        agency: policyDetail.agencyFormality,
        sale: policyDetail.saleFormality,
        policyTime,
        policyStatus
      }
      updatePolicyOrOrder(params)
        .then(res => {
          this.isChackAndEditShow = false
          this.isLoading = false
          this.$message({
            message: '保存成功',
            type: 'success'
          })
          callback && callback()
        })
        .catch(err => {
          this.isLoading = false
          this.$message.error(err || '保存失败')
          console.log(err)
        })
    },

    // 页面初始化
    policyInit() {
      const policyProps = sessionStorage.getItem('policyProps') || '{}'
      const type = JSON.parse(policyProps).checkType || null
      const id = JSON.parse(policyProps).policyId || null
      const checkType = this.checkType || type
      const policyId = this.policyId || id
      console.log('checkType-=-==', type)
      console.log(this.isQueryInsured)
      switch (checkType) {
        case 1:
          this.checkPolicyDetails(policyId)
          break
        case 2:
          this.editPolicy(policyId)
          break
        case 3:
          this.checkPolicyDetails(policyId)
          break
        case 4:
          this.checkPolicyDetails(policyId)
          break
        case 5:
          this.checkPolicyFiled()
          break
        case 6:
          this.checkPolicyDetails(policyId)
          break
        default:
          this.$confirm('打开保单失败', {
            showCancelButton: false,
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning',
            center: true
          }).then(() => {
            window.opener = null
            window.open('', '_self')
            window.close()
          })
          return
      }
    }
  },
  created() {
    this.policyInit()
  },
  computed: {
    // 页面标题
    pageTitle() {
      const policyProps = sessionStorage.getItem('policyProps') || '{}'
      const type = JSON.parse(policyProps).checkType || null
      const checkType = this.checkType || type
      switch (checkType) {
        case 1:
          return '查看保单'
        case 2:
          return '编辑保单'
        case 3:
          return '查看订单'
        case 4:
          return '编辑订单'
        case 5:
          return '手动录入'
        default:
          return
      }
    }
  }
}
