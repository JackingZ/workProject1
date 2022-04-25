/**
 *Created by Jhonor on 2019/1/22.
 */
export default {
  data() {
    return {
      hasError: false
    }
  },
  computed: {
    myValue: {
      get() {
        return this.value
      },
      set(val) {
        console.log('myValue', val)
        this.$emit('input', val)
      }
    }
  },
  mounted() {
    this.myForm.on('onError', ({ prop, msg }) => {
      if (this.prop !== prop) return
      if (msg) {
        this.hasError = true
      } else {
        this.hasError = false
      }
    })
    this.sendValue(this.value)
  },
  methods: {
    onTrigger(value, trigger) {
      // console.log('onTrigger', trigger, value)
      this.myForm.emit('onInput', { prop: this.prop, value, trigger })
      if (trigger === 'change') {
        this.sendValue(value)
      }
    },
    getFormItem() {
      return this.$refs.formItem
    },
    sendValue(value) {
      const formItem = this.getFormItem()
      console.log('sendValue', value)
      this.myForm.emit('sendValue', { prop: this.prop, value, el: formItem.$el })
    }
  }
}
