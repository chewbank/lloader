'use strict';

const loads = []
const batchImport = require('batch-import')

class Container {
   constructor(container) {
      this.container = container
   }
   /**
    * 添加分级加载项
    * @param {Object} options 加载配置项
    */
   add(options) {
      this.options = options
      loads.push(this)
      return this
   }
   /**
    * 即时运行，不使用分级加载
    * @param {Object} options 加载配置项
    * @returns 加载器导出结果
    */
   now(options) {
      return batchImport(options, this.container)
   }
}


/**
 * 
 * @param {Object} container 模块挂载容器
 */
function lloader(container) {

   if (!container instanceof Object) return

   const chain = new Container(container);

   return chain

}

/**
 * 执行装载器
 */
lloader.load = function () {

   const list = []

   for (const item of loads) {
      const { container, options } = item
      for (const name in options) {
         const item = options[name]
         list.push({
            container,
            level: item.level || 0,
            options: { [name]: item }
         })
      }
   }

   list.sort(function (a, b) {
      return a.level - b.level
   })

   for (let { options, container } of list) {
      batchImport(options, container)
   }

}

module.exports = lloader