let Client = require('ssh2-sftp-client')
let path = require('path')
let fs = require('fs')

function getRemotePath () {
  let version = process.env.BUILD_VER
  switch (version) {
    case 'test':
      return '/spa/carManagerTest/'
    case 'test2':
      return '/spa/carManagerTest2/'
  }
}


function uploadProdFiles() {
  let remotePath = getRemotePath()
  if (!remotePath) return
  let localFilePath = path.join(__dirname, '../dist/')
  let uploadFileList = []
  let html = []
  let img = []
  let allowFileList = ['.js', '.css', '.js.map', '.png', '.jpg', '.ttf']
  function fileDisplay(filePath) {
    // 根据文件路径读取文件，返回文件列表
    let files = fs.readdirSync(filePath)
    // 遍历读取到的文件列表
    files.forEach(function (filename) {
      // 获取当前文件的绝对路径
      var filedir = path.join(filePath, filename)
      // 根据文件路径获取文件信息，返回一个fs.Stats对象
      let stats = fs.statSync(filedir)
      var isFile = stats.isFile()// 是文件
      var isDir = stats.isDirectory()// 是文件夹
      if (isFile) {
        if (allowFileList.some(item => filedir.includes(item))) {
          // console.log(filedir)
          uploadFileList.push({
            path: filedir.replace(/\\/g, '/'),
            relativePath: filedir.replace(localFilePath, '').replace(/\\/g, '/')
          })
        }else if (filedir.includes('.html')){
          html.push({
            path: filedir.replace(/\\/g, '/'),
            relativePath: filedir.replace(localFilePath, '').replace(/\\/g, '/')
          })
        }
      }
      if (isDir) {
        fileDisplay(filedir)// 递归，如果是文件夹，就继续遍历该文件夹下面的文件
      }
    })
  }
  // console.log('localFilePath', localFilePath)
  fileDisplay(localFilePath)
  // console.log(uploadFileList)
  startFtpUpload(uploadFileList,html)
}

async function startFtpUpload(uploadFileList,html) {
  let remotePath = getRemotePath()
  let sftp = new Client()
  await sftp.connect({
    host: '120.27.21.67',
    port: '22',
    username: 'u13',
    password: 'htmlJScss190307'
  })
  console.log('remotePath =', remotePath)
  for (let item of uploadFileList) {
    console.log('upload ',item.path)
    console.log('remote', remotePath + item.relativePath)
    await sftp.put(item.path, remotePath + item.relativePath)
  }
  for (let item of html) {
    console.log('upload html ',item.path)
    await sftp.put(item.path, remotePath + item.relativePath)
  }
  sftp.end()
  console.log('end upload')
}

// uploadProdFiles()
module.exports = uploadProdFiles