'use strict';

const T = require('ttools');
const loader = require('./lib/loader.js');

class Lloader {
   /**
    * @param {String} dirPath 模块路径
    * @param {Object} root 数据存储容器
    * @param {Object} levels 加载等级，参数与this.addLevels()相同
    */
   constructor(dirPath, root, levels = {}) {

      if (!dirPath) {
         throw new Error('dirPath参数不能为空');
      };

      this.root = root;
      this.parent = root;
      this.dirPath = dirPath;
      this.levels = levels;

   }
   /**
    * 向实例追加分级加载项
    * @param {Object} levels 加载配置项
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
    */
   load() {

      const group = loader.level(this);

      loader.load(group);

      return this;

   }
}

/**
 * 批量执行装载实例队列
 * @param {Array} nodes 加载配置项
 * @param {Function} func 加载完成后的回调函数
 * @returns 返回加载器导出结果
 */
Lloader.loadAll = function (nodes, func) {

   const group = loader.levelAll(nodes);

   if (func) func(group);

   loader.load(group);

   nodes.splice(0);

}

module.exports = Lloader;