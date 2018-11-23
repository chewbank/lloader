'use strict';

const loader = require('./lib/loader')
const Chain = require('./lib/chain')
const common = require('./lib/common')

/**
 * 
 * @param {String} dirPath 加载目录的相对路径
 * @param {Object} container 模块挂载容器
 */
function lloader(dirPath, container) {

   if (!dirPath || !container) return

   const directory = new Chain(dirPath, container)

   common.directorys.push(directory)

   return directory

}


/**
 * 批量执行装载器队列
 */
lloader.load =  function (func) {

   const levels = {}

   for (const directory of common.directorys) {

      loader.level(levels, directory)

   }

    loader.loader(levels)

   // 批量装载完后重置容器
   common.directorys = []

}

module.exports = lloader