'use strict';

const path = require('path');
const T = require('ttools');
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
      this.levels = {};

      let loadPath = path.join(dirPath, '.loader.js');

      try {
         loadPath = require.resolve(loadPath);
      } catch (error) {
         this.levels = levels;
         return
      }

      const loadConfig = require(loadPath);
      Object.assign(this.levels, loadConfig);

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

   loader.load(group);

   if (func) func(group);
   
   nodes.splice(0);

}

module.exports = Lloader;