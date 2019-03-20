'use strict';

const path = require('path');
const T = require('ttools');
const { nodes } = require('./common');
const loader = require('./loader');

class Node {
   /**
    * @param {*} dirPath 模块路径
    */
   constructor(dirPath) {

      this.dirPath = dirPath;
      this.container = {};
      this.children = {};

      const loadPath = path.join(dirPath, '.loader.js');



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
   load(children = {}) {

      T(this.children).object({ mixin: children });

      return this;

   }
   /**
    * 保存到指定容器
    * @param {*} container 
    */
   save(container) {

      this.container = container;

      return this;

   }
   /**
    * 即时执行单个加载器
    * @param {Object} options 加载配置项
    * @returns 返回加载器导出结果
    */
   run() {

      nodes.pop();

      const list = [];
      loader.level(this, list);
      loader.loader(list);

      return this;

   }
}

module.exports = Node;