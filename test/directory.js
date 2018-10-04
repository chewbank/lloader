"use strict"

const test = require('jtf')
const typea = require('typea')
const lloader = require('..')

test('directory', t => {

   const app = {}

   lloader('app', app).load({
      "other": {
         "level": 6,
         directory(data){
            return data
         }
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
         db: Function,
         sub: {
            s1: Function,
            s2: Function
         }
      }
   })

   t.ok(data, error)

})