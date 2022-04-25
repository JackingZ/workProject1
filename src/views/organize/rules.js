// import { isIdCard } from '@/utils/validate'
import { isMobileNumber, isIdcard } from '@/utils/pattern'
export const getRules = (self) => {
  return {
    team: [
      {
        required: true,
        message: '请选择所属团队',
        trigger: 'change'
      }
    ],
    userName: [
      {
        required: true,
        message: '请输入登录账号',
        trigger: 'bur'
      },
      {
        required: true,
        validator: self.validateUserName,
        trigger: 'blur'
      }
    ],
    idName: [
      {
        required: true,
        message: '请输入姓名',
        trigger: 'bur'
      }
    ],
    phone: [
      {
        required: true,
        message: '请输入手机账号',
        trigger: 'bur'
      },
      {
        required: true,
        message: '手机账号格式不正确',
        trigger: 'bur',
        pattern: isMobileNumber
      }
    ],
    validDateType: [
      {
        required: true,
        message: '请选择有效时间',
        trigger: 'change'
      }
    ],
    validDate: [
      {
        required: true,
        message: '请输入自定义有效时间',
        trigger: 'change'
      }
    ],
    salesType: [
      {
        required: true,
        message: '请选择业务员类型',
        trigger: 'change'
      }
    ],
    channel: [
      {
        required: true,
        message: '请选择所属渠道',
        trigger: 'change'
      }
    ],
    sex: [
      {
        required: true,
        message: '请选择性别',
        trigger: 'change'
      }
    ],
    status: [
      {
        required: true,
        message: '请选择启用状态',
        trigger: 'change'
      }
    ],
    rolesList: [
      {
        required: true,
        message: '请选择分配角色',
        trigger: 'change'
      }
    ],
    roles: [
      {
        required: true,
        message: '请选择分配角色',
        trigger: 'change'
      }
    ],
    encode: [
      {
        required: true,
        message: '请输入设备EN号',
        trigger: 'change'
      },
      {
        required: true,
        message: 'EN号为8位数字或英文字母组成',
        trigger: 'change',
        pattern: /^[a-zA-Z0-9]{8}$/
      }
    ],
    agentCode: [
      {
        required: false,
        message: '人员编号只能输入数字或字母',
        trigger: 'change',
        pattern: /^[A-Za-z0-9]+$/
      },
      {
        validator: (rule, value, callback) => {
          self.agentCodeCheck(callback)
        },
        trigger: 'change'
      }
    ],
    idNum: [
      {
        required: false,
        message: '身份证号格式不正确',
        trigger: 'change',
        pattern: isIdcard
      }
    ]
    // sbtAppName: [
    //   {
    //     required: true,
    //     message: '请输入深保通姓名',
    //     trigger: 'change'
    //   }
    // ],
    // sbtAppIdNo: [
    //   {
    //     required: true,
    //     message: '请输入深保通账号',
    //     trigger: 'change'
    //   }
    //   // {
    //   //   validator: (rule, value, callback) => {
    //   //     if (isIdCard(value)) callback()
    //   //     else callback(new Error('请输入正确的深保通账号'))
    //   //   },
    //   //   trigger: 'blur'
    //   // }
    // ],
    // sbtPassword: [
    //   {
    //     required: true,
    //     message: '请输入深保通密码',
    //     trigger: 'change'
    //   }
    // ]
  }
}
