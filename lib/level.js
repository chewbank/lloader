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

   for (const name in levels) {

      const options = levels[name];

      console.log(options);

      let modulePath, directory, childContainer;

      try {
         modulePath = require.resolve(options.path);
      } catch (error) {

      }

      if (modulePath) {

         const match = modulePath.match(/([^/\\]+)\.js$/);

         // js模块类型
         if (match) {

            const moduleName = match[1];

            if (moduleName === 'index') {

               // 根index.js
               if (name === 'index.js') {
                  childContainer = container;
               }

               // 目录index.js
               else {
                  const moduleName = name.match(/(\w+)[/\\]?$/)[1];
                  childContainer = {};
                  container[moduleName] = childContainer;
               }

            }

            // 如果导出结果已存在则不赋值，避免覆盖同名节点
            else if (container[moduleName] === undefined) {

               childContainer = {};
               container[moduleName] = childContainer;

            } else {

               continue;
               
            }

         } else {

            continue;

         }

      } else {

         const dirPath = options.path;

         try {
            directory = fs.readdirSync(dirPath);
         } catch (error) {
            continue; //  跳过不存在的目录
         }

         const dirName = name.match(/(\w+)[/\\]?$/)[1];

         childContainer = {};
         container[dirName] = childContainer;
         
      }

      let item;

      // 对象表达式
      if (options instanceof Object) {

         const { level, ...other } = options;

         item = {
            name,
            level,
            directory,
            'path': path.join(dirPath, name),
            container: childContainer,
            rootContainer,
            ...other,
         }

      }

      // 直接level赋值的极简模式
      else if (typeof options === 'number') {

         item = {
            name,
            level: options,
            directory,
            'path': path.join(dirPath, name),
            container: childContainer,
            rootContainer,
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