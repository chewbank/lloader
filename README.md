## lloader

node.js模块分级、批量装载器。通过预声明模块间的载入等级，动态管理模块的装载顺序。

### 特性

* 支持目录、模块分级加载，每个目录拥有独立的分级规则

* 每个目录均支持可选的装载配置文件，实现模块的多层级、精细化管理

* 支持api和配置文件两种方式定义加载项

* 支持配置项深度继承和覆盖


### install

      npm install lloader

### 使用方法

```js
const lloader = require('lloader')

const container = {}

lloader('app', container).set({
   "model": {
      "level": 1
   }
})

lloader.lode()
```

### lloader(path ,container)

*  `path` *String* 批量加载模块所在目录的相对路径

*  `container` *Object* 将模块导出结果保存到指定容器中

添加目录装载项，返回当前目录配置实例

### this.set(options)

*  `options` *Object* 

      *  `$name` *Object, Boolean* - 装载选项名称，当值为false时表示排除指定目录或模块（无特殊说明时，所有子参数均为可选）

         *  `level` *Number* - 加载等级，默认100

         *  `contain` *Array* - 仅加载指定模块或目录，不能与exclude同时使用（支持子集继承）

         *  `exclude` *Array* - 排除指定模块或目录，不能与contain同时使用（支持子集继承）

         *  `before(data ,container)` *Function* - 目录、模块加载前置钩子函数（仅在当前层级触发，不对子集继承）

               *  `data` * - 当前目录、模块导出前的数据

               *  `container` *String* - 当前目录、模块的父级容器

         *  `directory(data, name)` *Function* - 同一个配置目录下的所有子集导出完毕后的数据处理函数。如果无数据返回，则该目录结构体不会被创建（支持子集继承）

               *  `data` *Object* - 当前目录下所有子集导出数据集合

               *  `name` *String* - 当前目录名称

         *  `module(data, name)` *Function* - 模块导出数据处理函数，this指向当前层级容器。如果无数据返回，则该模块输出为空（支持子集继承）

               *  `data` * - 当前模块导出数据

               *  `name` *String* - 当前模块名称，不含后缀

         *  `after(data ,container)` *Function* - 目录、模块加载后置钩子函数（仅在当前层级触发，不对子集继承）

               *  `data` * - 当前目录、模块导出后的数据

               *  `container` *String* - 当前目录、模块的父级容器

为当前目录实例下的一级子节点声明装载配置项。


### ...loader.js 配置文件

每个目录均支持可选的加载配置文件，导出数据结构与set(options)一致，但优先级高于set(options)。

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

装载当前配置实例，options参数是可选的，数据结构与set(options)一致

#### 示例

```js
const lloader = require('lloader')

const app = {}
lloader('app', app).lode({
   "other": {
      "level": 3
   },
   "controller": {
      "level": 3
   },
   "model": {
      "level": 1
   }
})

console.log(app)
```


### lloader.lode()

按照分级规则批量装载所有的配置实例

#### 示例

```js
const lloader = require('lloader')

const app = {}
lloader('app', app).set({
   "model": {
      "level": 2,
      module(filename, data) {
         if (data instanceof Function) {
            return data(this)
         }
      },
   },
   "controller": {
      "level": 3,
      "contain": ["_route.js"],
   },
})

const user = {}
lloader('components/user/app', user).set({
   "middleware": {
      "level": 5
   }
})

lloader.lode()
```
