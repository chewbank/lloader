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
Lloader.loadAll = function (func) {

   const group = {};

   for (const node of nodes) {
      loader.level(node, group);
   }

   nodes.splice(0);

   if (func) {
      func(group);
   }

   loader.loader(group);

}

// 暴露装载节点，方便调试
Lloader.nodes = nodes;

module.exports = Lloader;