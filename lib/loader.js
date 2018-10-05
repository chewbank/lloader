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
    * @param {Object} levels 待加载目录、模块队列
    * @param {Object} directory 待加载目录
    */
   level(levels, directory) {

      const { dirPath, subset, container, inherit = {} } = directory

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

         const sub = subset[name]

         let item

         // 有配置项时使用已有配置项
         if (sub instanceof Object) {
            const { level, before, after, ...other } = sub
            item = {
               level,
               before,
               list: {
                  ...other,
                  name,
                  'path': path.join(dirPath, name),
                  container,
               },
               after
            }
         }

         // 配置项为false时表示不加载该目录或模块
         else if (sub === false) {
            continue
         }

         // 无配置项时创建默认配置项
         else {
            item = {
               list: {
                  ...inherit,
                  name,
                  'path': path.join(dirPath, name),
                  container,
               }
            }
         }

         const { level = 100, before, list, after } = item

         let levelItem = levels[level]

         if (!levelItem) {
            levelItem = { 'before': [], 'list': [], 'after': [] }
            levels[level] = levelItem
         }

         if (before) {
            levelItem.before.push(before)
         }

         levelItem.list.push(list)

         if (after) {
            levelItem.after.push(after)
         }

      }

   },
   /**
    * 按分级顺序依次加载目录、模块
    * {Object} levels 待加载目录、模块队列
    */
   loader(levels) {

      for (const level in levels) {

         const { before, list, after } = levels[level]

         for (const func of before) {
            func()
         }

         for (const options of list) {

            let { name, container } = options

            const stat = fs.statSync(options.path)

            if (stat.isFile()) {
               if (/\.(js|json)$/.test(name)) {
                  name = name.slice(0, name.indexOf('.js'))
                  this.route = this.module
               } else {
                  continue
               }
            } else {
               this.route = this.directory
            }

            const result = this.route(options)

            if (result !== undefined) {
               if (container[name]) {
                  container[name] = { ...container[name], ...result }
               } else {
                  container[name] = result
               }
            }

         }

         for (const func of after) {
            func()
         }

      }

   },
   /**
    * 装载模块
    */
   module(options) {

      const { name, container } = options
      const { contain, exclude, module } = options

      if (contain) {
         if (!contain.includes(name)) return
      } else if (exclude) {
         if (exclude.includes(name)) return
      }

      let result

      try {
         result = require(options.path)
      } catch (error) {
         throw error
      }

      // 模块导出数据处理函数
      if (module) {
         result = module.call(container, result, options.name)
      }

      return result

   },
   /**
    * 递归装载目录
    */
   directory(options) {

      const { name, contain, exclude, directory, module } = options

      if (contain) {
         // if (contain.includes(name)) {
         //    _options = other
         // }
      } else if (exclude) {
         if (exclude.includes(name)) return
      }

      const levels = {}
      const container = {}

      this.level(levels, {
         dirPath: options.path,
         container,
         inherit: {
            contain,
            exclude,
            directory,
            module
         },
         subset: {}
      })

      this.loader(levels)

      // 目录装载完毕后的数据处理函数
      if (directory) {
         return directory(container, name)
      } else {
         return container
      }

   }
}