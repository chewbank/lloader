"use strict"

const lloader = require('..')
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