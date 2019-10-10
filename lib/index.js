'use strict';

const T = require('ttools');
const loader = require('./loader.js');

class Lloader {
   /**
    * @param {String} dirPath 模块路径
    * @param {Object} root 数据存储容器
    * @param {Object} loads 加载等级，参数与this.addLoads()相同
    */
   constructor(dirPath, root, loads = {}) {

      if (!dirPath) {
         throw new Error('dirPath参数不能为空');
      };

      this.root = root;
      this.data = root;
      this.dirPath = dirPath;
      this.loads = { ...loads }; // 创建浅拷贝实例，防止单例复用时产生的副作用

   }
   /**
    * 向实例追加分级加载项
    * @param {Object} loads 加载配置项
    */
   addLoads(loads) {

      if (loads) {
         T(this.loads).object({ mixin: loads });
      } else {
         throw new Error('参数不能为空');
      }

      return this;

   }
   /**
    * 执行单个loads配置
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
 * @param {Array} loaders 加载配置实例队列
 * @param {Function} middleware 位于分组和模块加载之间的中间函数
 * @returns 返回加载器导出结果
 */
Lloader.loadAll = function (loaders, middleware) {

   const group = loader.levelAll(loaders);

   if (middleware) {

      middleware(group);

   } else {

      for (const name in group) {

         const filter = [];
         const list = group[name];

         for (const item of list) {
            if (item.error === undefined) {
               filter.push(item);
            }
         }

         group[name] = filter;

      }

   }

   loader.load(group);

}

module.exports = Lloader;