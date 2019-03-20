'use strict';

const common = require('./lib/common');
const Node = require('./lib/node');
const loader = require('./lib/loader');

const { nodes } = common;

/**
 * @param {String} dirPath 加载目录的相对路径
 * @param {Object} container 模块挂载容器
 */
function Lloader(dirPath) {

   if (!dirPath) return;

   const node = new Node(dirPath);

   nodes.push(node);

   return node;

}


/**
 * 批量执行装载器队列
 */
Lloader.loadAll = function () {

   const group = {};

   for (const node of nodes) {
      loader.level(node, group);
   }

   // 显示加载顺序
   for (const name in group) {
      const { list } = group[name];
      console.log(`\x1b[32m--------------------- loader \x1b[33m${name}\x1b[32m ---------------------\x1b[30m`);
      for (const item of list) {
         const { name, path } = item;
         console.log(` \x1b[33m${name} \x1b[35m${path}\x1b[30m`);
      }
   }

   nodes.splice(0);

   loader.loader(group);

}

// 暴露装载节点，方便调试
Lloader.nodes = nodes;

module.exports = Lloader;