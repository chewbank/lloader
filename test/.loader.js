"use strict"

const test = require('jtf')
const typea = require('typea')
const lloader = require('..')

test('app', t => {

   const app = {}

   lloader('app', app)
   
   lloader.load()

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
      },
      bb: Number
   })

   t.ok(data, error)

})