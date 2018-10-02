'use strict';

const fs = require('fs')
const path = require('path')

const excludes = [
   '...loader.js',
   'node_modules',
   '.DS_Store',
   '.vscode',
   '.git'
]

/**
 * 执行装载器队列
 */
module.exports = {
   /**
    * 生成分级目录、模块加载配置项
    * @param {Object} directory 
    * @param {Array} list 
    */
   level(list, directory) {

      const { dirPath, subset, container, options = {} } = directory

      try {
         var readdir = fs.readdirSync(dirPath)
      } catch (error) {
         return
      }

      if (readdir.includes('...loader.js')) {
         const loadPath = path.join(dirPath, '...loader.js')
         try {
            const mixin = require(loadPath)
            Object.assign(subset, mixin)
         } catch (error) {

         }
      }

      for (const name of readdir) {

         // 排除无效目录、文件
         if (excludes.includes(name)) continue

         const item = subset[name]

         // 有配置项时覆盖配置项
         if (item instanceof Object) {
            list.push({
               name,
               path: path.join(dirPath, name),
               level: isNaN(item.level) ? 10 : item.level,
               container,
               ...item,
            })
         }

         // 配置项为false时表示排除指定的模块
         else if (item === false) {
            continue
         }

         // 无配置项时使用默认配置项
         else {
            list.push({
               level: 100,
               ...options,
               path: path.join(dirPath, name),
               container,
               name,
            })
         }

      }

      // 加载队列排序
      list.sort((a, b) => a.level - b.level)

   },
   /**
    * 按分级顺序依次加载目录、模块
    * @param {Array} list 
    */
   loader(list) {

      for (let options of list) {

         let result

         const stat = fs.statSync(options.path)

         if (stat.isFile()) {
            result = this.file(options)
         } else {
            result = this.directory(options)
         }

         if (result !== undefined) {
            const { container, name } = options
            Object.assign(container, { [name]: result })
         }

      }

   },
   /**
    * 装载文件
    */
   file(options) {

      const { path, name, container } = options
      const { contain, exclude, import: _import } = options

      if (contain) {
         if (!contain.includes(name)) return
      } else if (exclude) {
         if (exclude.includes(name)) return
      }

      if (/\.js$/.test(name)) {

         let result

         try {
            result = require(path)
         } catch (error) {
            return
         }

         const index = name.indexOf('.js')
         options.name = name.slice(0, index)

         // 模块导出数据处理函数，覆盖原始值
         if (_import) {
            result = _import.call(container, result, options.name)
         }

         return result

      }

   },
   /**
    * 递归装载目录
    */
   directory(options) {

      const { path, name } = options
      const { contain, exclude, complete } = options

      if (contain) {
         // if (contain.includes(name)) {
         //    _options = other
         // }
      } else if (exclude) {
         if (exclude.includes(name)) return
      }

      const list = []
      const container = {}

      this.level(list, {
         dirPath: path,
         container,
         options,
         subset: {}
      })

      this.loader(list)

      // 目录装载完毕后的数据处理函数
      if (complete) {
         return complete(container, name)
      } else {
         return container
      }

   }
}