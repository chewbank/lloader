'use strict';

/**
 * 
 * @param {String} dirPath 加载目录的相对路径
 * @param {Object} container 模块挂载容器
 */
function lloader(dirPath, container) {

   if (!dirPath || !container) return

   const directory = new Chain(dirPath, container)

   lloader.directorys.push(directory)

   return directory

}

// 装载目录队列
lloader.directorys = []


/**
 * 批量执行装载器队列
 */
lloader.load =  function (func) {

   const levels = {}

   for (const directory of lloader.directorys) {

      loader.level(levels, directory)

   }

    loader.loader(levels)

   // 批量装载完后重置容器
   lloader.directorys = []

}

module.exports = lloader

const Chain = require('./lib/Chain')
const loader = require('./lib/loader')

