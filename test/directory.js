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
      "controller": {
         "level": 3
      },
      "model": {
         "level": 1
      }
   })

   const { data, error } = typea.strict(app, {
      config: { db: Function },
      controller: {
         a: Function,
         c1: { a: Function },
         index: Function
      },
      model: { index: Function },
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