var uploadProdFiles = require('./uploadImplement')
function canUpload () {
  let version = process.env.BUILD_VER
  switch (version) {
    case 'test':
    case 'test2':
      return true
  }
}

if (canUpload()){
  uploadProdFiles()
}