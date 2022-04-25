import { Base64 } from 'js-base64'
import { Md5 } from 'ts-md5'
class CryptService {
  cryptKey = 'YBKJ#'

  /**
   * 与应用加密方法
   * 先对每个字符进行亦或，然后在进行base64编码
   *
   * @param {string} message
   * @returns {string}
   */
  enCrypt(message) {
    const xorChars = []
    const bytes = this.stringToBytes(message)
    for (let i = 0; i < bytes.length; i++) {
      const code = bytes[i] ^ this.cryptKey.charCodeAt(i % 5)
      const xorChar = String.fromCharCode(code)
      xorChars.push(xorChar)
    }
    return Base64.btoa(xorChars.join(''))
  }

  stringToBytes(str) {
    const bytes = []
    let c
    const len = str.length
    for (let i = 0; i < len; i++) {
      c = str.charCodeAt(i)
      if (c >= 0x010000 && c <= 0x10ffff) {
        bytes.push(((c >> 18) & 0x07) | 0xf0)
        bytes.push(((c >> 12) & 0x3f) | 0x80)
        bytes.push(((c >> 6) & 0x3f) | 0x80)
        bytes.push((c & 0x3f) | 0x80)
      } else if (c >= 0x000800 && c <= 0x00ffff) {
        bytes.push(((c >> 12) & 0x0f) | 0xe0)
        bytes.push(((c >> 6) & 0x3f) | 0x80)
        bytes.push((c & 0x3f) | 0x80)
      } else if (c >= 0x000080 && c <= 0x0007ff) {
        bytes.push(((c >> 6) & 0x1f) | 0xc0)
        bytes.push((c & 0x3f) | 0x80)
      } else {
        bytes.push(c & 0xff)
      }
    }
    return bytes
  }

  md5(mes) {
    if (!mes) {
      return null
    }
    return new Md5().appendStr(mes).end()
  }
}

const cryptService = new CryptService()
export default cryptService
