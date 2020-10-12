'use strict';

const loader = require('./loader.js');
const mixin = require('./mixin.js');

class Lloader {
  /**
   * @param {String} dirPath 模块路径
   * @param {Object} root 数据存储容器
   * @param {Object} loads 加载等级，参数与this.add()相同
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
  add(loads) {

    if (loads) {
      mixin(this.loads, loads);
    } else {
      throw new Error('参数不能为空');
    }

  }
  /**
   * 执行当前实例的装载任务
   */
  load() {

    const levels = {};

    loader.level(this, levels);

    loader.load(levels);

  }
}

/**
 * 批量执行多个装载实例队列
 * @param {Array} loaders loader加载器实例队列
 * @param {Function} middleware 位于分组和模块加载之间的中间函数
 * @returns 返回加载器导出结果
 */
Lloader.loadAll = function (loaders, middleware) {

  const levels = {};

  for (const item of loaders) {

    loader.level(item, levels);

  }

  if (middleware) {

    middleware(levels);

  } else {

    for (const name in levels) {

      const filter = [];
      const list = levels[name];

      for (const item of list) {
        if (item.error === undefined) {
          filter.push(item);
        }
      }

      levels[name] = filter;

    }

  }

  loader.load(levels);

}

module.exports = Lloader;
