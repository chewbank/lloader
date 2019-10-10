## lloader

node.js模块水平、分级装载器，通过预声明模块的加载等级，实现多应用同步扩展。

### 特性

* 支持目录和模块分级深度加载

* 支持多个目录同级加载

* 支持api和配置文件两种方式定义加载项

* 目录职责单一化，严格遵循约定，避免产生管理混乱

### install

      npm install lloader

### 使用方法

#### 单项目示例

```js
const lloader = require('lloader');

const container = {};

const lloader = new Lloader("/home/project/", container);

lloader.addLoads({
   "a.js": {
      "level": 1
   },
   "b.js": {
      "level": 1
   },
});

Lloader.load();
```

#### 多项目示例

```js
const lloader = require('lloader')

const container1 = {}, container2 = {};

const lloader = new Lloader("/home/project1/", container1, {
   "a.js": {
      "level": 1
   },
   "b.js": {
      "level": 1
   },
});

const lloader2 = new Lloader("/home/project2/", container2, {
   "a.js": {
      "level": 1
   },
   "b.js": {
      "level": 1
   },
});

Lloader.loadAll([lloader, lloader2]);
```

### Lloader(dirPath, container, loads)

*  `dirPath` *String* 加载模块所在目录的绝对路径

*  `container` *Object* 装载数据存储容器

*  `loads` *Object* 加载配置项

*  `@return` *Object* 装载器实例

添加目录装载项，返回当前目录配置实例


### Lloader.loadAll([lloader]);

*  `dirPath` *Array* 包含多个Lloader实例的数组

Lloader静态方法，用于平行加载多个项目


### lloader.addLoads(options)

*  `options` *Object* - 所有子选项均为可选

      *  `$name` *Object, Boolean* - 装载选项，$name对应目录名称或包含.js、.json后缀的文件名。当值为false时表示不装载该目录或模块

         *  `level` *Number* - 加载等级

         *  `directory(data, name)` *Function* - 目录加载完毕的回调函数，支持子集继承。如果无数据返回，则该目录结构不会被创建。

               *  `data` *Object* - 当前目录下所有子集导出数据集合

               *  `name` *String* - 当前目录名称

         *  `module(data, name)` *Function* - 模块加载完毕的回调函数，this指向当前层级容器。如果无数据返回，则该模块输出为空。

               *  `data` * - 当前模块导出数据

               *  `name` *String* - 当前模块名称，不含后缀

         *  `before(options)` *Function* - 当前等级下所有目录、模块在加载前执行的钩子函数（仅在当前层级触发，不对子集继承）

               *  `data` * - 当前目录、模块导出数据

               *  `dirList` * - 当前目录下的文件名列表

               *  `root` * - 根节点

         *  `after(options)` *Function* - 当前等级下所有目录、模块在加载后执行的钩子函数（仅在当前层级触发，不对子集继承），参数与before(options)一致


定义当前实例下的一级子节点的装载配置项。


### lloader.load()

触发当前实例配置中的加载任务，仅作用于单个实例。


### 注意事项

由于lloader的主要应用场景是为node.js应用提供启动阶段的模块自动装载功能，为了简化代码、减少错误率，所有api均被设计为同步加载方式。因此不要在应用启动阶段以外的生命周期中使用lloader模块，否则可能会导致严重的node.js线程阻塞。