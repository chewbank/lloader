"use strict"

const toString = Object.prototype.toString;

/**
* 深度递归合并两个对象
* @param {Object} container 数据容器
* @param {Object} join 需要加入到容器的数据
*/
module.exports = function mixin(data, join) {

  if (toString.call(data) === '[object Object]') {
    if (toString.call(join) === '[object Object]') {
      for (let name in join) {
        data[name] = mixin(data[name], join[name])
      }
      return data;
    } else {
      return join;
    }
  } else {
    return join;
  }

};
