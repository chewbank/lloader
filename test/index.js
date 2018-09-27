"use strict"

const lloader = require('..')
const app = {}

lloader(app).add({
   "extend": {
      "level": 6,
      "path": "app/extend",
      import(name, data) {
         if (data instanceof Function) {
            return data(this)
         }
         return data
      },
      complete(data) {
         for (let name in data) {
            this[name] = data[name]
         }
         return data
      }
   },
   "controllers": {
      "level": 3,
      "path": "app/controllers",
      import(name, data) {
         if (data instanceof Function) {
            return data(this)
         } else {
            throw new Error(`controllers中${name}模块导出必须为函数类型`)
         }
      },
   }
})


lloader(app).add({
   "models": {
      "path": "app/models",
      "level": 1,
      import(name, data) {
         if (data instanceof Function) {
            return data(this)
         } else {
            throw new Error(`models中${name}模块导出必须为函数类型`)
         }
      },
   }
})


lloader.load()


console.log(app)
