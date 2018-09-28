# lloader

node.js模块分级、批量装载器。通过预声明模块的载入等级，实现模块间装载顺序的动态管理。

### install

      npm install lloader

### 使用方法

```js
const lloader = require('lloader')

const container = {}

lloader(container).add({
   "models": {
      "level": 1,
      "path": "app/models",
      "exclude": ['load.js']
   }
})

lloader.lode()
```

### lloader(container).add(options)

*  `container` *Object* 将模块导出结果保存到指定容器中

*  `options` *Object* 

      *  `$name` *Object* - 装载选项名称

         *  `level` *Number* - 加载等级

         *  `path` *String* - 指定模块加载递归目录（必填）

         *  `contain` *Array* - 仅加载指定模块或目录，不能与exclude同时使用（可选）

         *  `exclude` *Array* - 排除指定模块或目录，不能与contain同时使用（可选）

         *  `import(filename, data)` *Function* - 模块导出数据处理函数，this指向当前层级容器。用于数据检验、预处理等操作（可选）

               *  `filename` *String* - 当前文件名称，不含后缀

               *  `data` * - 模块导出数据

         *  `complete(data)` *Function* - 同一个配置项下的所有模块导出完成后的数据处理函数，this指向根容器。用于数据检验、预处理等操作（可选）

               *  `data` *Object* - 所有子集模块导出数据集合

预添加分级装载配置项，最终由lode()激活并执行。如果你需要即时执行装载器，请使用now()方法。

### lloader(container).lode()

执行由add()方法添加的分级装载项

#### 示例

```js
const lloader = require('lloader')

const app = {}

lloader(app).add({
   "models": {
      "level": 2,
      "path": "models/",
      import(filename, data) {
         if (data instanceof Function) {
            return data(this)
         } else {
            throw new Error(`${filename}模块导出必须为函数类型`)
         }
      },
   },
   "controllers": {
      "level": 3,
      "path": "controllers/",
      "contain": ["_route.js"],
   },
})

lloader(app).add({
   "middleware": {
      "level": 5,
      "path": "middleware/",
      complete(data) {
         for (let name in data) {
            this[name] = data[name]
         }
         return data
      }
   }
})

lloader.lode()
```

### lloader(container).now(options)

即时执行装载器，除了不支持level选项外，其它参数与add()方法基本一致。now()方法只是[batch-import](https://github.com/xiangle/batch-import)模块的接口包装器。

#### 示例

```js
const lloader = require('lloader')
const app = {}

const container = lloader(app).now({
   "other": {
      "level": 6,
      "path": "app/other",
      "exclude": ['...load.js']
   },
   "controllers": {
      "level": 3,
      "path": "app/controllers",
      "exclude": ['...load.js']
   },
   "models": {
      "level": 1,
      "path": "app/models",
      "exclude": ['...load.js']
   }
})

console.log(container)
```
