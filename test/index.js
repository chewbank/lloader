"use strict"

const lloader = require('..')
const app = {}

lloader(app).add({
   "other": {
      "level": 6,
      "path": "app/other",
      "exclude": ['...load.js']
   },
   "controllers": {
      "level": 3,
      "path": "app/controllers",
      "exclude": ['...load.js']
   }
})

lloader(app).add({
   "models": {
      "level": 1,
      "path": "app/models",
      "exclude": ['...load.js']
   }
})

lloader.load()

console.log(app)
