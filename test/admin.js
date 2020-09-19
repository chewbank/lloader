"use strict";

const test = require('jmr')
const path = require('path')

const { Lloader } = test;

const appPath = path.join(process.cwd(), 'admin');

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
      index: {
         tt: 999
      },
      mm: {
         sst: 668
      }
   })

})