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
         for (const { before, rootContainer } of list) {
            if (before) {
               before(rootContainer);
            }
         }

         // 同级加载队列
         for (const options of list) {

            let modulePath;

            try {
               modulePath = require.resolve(options.path);
            } catch (error) {

            }

            // 模块类型
            if (modulePath) {

               const match = modulePath.match(/([^/\\]+)\.js$/);

               // js模块类型
               if (match) {

                  const fieldName = match[1];
                  const result = this.module(options);
                  const { name, container } = options;

                  if (fieldName === 'index') {

                     // 根index.js
                     if (name === 'index.js') {
                        Object.assign(container, result)
                     }

                     // 目录index.js
                     else {
                        const fieldName = name.match(/(\w+)[/\\]?$/)[1];
                        container[fieldName] = result;
                     }

                  }

                  // 如果导出结果为空则不赋值，避免覆盖同名节点
                  else if (container[fieldName] === undefined) {

                     container[fieldName] = result;

                  }

               }

            }

            // 模块不存在 || 目录类型
            else {

               this.directory(options);

            }

         }

         // 后置钩子函数队列
         for (const { after, rootContainer } of list) {

            if (after) {
               after(rootContainer);
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
         return {};
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

      const group = {}, childContainer = {};
      const { name, container, rootContainer } = options;
      const fieldName = name.match(/(\w+)[/\\]?$/)[1];

      container[fieldName] = childContainer; // 在装载目录前先创建容器，方便同级模块间引用

      this.level({
         dirPath,
         container: childContainer,
         rootContainer,
         levels
      }, group);

      this.load(group);

      // 目录装载完毕后的数据处理函数
      if (directory) {
         const result = directory(childContainer, name);
         Object.assign(childContainer, result);
      }

   }
}