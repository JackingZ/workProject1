/**
 * Created by jiachenpan on 16/11/18.
 */

export function isvalidUsername(str) {
  return str.length > 0
}

/* 合法uri*/
export function validateURL(textval) {
  const urlregex = /^(https?|ftp):\/\/([a-zA-Z0-9.-]+(:[a-zA-Z0-9.&%$-]+)*@)*((25[0-5]|2[0-4][0-9]|1[0-9]{2}|[1-9][0-9]?)(\.(25[0-5]|2[0-4][0-9]|1[0-9]{2}|[1-9]?[0-9])){3}|([a-zA-Z0-9-]+\.)*[a-zA-Z0-9-]+\.(com|edu|gov|int|mil|net|org|biz|arpa|info|name|pro|aero|coop|museum|[a-zA-Z]{2}))(:[0-9]+)*(\/($|[a-zA-Z0-9.,?'\\+&%$#=~_-]+))*$/
  return urlregex.test(textval)
}

/* 小写字母*/
export function validateLowerCase(str) {
  const reg = /^[a-z]+$/
  return reg.test(str)
}

/* 大写字母*/
export function validateUpperCase(str) {
  const reg = /^[A-Z]+$/
  return reg.test(str)
}

/* 大小写字母*/
export function validatAlphabets(str) {
  const reg = /^[A-Za-z]+$/
  return reg.test(str)
}

/**
 * 车牌号等相关校验规则
 */
/**
 * 校验特殊字符
 * @method validateEngineNo
 * @param  {string}         engineno [description]
 * @return {boolean}                  [description]
 */
export function hasSpecial(value) {
  // eslint-disable-next-line
  return /[\*\@\#\$\%\^\&\{\}\:\"\<\>\?\[\]]/.test(value)
}

/**
 * 校验车驾号
 * source: https://en.wikipedia.org/wiki/Vehicle_identification_number#Example_Code
 */
export const validateVin = (function() {
  function transliterate(char) {
    return '0123456789.ABCDEFGH..JKLMN.P.R..STUVWXYZ'.indexOf(char) % 10
  }
  function getCheckDigit(vin) {
    var map = '0123456789X'
    var weights = '8765432X098765432'
    var sum = 0
    for (var i = 0; i < 17; ++i) sum += transliterate(vin[i]) * map.indexOf(weights[i])
    return map[sum % 11]
  }
  return function(vin) {
    if (vin.length !== 17) return false
    return getCheckDigit(vin) === vin[8]
  }
})()

// 只能输入英文名或者中文名
export function isName(val) {
  if (!val) return false
  val = val.replace(/·/g, '')
  if (val) val = val.replace(/（/g, '').replace(/）/g, '').replace(/\(/g, '').replace(/\)/g, '')
  return /^[\u0391-\uFFE5A-Za-z]+$/.test(val) && val.length >= 2 && val.length <= 30
}

/**
 * 校验发动机号码
 * @method isEngineNo
 * @param  {string}         engineno [description]
 * @return {boolean}                  [description]
 */
export function isEngineNo(engineno) {
  const re = /[^\u4e00-\u9fa5]+$/
  // const isIO = /i|o|I|O/ !isIO.test(engineno)
  return !hasSpecial(engineno) && re.test(engineno) && engineno.length < 30
}

/**
 * 校验手机号码
 * @method isMobile
 * @param  {type}       mobile [description]
 * @return {type}              [description]
 */
export function isMobile(mobile) {
  // const re = /^(0|86|17951)?(13[0-9]|15[012356789]|17[0678]|18[0-9]|14[57])[0-9]{8}$/
  const re = /^[1][3,4,5,7,8,9][0-9]{9}$/
  return !hasSpecial(mobile) && re.test(mobile)
}

export function isMobileOrTel(mobile) {
  // const re = /^(0|86|17951)?(13[0-9]|15[012356789]|17[0678]|18[0-9]|14[57])[0-9]{8}$/
  const re = /^[1][3,4,5,7,8][0-9]{9}$/
  // const tel = /^(\(\d{3,4}\)|\d{3,4}-|\s)?\d{7,14}$/
  const tel = /^0\d{2,3}-?\d{7,8}$/
  return !hasSpecial(mobile) && (re.test(mobile) || tel.test(mobile))
}

/**
 * 校验车驾号
 * @method isVin
 * @param  {type}       mobile [description]
 * @return {type}              [description]
 */
export function isVin(vin) {
  if (!vin) return false
  if (vin.length !== 17 || /i|o|I|O/.test(vin)) return false
  return true
  // return !hasSpecial(vin) && validateVin(vin)
}

export function isLicense(val) {
  const regex = /^[京津冀晋蒙辽吉黑沪苏浙皖闽赣鲁豫鄂湘粤桂琼渝川贵云藏陕甘青宁新]{1}[A-Z]{1}[A-Z_0-9]{5,6}$/
  // let regex = /^[京津沪渝冀豫云辽黑湘皖鲁新苏浙赣鄂桂甘晋蒙陕吉闽贵粤青藏川宁琼使领A-Z]{1}[A-Z]{1}[A-Z0-9]{4,5}[A-Z0-9挂学警港澳]{1}$/
  return regex.test(val) && !/i|o|I|O/.test(val)
}

export function isNumber(val) {
  return /^[0-9]+(.[0-9]{1,4})?$/.test(val)
}

export function isIdCard(cardId) {
  const Wi = [7, 9, 10, 5, 8, 4, 2, 1, 6, 3, 7, 9, 10, 5, 8, 4, 2, 1]
  const ValideCode = [1, 0, 10, 9, 8, 7, 6, 5, 4, 3, 2]
  let valCodePosition
  let year
  let month
  let day
  let tempDate
  if (cardId.length === 18) {
    const aIdCard = cardId.split('')
    let sum = 0
    if (aIdCard[17] === 'X') {
      aIdCard[17] = 10
    }
    for (let i = 0; i < 17; i++) {
      sum += Wi[i] * aIdCard[i]
    }
    valCodePosition = sum % 11
    if (~~aIdCard[17] === ValideCode[valCodePosition]) {
      year = cardId.substring(6, 10)
      month = cardId.substring(10, 12)
      day = cardId.substring(12, 14)
      tempDate = new Date(year, parseFloat(month) - 1, parseFloat(day))
      return tempDate.getFullYear() === parseFloat(year) &&
        tempDate.getMonth() === parseFloat(month) - 1 &&
        tempDate.getDate() === parseFloat(day)
    } else {
      return false
    }
  } else if (cardId.length === 15) {
    year = cardId.substring(6, 8)
    month = cardId.substring(8, 10)
    day = cardId.substring(10, 12)
    tempDate = new Date(year, parseFloat(month) - 1, parseFloat(day))
    // 对于老身份证中的你年龄则不需考虑千年虫问题而使用getYear()方法
    return tempDate.getYear() === parseFloat(year) &&
      tempDate.getMonth() === parseFloat(month) - 1 &&
      tempDate.getDate() === parseFloat(day)
  } else {
    return false
  }
}

export function isChineseName(name) {
  if (name === '') {
    return false
  } else {
    const reg = /^[\u4E00-\u9FA5\uf900-\ufa2d·s]{2,20}$/ // 现在限制了只能输入纯中文姓名，英文和特殊符号都不行
    return reg.test(name)
  }
}

export function isBankCard(val) {
  const reg = /^\d{16}|\d{19}$/
  return reg.test(val)
}

export function isEmail(val) {
  const reg = /^[A-Za-z0-9._%-]+@([A-Za-z0-9-]+\.)+[A-Za-z]{2,4}$/
  return reg.test(val)
}

// 组织机构代码
export function isOrgCode(val) {
  if (val) val = val.replace(/-/, '')
  return oldCheck(val) || isSocialCreditCode(val)
}

// 老板组织机构代码校验
function oldCheck(txtval) {
  var values = txtval.indexOf('-') >= 0 ? txtval.split('-') : [txtval.substring(0, txtval.length - 1), txtval.substring(txtval.length, txtval.length - 1)]
  var ws = [3, 7, 9, 10, 5, 8, 4, 2]
  var str = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ'
  var reg = /^([0-9A-Z]){8}$/
  if (!reg.test(values[0])) {
    return false
  }
  var sum = 0
  for (var i = 0; i < 8; i++) {
    sum += str.indexOf(values[0].charAt(i)) * ws[i]
  }
  var C9 = 11 - (sum % 11)
  var YC9 = values[1] + ''
  if (C9 === 11) {
    C9 = '0'
  } else if (C9 === 10) {
    C9 = 'X'
  } else {
    C9 = C9 + ''
  }
  C9 = C9 + ''
  YC9 = YC9 + ''
  return YC9 === C9
}

// 统一社会信用代码
export function isSocialCreditCode(value) {
  const regex = /^[0-9A-HJ-NPQRTUWXY]{2}\d{6}[0-9A-HJ-NPQRTUWXY]{10}$/
  return regex.test(value)
}

// 是否车座位
export function isCarSeat(value) {
  const regex = /^[0-9]{1,2}$/
  return regex.test(value) && parseInt(value) > 1
}
