"use strict"

const test = require('jtf')
const typea = require('typea')
const path = require('path')
const lloader = require('..')

const appPath = path.join(process.cwd(), 'app');

test('load', t => {

   const app = {}

   lloader(appPath, app).load({
      "other": {
         "level": 6
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