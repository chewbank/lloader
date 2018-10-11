'use strict';

const loader = require('./lib/loader')
const chain = require('./lib/chain')
const share = require('./lib/share')

/**
 * 
 * @param {String} dirPath 加载目录的相对路径
 * @param {Object} container 模块挂载容器
 */
function lloader(dirPath, container) {

   if (!dirPath || !container) return

   const directory = new chain(dirPath, container)

   share.directorys.push(directory)

   return directory

}


/**
 * 批量执行装载器队列
 */
lloader.load = function () {

   const levels = {}

   for (const directory of share.directorys) {
      loader.level(levels, directory)
   }

   loader.loader(levels)

   share.directorys = []

}

module.exports = lloader