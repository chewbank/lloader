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

*  `options` *Object* 无特殊说明时，所有子参数均为可选

      *  `$name` *Object, Boolean* - 装载选项，$name对应目录名称或包含.js、.json后缀的文件名。当值为false时表示不装载该目录或模块

         *  `level` *Number* - 加载等级，默认100

         *  `contain` *Array* - 仅加载指定模块或目录，不能与exclude同时使用（支持子集继承）

         *  `exclude` *Array* - 排除指定模块或目录，不能与contain同时使用（支持子集继承）

         *  `directory(data, name)` *Function* - 同一个配置目录下的所有子集导出完毕后的数据处理函数。如果无数据返回，则该目录结构体不会被创建（支持子集继承）

               *  `data` *Object* - 当前目录下所有子集导出数据集合

               *  `name` *String* - 当前目录名称

         *  `module(data, name)` *Function* - 模块导出数据处理函数，this指向当前层级容器。如果无数据返回，则该模块输出为空（支持子集继承）

               *  `data` * - 当前模块导出数据

               *  `name` *String* - 当前模块名称，不含后缀

         *  `before()` *Function* - 当前等级下所有目录、模块在加载前执行的钩子函数（仅在当前层级触发，不对子集继承）

         *  `after()` *Function* - 当前等级下所有目录、模块在加载后执行的钩子函数（仅在当前层级触发，不对子集继承）

为当前目录实例下的一级子节点声明装载配置项。


### ...loader.js 配置文件

每个目录均支持可选的装载配置文件，导出数据结构与set(options)一致，但优先级高于set(options)。

#### 贪婪模式

找不到...loader.js配置文件时为贪婪模式，即遍历加载当前目录下所有一级子节点。

#### 惰性模式

找到...loader.js文件时为惰性模式，仅装载配置文件中指定的配置项目。


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
      "level": 3
   },
})

const user = {}
lloader('app', user).set({
   "middleware": {
      "level": 5
   }
})

lloader.lode()
```
