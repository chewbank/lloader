"use strict"

const test = require('jtf')
const typea = require('typea')
const path = require('path')
const Lloader = require('..')

const appPath = path.join(process.cwd(), 'app');

test('load', t => {

   const app = {}

   const lloader = new Lloader(appPath, app);

   lloader.load({
      "config": {
         "level": 1
      },
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

   Lloader.loadAll([lloader]);

   const { data, error } = typea.strict(app, {
      config: {
         db: Object
      },
      controller: {
         a: Function,
         c1: { a: Function }
      },
      model: Function,
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