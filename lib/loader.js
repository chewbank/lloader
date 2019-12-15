'use strict';

const fs = require('fs');
const path = require('path');

const excludes = [
   'node_modules',
   '.DS_Store',
   '.git'
];

const regDirectory = /(\w+)[/\\]?$/;
const regModule = /([^/\\]+)\.(js|json)$/;
const { toString } = Object.prototype;

/**
 * 执行装载器队列
 */
module.exports = {
   /**
   * 按加载等级对加载项进行聚合
   * @param {Object} node 待加载目录节点元数据
   * @param {Object} group 待加载目录、模块元数据
   */
   level(node, group = {}) {

      const { loads, dirPath, data, root } = node;

      for (const originName in loads) {

         const options = loads[originName];

         if (toString.call(options) !== '[object Object]') continue;

         const testPath = path.join(dirPath, originName);

         const { level, ...other } = options;

         const item = {
            level,
            originName,
            root,
            ...other,
         }

         let isDirectory;

         try {
            const stat = fs.statSync(testPath);
            isDirectory = stat.isDirectory();
         } catch (error) {

         }

         // 目录类型
         if (isDirectory) {

            item.dirList = fs.readdirSync(testPath);
            item.nodePath = testPath;

            const nodeName = originName.match(regDirectory)[1];
            item.nodeName = nodeName;

            item.data = {};
            data[nodeName] = item.data;

         }
         
         // 文件类型
         else {

            try {

               // js模块类型
               const nodePath = require.resolve(testPath);
               const match = nodePath.match(regModule);

               item.nodePath = nodePath;
               item.nodeName = match[1];
               item.data = data;

            } catch (error) {

               item.nodePath = testPath;
               item.error = error.message;

            }

         }

         const list = group[level];

         if (list) {
            list.push(item);
         } else {
            group[level] = [item];
         }

      }

      return group;

   },
   /**
    * 批量聚合多个加载实例
    * @param {Array} nodes Lloader类实例队列
    */
   levelAll(nodes) {

      const group = {};

      for (const node of nodes) {

         this.level(node, group);

      }

      return group;

   },
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
               options.before(options);
            }
         }

         // 同级加载队列
         for (const options of list) {

            // 模块类型
            if (options.dirList === undefined) {
               this.module(options);
            }

            // 目录类型
            else {
               this.directory(options);
            }

         }

         // 后置钩子函数队列
         for (const options of list) {

            if (options.after) {
               options.after(options);
            }

         }

      }

   },
   /**
    * 递归装载目录
    */
   directory(options) {

      const loads = {};
      const { dirList, nodePath, module, directory } = options;

      for (let name of dirList) {

         const childPath = path.join(nodePath, name);
         const stat = fs.statSync(childPath);

         if (stat.isFile()) {

            const match = name.match(regModule);
            if (match) {
               name = match[1];
            } else {
               continue;
            }

         } else {

            if (excludes.includes(name)) {
               continue;
            }

            name = childPath.match(regDirectory)[1];

         }

         loads[name] = {
            level: 0,
            module,
            directory,
         }

      }

      const group = {};
      const { originName, data, root } = options;

      this.level({
         dirPath: nodePath,
         data,
         root,
         loads
      }, group);

      this.load(group);

      // 目录装载完毕后的数据处理函数
      if (directory) {

         const result = directory(data, originName);

         Object.assign(data, result);

      }

   },
   /**
    * 装载模块
    */
   module(options) {

      const { originName, nodeName, nodePath, data, module } = options;

      let result = require(nodePath);

      // 模块导出数据处理函数
      if (module) {
         result = module(result, originName);
      }

      if (data[nodeName] === undefined) {
         data[nodeName] = result;
      }

   },
}