## lloader

node.js模块分级、批量装载器。通过预声明模块的载入等级，实现模块间装载顺序的动态管理。

### 特性

* 支持目录、模块分级加载，每个目录使用独立的分级规则

* 支持使用api和配置文件两种方式定义加载项

* 每个目录均支持可选的配置文件，实现多层级、精细化管理

* 支持配置项深度继承和覆盖


### install

      npm install lloader

### 使用方法

```js
const lloader = require('lloader')

const container = {}

lloader('app', container).set({
   "models": {
      "level": 1
   }
})

lloader.lode()
```

### lloader(path ,container).set(options)

*  `path` *String* 批量加载模块所在目录的相对路径

*  `container` *Object* 将模块导出结果保存到指定容器中

*  `options` *Object* 

      *  `$name` *Object* - 装载选项名称

         *  `level` *Number* - 加载等级

         *  `contain` *Array* - 仅加载指定模块或目录，不能与exclude同时使用（可选）

         *  `exclude` *Array* - 排除指定模块或目录，不能与contain同时使用（可选）

         *  `import(filename, data)` *Function* - 模块导出数据处理函数，this指向当前层级容器。用于数据检验、预处理等操作（可选）

               *  `filename` *String* - 当前文件名称，不含后缀

               *  `data` * - 模块导出数据

         *  `complete(data)` *Function* - 同一个配置项下的所有模块导出完成后的数据处理函数。用于数据检验、预处理等操作（可选）

               *  `data` *Object* - 所有子集模块导出数据集合

预添加分级装载配置项，通过lode()方法激活并执行。如果你需要即时执行装载器，请使用now()方法。


### ...load.js 配置文件

每个目录均支持可选的加载配置文件，导出数据结构与set(options)一致，但优先级高于set(options)。

#### 示例

```js
module.exports = {
   'config': {
      level: 1
   },
   'models': {
      level: 8
   },
   'other': {
      level: 6
   },
   'bb.js': {
      level: 3
   }
}
```


### lloader.lode()

批量执行由set()方法添加的分级装载配置项

#### 示例

```js
const lloader = require('lloader')

const app = {}
lloader('app', app).set({
   "models": {
      "level": 2,
      import(filename, data) {
         if (data instanceof Function) {
            return data(this)
         }
      },
   },
   "controllers": {
      "level": 3,
      "contain": ["_route.js"],
   },
})

const user = {}
lloader('component/user/app', user).set({
   "middleware": {
      "level": 5
   }
})

lloader.lode()
```


### lloader(path ,container).now(options)

即时执行装载器，参数与set(options)一致。

#### 示例

```js
const lloader = require('lloader')

const app = {}
lloader('app', app).now({
   "other": {
      "exclude": ['a.js']
   },
   "controllers": {
      "exclude": ['b.js']
   },
   "models": {
      "exclude": ['c.js']
   }
})

console.log(app)
```
