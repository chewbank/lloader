'use strict';

const T = require('ttools');
const path = require('path');
const loader = require('./lib/loader.js');

class Lloader {
   /**
    * @param {*} dirPath 模块路径
    */
   constructor(dirPath, container, levels = {}) {

      if (!dirPath) {
         throw new Error('dirPath参数不能为空');
      };

      this.dirPath = dirPath;
      this.container = container;
      this.rootContainer = container;

      let loadPath = path.join(dirPath, '.loader.js');
      let resolvePath;

      try {
         resolvePath = require.resolve(loadPath);
      } catch (error) {

      }

      if (resolvePath) {
         this.levels = require(resolvePath);
      } else {
         this.levels = levels; // .loader.js缺省状态下用levels填充
      }

   }
   /**
    * 添加分级加载项
    * @param {Object} levels 子集加载配置项
    */
   addLevels(levels) {

      if (levels) {
         T(this.levels).object({ mixin: levels });
      } else {
         throw new Error('参数不能为空');
      }

      return this;

   }
   /**
    * 执行单个levels配置
    * @param {Object} options 加载配置项
    * @returns 返回加载器导出结果
    */
   load() {

      const group = {};

      loader.level(this, group);

      loader.load(group);

      return this;

   }
}

/**
 * 批量执行装载器队列
 * @param {Array} nodes 加载配置项
 * @param {Function} func 加载完成后的回调函数
 * @returns 返回加载器导出结果
 */
Lloader.loadAll = function (nodes, func) {

   const group = {};

   for (const node of nodes) {
      loader.level(node, group);
   }

   if (func) func(group);
   
   loader.load(group);
   
   nodes.splice(0);

}

module.exports = Lloader;