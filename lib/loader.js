'use strict';

const fs = require('fs');
const path = require('path');

const excludes = [
  'node_modules',
  '.DS_Store',
  '.git'
];

const regDirectory = /(\w+)[/\\]?$/;
const regModule = /([^/\\]+)\.(js|json)$/;
const { toString } = Object.prototype;

/**
 * 执行装载器队列
 */
module.exports = {
  /**
  * 按加载等级对加载项进行分组
  * @param {Object} nodeInfo 待加载目录节点元信息
  * @param {Object} container 保存目录、模块分级加载结果的容器
  * @returns {Object} 保存目录、模块分级加载结果的容器
  */
  level(nodeInfo, container = {}) {

    const { root, dirPath, loads, data } = nodeInfo;

    for (const originName in loads) {

      const options = loads[originName];

      if (toString.call(options) !== '[object Object]') continue;

      const { level, ...other } = options;

      const children = {
        root,
        level,
        originName,
        ...other,
      };

      if (options.action) {

        children.name = originName;
        children.data = data;

      } else {

        const testPath = path.join(dirPath, originName);

        let isDirectory;

        try {
          const stat = fs.statSync(testPath);
          isDirectory = stat.isDirectory();
        } catch (error) {

        }

        // 目录类型
        if (isDirectory) {

          children.parents = data;
          children.nodePath = testPath;
          children.children = fs.readdirSync(testPath);

          const [, name] = originName.match(regDirectory);
          children.name = name;

          children.data = {};
          data[name] = children.data;

        }

        // 文件类型
        else {

          try {

            // js模块类型
            const nodePath = require.resolve(testPath);
            const [, name] = nodePath.match(regModule);

            children.nodePath = nodePath;
            children.name = name;
            children.data = data;
            children.isModule = true;

          } catch (error) {

            children.nodePath = testPath;
            children.error = error.message;

          }

        }

      }

      const list = container[level];

      if (list) {
        list.push(children);
      } else {
        container[level] = [children];
      }

    }

    return container;

  },
  /**
   * 装载目录（递归）
   * @param {Object} options 加载选项
   */
  directory(options) {

    const loads = {};
    const { children, nodePath, module, directory } = options;

    const loadConfig = {
      level: 0,
      module,
      directory,
    };

    for (let name of children) {

      const childPath = path.join(nodePath, name);
      const stat = fs.statSync(childPath);

      if (stat.isFile()) {

        const match = name.match(regModule);
        if (match) {
          name = match[1];
        } else {
          continue;
        }

      } else {

        if (excludes.includes(name)) continue;

        name = childPath.match(regDirectory)[1];

      }

      loads[name] = loadConfig;

    }

    const { root, parents, data, name, originName } = options;

    const levels = {};

    this.level({
      dirPath: nodePath,
      root,
      parents: data,
      data,
      loads
    }, levels);

    this.load(levels); // 装载子目录

    // 目录装载完毕后的数据处理函数
    if (directory) {

      parents[name] = directory(data, originName);

    }

  },
  /**
   * 装载模块
   * @param {Object} options 加载选项
   */
  module(options) {

    const { originName, name, nodePath, data, module } = options;

    let result = require(nodePath);

    // 模块导出数据处理函数
    if (module) {
      result = module(result, originName);
    }

    if (data[name] === undefined) {
      data[name] = result;
    }

  },
  /**
   * 按分级顺序依次加载目录、模块
   * @param {Object} levels 待加载目录、模块队列
   */
  load(levels) {

    for (const level in levels) {

      const list = levels[level];

      // 前置钩子函数队列
      for (const options of list) {
        if (options.before) {
          options.before(options);
        }
      }

      // 同级加载队列
      for (const options of list) {

        // 模块类型
        if (options.isModule) {
          this.module(options);
        }

        // 目录类型
        else if (options.children) {
          this.directory(options);
        }

        // 函数类型
        else if (options.action) {
          options.data[options.name] = options.action(options);
        }

      }

      // 后置钩子函数队列
      for (const options of list) {

        if (options.after) {
          options.after(options);
        }

      }

    }

  },
}