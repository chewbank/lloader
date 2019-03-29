'use strict';

const path = require('path');

/**
* 生成分级目录、模块加载配置项
* @param {Object} node 待加载目录节点元数据
* @param {Object} group 待加载目录、模块元数据
*/
function level(node, group) {

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

}

module.exports = level;