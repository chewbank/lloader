"use strict"

const test = require('jtf')
const typea = require('typea')
const lloader = require('..')

test('now', t => {

   const app = {}

   lloader('app', app).now({
      "other": {
         "level": 6
      },
      "controllers": {
         "level": 3
      },
      "models": {
         "level": 1
      }
   })

   const { data, error } = typea.strict(app, {
      config: { db: Function },
      controllers: {
         a: Function,
         c1: { a: Function },
         index: Function
      },
      models: { index: Function },
      helper: {
         db: { xx: 666 },
         sub: {
            s1: Function,
            s2: Function
         }
      }
   })

   t.ok(data, error)

})