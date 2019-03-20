## lloader

node.js模块分级、批量装载器。通过预声明模块的加载等级，实现应用模块的水平扩展。

### 特性

* 支持目录和模块分级深度加载

* 支持多个目录同级加载

* 支持api和配置文件两种方式定义加载项

* 目录职责单一化，严格遵循约定，避免产生管理混乱


### 注意事项

由于lloader的主要应用场景是为node.js应用提供启动阶段的模块自动装载功能，为了简化代码、减少错误率，所有api均被设计为同步加载方式。因此不要在应用启动阶段以外的生命周期中使用lloader模块，否则可能会导致严重的node.js线程阻塞。

### install

      npm install lloader

### 使用方法

```js
const lloader = require('lloader')

const container = {}

lloader('app').load({
   "model": {
      "level": 1
   }
}).save(container);

lloader('main').load({
   "model": {
      "level": 1
   }
}).save(container);

lloader.loadAll();
```

### lloader(path)

*  `path` *String* 加载模块所在目录的绝对路径

*  `return` *Object* 函数链

添加目录装载项，返回当前目录配置实例

### this.load(options)

*  `options` *Object* 无特殊说明时，所有子参数均为可选

      *  `$name` *Object, Boolean* - 装载选项，$name对应目录名称或包含.js、.json后缀的文件名。当值为false时表示不装载该目录或模块

         *  `level` *Number* - 加载等级，默认100

         *  `directory(data, name)` *Function* - 目录加载完毕的回调函数，支持子集继承。如果无数据返回，则该目录结构不会被创建。

               *  `data` *Object* - 当前目录下所有子集导出数据集合

               *  `name` *String* - 当前目录名称

         *  `module(data, name)` *Function* - 模块加载完毕的回调函数，this指向当前层级容器。如果无数据返回，则该模块输出为空。

               *  `data` * - 当前模块导出数据

               *  `name` *String* - 当前模块名称，不含后缀

         *  `before()` *Function* - 当前等级下所有目录、模块在加载前执行的钩子函数（仅在当前层级触发，不对子集继承）

         *  `after()` *Function* - 当前等级下所有目录、模块在加载后执行的钩子函数（仅在当前层级触发，不对子集继承）

为当前目录实例下的一级子节点声明装载配置项。

### this.load()

声明装载目录子集配置项，该操作仅用与生成元数据。

### this.save(container)

指定导出数据的容器

### this.ran()

执行装载任务

### 装载配置文件

lloader(path)指定根目录支持可选的.loader.js配置文件，数据结构与this.load(options)参数一致，但优先级要高于this.load(options)。


#### 示例

```js
module.exports = {
   'config': {
      level: 1
   },
   'model': {
      level: 8
   },
   'bb.js': {
      level: 3
   }
}
```


### this.lode(options)

装载当前配置实例，options参数是可选的，数据结构与load(options)一致

#### 示例

```js
const lloader = require('lloader')

const app = {};

lloader('app').lode({
   "other": {
      "level": 3
   },
   "controller": {
      "level": 3
   },
   "model": {
      "level": 1
   }
}).save(app);

console.log(app)
```


### lloader.loadAll()

按照分级规则批量装载所有的配置实例

#### 示例

```js
const lloader = require('lloader')

const app = {}
lloader('app').load({
   "model": {
      "level": 2,
      module(filename, data) {
         if (data instanceof Function) {
            return data(this)
         }
      },
   },
   "controller": {
      "level": 3
   },
}).save(app)

const user = {}
lloader('app').load({
   "middleware": {
      "level": 5
   }
}).save(user)

lloader.loadAll()
```
