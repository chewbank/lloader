"use strict";

const test = require('jtf')
const path = require('path')
const Lloader = require('..')

const appPath = path.join(process.cwd(), 'index');

test('module', t => {

   const app = {}

   const lloader = new Lloader(appPath, app);

   lloader.addLoads({
      "index.js": {
         "level": 1
      },
      "mm.js": {
         "level": 1
      },
   })

   Lloader.loadAll([lloader]);

   t.deepStrictEqual(app, {
      tt: 999,
      mm: {
         sst: 668
      }
   })

})