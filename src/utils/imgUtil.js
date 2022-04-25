/*eslint-disable*/
/**
 * compress img
 * @param img  img tag( by new Image)
 * @returns {string} base64 string include str width height
 */
export function compress(img) {
  let canvas = document.createElement('canvas')
  let ctx = canvas.getContext('2d')
  //    瓦片canvas
  let tCanvas = document.createElement('canvas')
  let tctx = tCanvas.getContext('2d')
  let initSize = img.src.length
  let width = img.width
  let height = img.height
  let maxWidth = 800
  // 如果图片大于四百万像素，计算压缩比并将大小压至400万以下
  let ratio = width * height / 4000000
  if (ratio > 1) {
    ratio = Math.sqrt(ratio)
    width /= ratio
    height /= ratio
  } else {
    ratio = 1
  }
  let wRatio = width / maxWidth
  if (wRatio > 1) {
    width = maxWidth
    height /= wRatio
  }
  canvas.width = width
  canvas.height = height

  ctx.fillStyle = '#fff' //        铺底色
  ctx.fillRect(0, 0, canvas.width, canvas.height)
  // 如果图片像素大于100万则使用瓦片绘制
  let count
  if ((count = width * height / 2000000) > 1) {
    count = ~~(Math.sqrt(count) + 1) // 计算要分成多少块瓦片
    let nw = ~~(width / count) // 计算每块瓦片的宽和高
    let nh = ~~(height / count)
    tCanvas.width = nw
    tCanvas.height = nh
    for (let i = 0; i < count; i++) {
      for (let j = 0; j < count; j++) {
        tctx.drawImage(img, i * nw * ratio, j * nh * ratio, nw * ratio, nh * ratio, 0, 0, nw, nh)
        ctx.drawImage(tCanvas, i * nw, j * nh, nw, nh)
      }
    }
  } else {
    ctx.drawImage(img, 0, 0, width, height)
  }
  // 进行最小压缩
  let ndata = canvas.toDataURL('image/jpeg', 0.8)
  // console.log('压缩前：' + initSize)
  // console.log('压缩后：' + ndata.length)
  // console.log('压缩率：' + ~~(100 * (initSize - ndata.length) / initSize) + '%')
  tCanvas.width = tCanvas.height = canvas.width = canvas.height = 0
  return {
    base64: initSize < 100000 ? img.src : ndata, // 图片小于100KB的，不进行压缩处理，上传原图原像素。
    width: width,
    height: height
  }
}

/**
 * 图片剪裁
 * @param vm 调用实例
 * @param dataBase64 base64数据
 */
export function cropperImg(Cropper, dataBase64, callback) {
  // let cropperInstance
  let image = document.getElementById('image')
  let screenWidth = window.screen.width
  let screenHeight = window.screen.height
  image.src = dataBase64
  image.onload = (function () {
    let cropperInstance = new Cropper(image, {
      viewMode: 1,
      autoCropArea: 1,
      cropBoxMovable: false,
      minContainerWidth: screenWidth,
      minContainerHeight: screenHeight,
      aspectRatio: 86 / 60,
      background: false,
      cropBoxResizable: false,
      dragMode: 'move',
      ready: function () {
        callback(cropperInstance)
      }
    })
  })()
}

/**
 * 获取base64转化的blob
 * @param basestr base64字符串
 * @param type 转换类型 图片类型
 * @returns {*} blob对象
 */
export function getBase64ToBlob(basestr, type) {
  let text = window.atob(basestr.split(',')[1])
  let buffer = new Uint8Array(text.length)
  for (let i = 0; i < text.length; i++) {
    buffer[i] = text.charCodeAt(i)
  }
  return getBlob([buffer], type)
}

/**
 * 获取blob对象的兼容性写法
 * @param buffer
 * @param format
 * @returns {*}
 */
function getBlob(buffer, format) {
  try {
    return new Blob(buffer, {
      type: format
    })
  } catch (e) {
    let bb = new(window.BlobBuilder || window.WebKitBlobBuilder || window.MSBlobBuilder)()
    buffer.forEach(function (buf) {
      bb.append(buf)
    })
    return bb.getBlob(format)
  }
}
