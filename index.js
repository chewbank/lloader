'use strict';

const path = require('path');
const T = require('ttools');
const loader = require('./lib/loader');

class Lloader {
   /**
    * @param {*} dirPath 模块路径
    */
   constructor(dirPath) {

      if (!dirPath) {
         throw new Error('dirPath参数不能为空');
      };

      this.dirPath = dirPath;
      this.container = {};
      this.children = {};
      this.rootContainer = {};

      let loadPath = path.join(dirPath, '.loader.js');

      try {
         loadPath = require.resolve(loadPath);
      } catch (error) {
         return
      }

      try {
         const loadConfig = require(loadPath);
         Object.assign(this.children, loadConfig);
      } catch (error) {
         throw error;
      }

   }
   /**
    * 添加分级加载项
    * @param {Object} children 子集加载配置项
    */
   load(children) {

      if (children) {
         T(this.children).object({ mixin: children });
      } else {
         throw new Error('参数不能为空');
      }

      return this;

   }
   /**
    * 保存到指定容器
    * @param {*} container 
    */
   save(container) {

      this.container = container;
      this.rootContainer = container;

      return this;

   }
   /**
    * 即时执行单个加载器
    * @param {Object} options 加载配置项
    * @returns 返回加载器导出结果
    */
   run() {

      const group = {};
      loader.level(this, group);
      loader.loader(group);

      return this;

   }
}

/**
 * 批量执行装载器队列
 */
Lloader.loadAll = function (nodes, log) {

   const group = {};

   for (const node of nodes) {
      loader.level(node, group);
   }

   if (log) {
      log(group);
   }

   loader.loader(group);

   nodes.splice(0);

}

module.exports = Lloader;