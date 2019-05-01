'use strict';

const fs = require('fs');
const path = require('path');
const level = require('./level.js');

const excludes = [
   'node_modules',
   '.DS_Store',
   '.git'
];

/**
 * 执行装载器队列
 */
module.exports = {
   level,
   /**
    * 按分级顺序依次加载目录、模块
    * {Object} group 待加载目录、模块队列
    */
   load(group) {

      for (const level in group) {

         const list = group[level];

         // 前置钩子函数队列
         for (const options of list) {
            if (options.before) {
               options.before(options.rootContainer);
            }
         }

         // 同级加载队列
         for (const options of list) {

            // 模块类型
            if (options.directory === undefined) {

               const { container } = options;
               const result = this.module(options);
               Object.assign(container, result);

            }

            // 目录类型
            else {

               this.directory(options);

            }

         }

         // 后置钩子函数队列
         for (const options of list) {

            if (options.after) {
               options.after(options.rootContainer);
            }

         }

      }

   },
   /**
    * 装载模块
    */
   module(options) {

      const { name, path, container, module } = options;

      let result = require(path);

      // 模块导出数据处理函数
      if (module) {
         result = module.call(container, result, name);
      }

      return result;

   },
   /**
    * 递归装载目录
    */
   directory(options) {

      const dirPath = options.path;

      try {
         var readdir = fs.readdirSync(dirPath);
      } catch (error) {
         return;
      }

      const levels = {};
      const { module, directory } = options;

      for (let name of readdir) {

         const childPath = path.join(options.path, name);

         const stat = fs.statSync(childPath);

         if (stat.isFile()) {
            const modulePath = require.resolve(childPath);
            const match = modulePath.match(/([^/\\]+)\.(js|json)$/);
            if (match) {
               name = match[1];
            } else {
               continue;
            }
         } else {
            if (excludes.includes(name)) {
               continue;
            }
            name = childPath.match(/([^/\\]+)\\?$/)[1];
         }

         levels[name] = {
            level: 0,
            module,
            directory,
         }

      }

      const group = {};
      const { name, container, rootContainer } = options;

      this.level({
         dirPath,
         container,
         rootContainer,
         levels
      }, group);

      this.load(group);

      // 目录装载完毕后的数据处理函数
      if (directory) {
         const result = directory(container, name);
         Object.assign(container, result);
      }

   }
}