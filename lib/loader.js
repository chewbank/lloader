'use strict';

const fs = require('fs');
const path = require('path');
const T = require('ttools');

const excludes = [
   'node_modules',
   '.DS_Store',
   '.git'
];

/**
 * 执行装载器队列
 */
module.exports = {
   /**
    * 生成分级目录、模块加载配置项
    * @param {Object} node 待加载目录节点元数据
    * @param {Object} group 待加载目录、模块元数据
    */
   level(node, group) {

      const { dirPath, children, container, rootContainer } = node;

      for (const name in children) {

         const options = children[name];

         let item

         // 对象表达式
         if (options instanceof Object) {

            const { level, ...other } = options;

            item = {
               level,
               name,
               'path': path.join(dirPath, name),
               container,
               rootContainer,
               ...other,
            }

         }

         // 直接level赋值的极简模式
         else if (typeof options === 'number') {

            item = {
               level: options,
               name,
               'path': path.join(dirPath, name),
               container,
               rootContainer,
            }

         }

         // 跳过加载项
         else {

            continue;

         }

         const { level } = item;

         const list = group[level];

         if (!list) {
            group[level] = [item];
         } else {
            list.push(item);
         }

      }

   },
   /**
    * 按分级顺序依次加载目录、模块
    * {Object} group 待加载目录、模块队列
    */
   loader(group) {

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

            let { name, container } = options;

            let modulePath, result;

            // js模块类型，包含目录默认的index模块
            try {

               modulePath = require.resolve(options.path);
               const match = modulePath.match(/([^\\]+)\.(js|json)$/);
               const fileName = match[1];

               if (fileName === 'index') {
                  name = name.match(/([^\\]+)\\?$/)[1];
               } else {
                  name = fileName;
               }

               try {
                  result = this.module(options);
               } catch (error) {
                  console.error(error);
               }

            }

            // 不含index的目录类型
            catch (error) {

               name = name.match(/(\w+)[/\\]?$/)[1];
               result = this.directory(options);

            }

            if (typeof result === 'object') {

               if (container[name]) {
                  T(container[name]).object({ mixin: result });
               } else {
                  container[name] = result;
               }

            } else if (result !== undefined) {

               container[name] = result;

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

      let result

      try {
         result = require(path);
      } catch (error) {
         throw error
      }

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

      const { name, directory, module, rootContainer } = options;

      const children = {};

      let readdir;

      try {
         readdir = fs.readdirSync(options.path);
      } catch (error) {
         return {};
      }

      for (let name of readdir) {

         const childPath = path.join(options.path, name);

         const stat = fs.statSync(childPath);

         if (stat.isFile()) {
            const modulePath = require.resolve(childPath);
            const match = modulePath.match(/([^\\]+)\.(js|json)$/);
            if (match) {
               name = match[1];
            } else {
               continue;
            }
         } else {
            if (excludes.includes(name)) {
               continue;
            }
            name = childPath.match(/([^\\]+)\\?$/)[1];
         }

         children[name] = {
            level: 0,
            directory,
            module,
         }

      }

      const group = {};
      const container = {};

      this.level({
         dirPath: options.path,
         container,
         rootContainer,
         children
      }, group);

      this.loader(group);

      // 目录装载完毕后的数据处理函数
      if (directory) {
         return directory(container, name);
      } else {
         return container;
      }

   }
}