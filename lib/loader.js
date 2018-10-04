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
    * @param {Object} directory 加载目录
    * @param {Array} list 加载目录、模块队列
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
            var mixin = require(loadPath)
         } catch (error) {
            throw error
         }
         Object.assign(subset, mixin)
      }

      for (const name of readdir) {

         // 排除无效目录、文件
         if (excludes.includes(name)) continue

         const subOptions = subset[name]

         // 有配置项时覆盖配置项
         if (subOptions instanceof Object) {
            list.push({
               name,
               path: path.join(dirPath, name),
               level: 100,
               container,
               ...subOptions,
            })
         }

         // 配置项为false时表示不加载指定的目录、模块
         else if (subOptions === false) {
            continue
         }

         // 无配置项时使用默认配置项
         else {
            const { before, after, ...expand } = options
            list.push({
               level: 100,
               ...expand,
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

         if (options.before) {
            options.before(options.container)
         }

         const stat = fs.statSync(options.path)

         let result

         if (stat.isFile()) {
            result = this.file(options)
         } else {
            result = this.directory(options)
         }

         if (result !== undefined) {
            const { container, name } = options
            if (container[name]) {
               Object.assign(container[name], result)
            } else {
               container[name] = result
            }
         }

         if (options.after) {
            options.after(options.container)
         }

      }

   },
   /**
    * 装载文件
    */
   file(options) {

      const { path, name, container } = options
      const { contain, exclude, module } = options

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
            throw error
         }

         const index = name.indexOf('.js')
         options.name = name.slice(0, index)

         // 模块导出数据处理函数
         if (module) {
            result = module.call(container, result, options.name)
         }

         return result

      }

   },
   /**
    * 递归装载目录
    */
   directory(options) {

      const { path, name } = options
      const { contain, exclude, directory } = options

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
      if (directory) {
         return directory(container, name)
      } else {
         return container
      }

   }
}