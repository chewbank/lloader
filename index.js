'use strict';

const loads = []
const batchImport = require('batch-import')

class Container {
   constructor(container) {
      this.container = container
   }
   add(options) {
      this.options = options
      loads.push(this)
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
            name,
            container,
            level: item.level || 0,
            options: { [name]: item }
         })
      }
   }

   list.sort(function (a, b) {
      return a.level - b.level
   })

   for (let { options, container, name } of list) {
      container[name] = {}
      batchImport(options, container[name])
   }

}

module.exports = lloader