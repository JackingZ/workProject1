/**
 *Created by Jhonor on 2019/1/8.
 */
import imageview from '@/components/imageview/imageview'

const appImageView = {}

appImageView.install = function(Vue, options) {
  const ImageViewInstance = Vue.extend(imageview)
  let instance = null
  const init = () => {
    instance = new ImageViewInstance()
    const doc = instance.$mount().$el
    document.body.appendChild(doc)
  }

  Vue.prototype.$imageview = {
    show(options = { title: '', url: null }) {
      if (!instance) {
        init()
      }
      if (options.url) {
        instance.show = true
        instance.title = options.title
        instance.url = options.url
      } else {
        console.error('url is required')
      }
    }
  }
}

export default appImageView
