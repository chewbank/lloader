'use strict';

const fs = require('fs');
const path = require('path');

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
   * 按加载等级对加载项进行聚合
   * @param {Object} node 待加载目录节点元数据
   * @param {Object} group 待加载目录、模块元数据
   */
   level(node, group = {}) {

      const { levels, dirPath, data, root } = node;

      for (const originName in levels) {

         const options = levels[originName];

         const testPath = path.join(dirPath, originName);
         let nodePath, nodeName, dirList, children;

         try {
            nodePath = require.resolve(testPath);
         } catch (error) {

         }

         // js模块
         if (nodePath) {

            const match = nodePath.match(/([^/\\]+)\.js$/);

            // js模块类型
            if (match) {

               nodeName = match[1];

               if (nodeName === 'index') {

                  // originName值不等于index.js时，视为目录型index.js，使用目录名代替文件名
                  if (originName !== 'index.js') {
                     nodeName = originName.match(/(\w+)[/\\]?$/)[1];
                  }

               }

               children = data;

            } else {

               continue;

            }

         }

         // 目录
         else {

            try {
               dirList = fs.readdirSync(testPath);
            } catch (error) {
               continue;
            }

            nodePath = testPath;
            children = {};

            nodeName = originName.match(/(\w+)[/\\]?$/)[1];
            data[nodeName] = children;

         }

         let item;

         // 对象表达式
         if (options instanceof Object) {

            const { level, ...other } = options;

            item = {
               level,
               originName,
               nodePath,
               nodeName,
               data: children,
               root,
               dirList,
               ...other,
            }

         }

         // 直接level赋值的极简模式
         else if (typeof options === 'number') {

            item = {
               level: options,
               data: children,
               originName,
               nodePath,
               nodeName,
               root,
               dirList,
            }

         }

         else {

            continue;

         }

         const { level } = item;

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

      const levels = {};
      const { dirList, nodePath, module, directory } = options;

      for (let name of dirList) {

         const childPath = path.join(nodePath, name);
         const stat = fs.statSync(childPath);

         if (stat.isFile()) {
            const modulePath = require.resolve(childPath);
            const match = modulePath.match(/([^/\\]+)\.js$/);
            if (match) {
               name = match[1];
            } else {
               continue;
            }
         } else {
            if (excludes.includes(name)) {
               continue;
            }
            name = childPath.match(/(\w+)[/\\]?$/)[1];
         }

         levels[name] = {
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
         levels
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

      if (nodeName === 'index') {
         Object.assign(data, result);
      } else if (data[nodeName] === undefined) {
         data[nodeName] = result;
      }

   },
}