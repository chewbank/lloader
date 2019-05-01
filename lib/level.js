'use strict';

const fs = require('fs');
const path = require('path');

/**
* 生成分级目录、模块加载配置项
* @param {Object} node 待加载目录节点元数据
* @param {Object} group 待加载目录、模块元数据
*/
function level(node, group) {

   const { dirPath, levels, container, rootContainer } = node;

   for (const originName in levels) {

      const options = levels[originName];

      const testPath = path.join(dirPath, originName);
      let nodePath, nodeName, dirChilds, childContainer;

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

            childContainer = container;

         } else {

            continue;

         }

      }

      // 目录
      else {

         try {
            dirChilds = fs.readdirSync(testPath);
         } catch (error) {
            continue;
         }

         nodePath = testPath;
         childContainer = {};

         nodeName = originName.match(/(\w+)[/\\]?$/)[1];
         container[nodeName] = childContainer;

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
            container: childContainer,
            rootContainer,
            dirChilds,
            ...other,
         }

      }

      // 直接level赋值的极简模式
      else if (typeof options === 'number') {

         item = {
            level: options,
            originName,
            nodePath,
            nodeName,
            container: childContainer,
            rootContainer,
            dirChilds,
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

}

module.exports = level;