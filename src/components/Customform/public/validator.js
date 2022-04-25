/**
 *Created by Jhonor on 2019/1/18.
 */
import Vue from 'vue'

export default class Validator {
  constructor() {
    this.eventBus = new Vue()
    this.isDestroyed = false
    this.listener = []
    this.valueMap = new Map()
  }

  init(rules) {
    console.log('表单验证初始化')
    this.rules = rules || []
    this.on('onInput', ({ prop, value, trigger }) => {
      const validation = rules[prop] || []
      const changeList = validation.filter(item => item.trigger === 'change')
      const validationList = validation.filter(item => item.trigger === trigger).concat(changeList)
      console.log(validationList)
      if (validation && validationList.length > 0) {
        this.validation(prop, value, validationList)
      }
    })
    this.saveValue()
  }

  saveValue() {
    this.on('sendValue', ({ prop, value, el }) => {
      console.log('sendValue', prop, value)
      if (prop) {
        this.valueMap.set(prop, { value, el })
      }
      console.log('this.valueMap', this.valueMap)
    })
  }

  // TODO: 验证表单所有的value
  async validateAll(callback) {
    let errorItem
    let element
    for (const [prop, { value, el }] of this.valueMap) {
      const validation = this.rules[prop] || []
      const tempError = await this.validation(prop, value, validation)
      if (!errorItem && tempError) {
        element = el
        errorItem = tempError
        callback && callback({
          isValid: false,
          prop,
          message: errorItem.message,
          el })
      }
    }
    if (!errorItem) {
      callback && callback({
        isValid: true,
        prop: null,
        message: null,
        el: element })
    }
  }

  isArray(obj) {
    return obj && Object.prototype.toString.call(obj) === '[object Array]'
  }

  async validation(prop, value, list) {
    if (list && list.length === 0) return
    console.log(prop, value, list.length)
    const errorItem = await this.findErrorItem(prop, value, list)
    console.log('errorItem', errorItem)
    this.emit('onError', {
      prop,
      msg: errorItem ? errorItem.message : ''
    })
    return errorItem
  }

  async findErrorItem(prop, value, list) {
    for (const item of list) {
      const { required, validator, pattern } = item
      if (required) {
        if (this.isArray(value) && value.length === 0) return item
        else if (!value) return item
      }
      if (pattern && pattern instanceof RegExp && !pattern.test(value)) {
        return item
      }
      if (validator) {
        const res = await this.customValidator(item, value, validator)
        const { hasError, msg } = res
        if (hasError) return { ...item, message: msg }
      }
    }
  }

  customValidator(item, value, validator) {
    return new Promise(resolve => {
      validator(item, value, error => {
        if (error && error instanceof Error) {
          resolve({
            hasError: true,
            msg: error.message
          })
        } else resolve({ hasError: false })
      })
    })
  }

  on(key, callback) {
    const bus = this.eventBus
    bus.$on(key, callback)
    const hasCallback = this.listener.some(item => {
      return item.key === key && item.callback === callback
    })
    if (hasCallback) return
    this.listener.push({ key, callback })
  }

  emit(key, val) {
    const bus = this.eventBus
    bus.$emit(key, val)
  }

  destroy() {
    if (this.isDestroyed) return
    const bus = this.eventBus
    this.listener.forEach(item => {
      if (item.key && item.callback) bus.$off(item.key, item.callback)
    })
    this.listener = []
    this.isDestroyed = true
    this.valueMap.clear()
  }
}
