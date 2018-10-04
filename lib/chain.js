'use strict';

const path = require('path')
const loader = require('./loader')
const common = require('./common')
const { cwd } = common

class chain {

   /**
    * 
    * @param {*} dirPath 模块路径
    * @param {*} container 模块导出存储容器
    */
   constructor(dirPath, container) {
      this.subset = {}
      this.dirPath = path.join(cwd, dirPath)
      this.container = container
   }

   /**
    * 添加分级加载项
    * @param {Object} subset 子集加载配置项
    */
   set(subset = {}) {
      Object.assign(this.subset, subset)
      return this
   }

   /**
    * 分级加载函数，计划
    * @param {Number} value 
    * @param {Function} func 
    */
   level(value, func){

   }

   /**
    * 即时执行单个目录加载器，不支持分级加载
    * @param {Object} options 加载配置项
    * @returns 返回加载器导出结果
    */
   load(subset) {
      common.directorys.pop()
      this.set(subset)
      const list = []
      loader.level(list, this)
      loader.loader(list)
   }

}


module.exports = chain